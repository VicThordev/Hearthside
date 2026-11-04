# Hearthside — Codebase Evaluation

**Date:** 3 November 2026
**Commit evaluated:** `84ee299` (`main`, clean working tree)
**Scope:** `heartside/` front end (React 19 + Vite 8), API server (Express 4 + Supabase service-role), Supabase migrations, CI.

This report complements the existing [SITE_EVALUATION.md](SITE_EVALUATION.md). It re-checks that document's claims against the current code and records **new defects it did not catch**. Several of these defects are in the security and data-integrity layer that the remediation notes describe as hardened.

---

## 1. Summary

| Area | Rating | Notes |
| --- | --- | --- |
| UI / product design | Good | Polished, coherent information architecture; lazy-loaded views; demo mode clearly flagged. |
| API server | Fair | Small, readable, validates input with Zod, checks membership and role on every circle-scoped route. Has error-handling and audit gaps. |
| Database schema | **Poor** | Contains a privilege-escalation policy, a one-circle-per-user constraint, and an audit trigger that blocks normal deletes. |
| Test coverage | Poor | 3 unit tests (role table only). No API, SQL/RLS, or UI tests. |
| Production build | **Broken for images** | 54 image references point to `/src/assets/...`, which does not exist in `dist/`. |
| Readiness for real data | Not ready | Matches the existing evaluation's no-go. The issues below make the backend foundation less safe than that document suggests. |

**Top 3 actions:**
1. Drop or narrow the `circle_members` UPDATE policy (§3.1). This is exploitable today by any signed-in user.
2. Remove `unique` from `circle_members.user_id` (§3.2).
3. Rework the append-only audit trigger so cascades and `SET NULL` still work (§3.3).

---

## 2. Validation performed

| Command | Result |
| --- | --- |
| `npm run lint` (client `tsc`) | ✅ Pass. Client tsconfig is **not** `strict`, so this check is weak. |
| `npm run lint:server` | ✅ Pass (`strict: true`) |
| `npm test` | ✅ 3/3 pass |
| `npm run build` | ✅ Builds, ⚠️ main chunk `index-*.js` is **700 kB** (199 kB gzip) |
| `npm audit --omit=dev` | ⚠️ 1 high: `body-parser` DoS (GHSA-27r3-jxmh-p828). Fix with `npm audit fix`. |
| `heartside/.env` | Not tracked by git (correctly ignored). Contents were not inspected. |

Size: about 17.5k lines of TS/TSX/SQL. Most of it is UI; the server is about 280 lines.

---

## 3. Critical and high-severity findings (new)

### 3.1 🔴 CRITICAL — Any authenticated user can make themselves `owner`, or move into another circle

[202610220002_auth_and_policies.sql:13-16](heartside/supabase/migrations/202610220002_auth_and_policies.sql#L13-L16)

```sql
create policy "members can update their own display name"
  on public.circle_members for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

The policy's name says "display name", but it allows updating **every column**. Supabase grants `UPDATE` on `public` tables to `authenticated` by default, and no migration revokes it. Using only the public anon key, which is shipped in the browser bundle, a user can run:

```js
supabase.from('circle_members').update({ role: 'owner' }).eq('user_id', myId)
// or: .update({ circle_id: '<victim-circle-uuid>', role: 'owner' })
```

The API trusts `circle_members.role` and `circle_id` in [server/auth.ts:26-35](heartside/server/auth.ts#L26-L35). A `restricted_helper` can therefore grant themselves document access. Anyone who learns a circle UUID can join that circle as owner and read its notes and documents.

**Fix:** Drop the policy. Let the API handle display-name changes. If self-service must stay, do both:
- `revoke update on public.circle_members from authenticated;`
- `grant update (display_name) on public.circle_members to authenticated;`

Add an RLS test that asserts role and circle changes are rejected.

### 3.2 🔴 HIGH — `circle_members.user_id` is globally `unique`: a user can belong to only one circle

[202610220001_initial_schema.sql:33](heartside/supabase/migrations/202610220001_initial_schema.sql#L33)

`user_id uuid unique` contradicts the product model, in which a caregiver belongs to several families. It also contradicts the existing code:
- `GET /api/v1/circles` returns a list.
- The UI has a circle switcher.
- `circle_invites` exists.

A user who already has a circle gets a `23505` error from `create_care_circle`, which surfaces as a generic **500**. Accepting an invite to a second circle will be impossible.

**Fix:** Replace it with `unique (circle_id, user_id)`.

### 3.3 🔴 HIGH — Append-only audit trigger breaks member removal and circle deletion

[202610220004_domain_and_audit_hardening.sql:91](heartside/supabase/migrations/202610220004_domain_and_audit_hardening.sql#L91) combined with [202610220001_initial_schema.sql:87-88](heartside/supabase/migrations/202610220001_initial_schema.sql#L87-L88)

`audit_events` rejects every `UPDATE` and `DELETE`. But:
- `actor_member_id ... on delete set null` issues an **UPDATE** on audit rows when a member is deleted. **Removing any member who has acted fails.**
- `circle_id ... on delete cascade` issues a **DELETE**. **Deleting a circle fails**, and so does deleting an auth user who owns one: `auth.users → circle_members` cascades into the same problem.

This also blocks the "Data export & deletion" settings flow once it is implemented.

**Fix:** Decide on a retention policy explicitly. Options:
- Remove the FKs from `audit_events` and keep IDs as plain UUIDs (most common for audit logs).
- Or allow mutation only from a specific `security definer` purge function, for example by gating the trigger on a session setting.

### 3.4 🟠 HIGH — Duplicate and unattributed audit rows; audit write failures ignored

- Inserts into `care_events`, `care_notes` and `documents` fire `audit_row_change()`, which writes a row with `actor_member_id = NULL`. The API then writes a **second** row with the actor ([server/index.ts:107](heartside/server/index.ts#L107), [:140](heartside/server/index.ts#L140)). Every create is logged twice, and one of the two rows is unattributed.
- The result of each `audit_events` insert is never checked, including the download-URL audit at [server/index.ts:161](heartside/server/index.ts#L161). A failed audit write is silent, yet the signed URL is still returned.
- The data write and the audit write are not atomic.

**Fix:** Use one mechanism. Either:
- pass the actor into the trigger (for example `set_config('app.actor_member_id', …)` inside an RPC), or
- drop the triggers and do data and audit writes in a single RPC.

Check the `error` field of each audit insert. For downloads, fail closed if the audit write fails.

### 3.5 🟠 HIGH — Production build has broken images

The code contains 54 string literals such as `'/src/assets/images/sarah_vance_avatar_….jpg'`, for example in [TopHeader.tsx:247](heartside/src/components/TopHeader.tsx#L247) and [App.tsx:124](heartside/src/App.tsx#L124). Vite serves `/src/...` only in dev. `dist/` contains **0** `.jpg` files, so every avatar and photo 404s once deployed.

**Fix:** Either move the images to `public/images/` and reference `/images/...`, or `import` them so Vite fingerprints and bundles them. The images total 5.8 MB, so compress them as well.

---

## 4. Medium findings

| # | Finding | Location | Recommendation |
| --- | --- | --- | --- |
| M1 | Database and constraint errors surface as **500**. Examples: malformed `X-Care-Circle-Id` (`22P02`), `endsAt < startsAt` (check violation), duplicate member (`23505`). The error handler maps only `ApiError` and `ZodError`. | [server/http.ts:15-17](heartside/server/http.ts#L15-L17), [server/auth.ts:24](heartside/server/auth.ts#L24) | Validate the circle header with `z.string().uuid()`. Add `.refine(endsAt >= startsAt)`. Map Postgres codes to 400/409. |
| M2 | Rate limiter sees the proxy IP behind any load balancer, so all users share one bucket. It is also a single global 300 per 15 minutes, with nothing per user or for auth. | [server/index.ts:18](heartside/server/index.ts#L18) | Set `app.set('trust proxy', n)` for the deployment. Key the limit by user ID on authenticated routes. |
| M3 | `/healthz` and `/readyz` are unauthenticated and each call queries the database. They are identical, so liveness depends on the database. | [server/index.ts:29-39](heartside/server/index.ts#L29-L39) | Make `/healthz` process-only. Keep the database check in `/readyz`. |
| M4 | `timezone` accepts any string up to 64 characters. | [server/index.ts:44](heartside/server/index.ts#L44) | Validate with `Intl.supportedValuesOf('timeZone')` or a `try { new Intl.DateTimeFormat(undefined, { timeZone }) }` check. |
| M5 | Notes and events do not record their author (`created_by_member_id`). The UI shows authors, but the database cannot supply them. | `care_events`, `care_notes` | Add an author FK and populate it from `memberId`. |
| M6 | Test name contradicts its assertion: "collaborators cannot upload **or access** document files" while it asserts `document:read === true`. | [server/auth.test.ts:12-16](heartside/server/auth.test.ts#L12-L16) | Rename the test, or fix the permission if collaborators should not read documents. Note that `roleCan` keys on `string` while the DB enum is the source of truth; derive the type from it. |
| M7 | Changing circle writes `localStorage` but changes no React state, so nothing reloads. Sign-out does not clear the stored circle ID. | [App.tsx:376](heartside/src/App.tsx#L376), [App.tsx:240](heartside/src/App.tsx#L240) | Keep the active circle in state or context. Clear it on sign-out. |
| M8 | `create_care_circle` is `security definer` but still trusts its caller-supplied `p_owner_id`. Today only `service_role` can execute it, which is fine. Keep it that way. | [202610220003…sql](heartside/supabase/migrations/202610220003_transactional_circle_creation.sql) | Add a comment or test asserting that `authenticated` cannot execute it. |
| M9 | The new domain tables (tasks, invites, medications, vitals, notifications) have RLS enabled but no API or UI. `circle_invites` has `unique(circle_id, email, status)`, which allows only one revoked or expired invite per email ever. | 202610220004 | Use a partial unique index: `where status = 'pending'`. |
| M10 | 700 kB entry chunk. | build output | Split `@supabase/supabase-js` and `lucide-react` with `manualChunks`. Load Supabase only after the user leaves the landing page. |

---

## 5. Low findings and hygiene

- **Unused dependencies:** `@google/genai` and `motion` are never imported. `metadata.json` still declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`.
- **Misplaced dependencies:** Build tooling (`vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`) sits under `dependencies`, and so do the server deps. Consider separate client and server packages, or at least move the build tools to `devDependencies`.
- **AI Studio leftovers:**
  - package name is `react-example`
  - `.aistudio/` (776 kB of screenshots) is committed
  - the Vite config carries the `DISABLE_HMR` comment
  - `experimentalDecorators` and `useDefineForClassFields: false` are set but unused
- **Client tsconfig lacks `strict: true`:** the UI (about 16k lines) has no null-safety checks.
- **Redundant note fields:** `note_category` includes `'critical'` and there is also `is_critical`, so the meaning of "critical" is ambiguous.
- **Component size:** Several view components exceed 1,000 lines (`AllActivitiesSegment`, `TasksView`, `CareNotesView`, `LandingPageView`). They mix mock data, state and markup. Split them before connecting them to the API.
- **README out of date:** It says to apply "both SQL migrations"; there are four.
- **Async route errors:** Express 4 async handlers without `try` (`/healthz`, `/readyz`) will cause unhandled rejections if the Supabase client throws. Use Express 5, or wrap the handlers.
- **No graceful shutdown:** There is no `SIGTERM` handler to drain connections.

---

## 6. What's done well

- The service-role key is server-only and isolated in [server/supabase.ts](heartside/server/supabase.ts). The browser uses only the anon key.
- Every circle-scoped API route re-verifies the bearer token with `auth.getUser()` and checks both membership and role capability.
- Zod validation runs at every write endpoint, with sane length limits that are mirrored by DB `check` constraints.
- Circle creation is transactional through an RPC that only `service_role` can execute.
- The documents bucket is private, with 60-second signed URLs and a MIME and size allow-list.
- Logging is structured JSON, with request IDs and an explicit "no PHI in logs" policy.
- Demo mode is the default and is clearly bannered, and live mode refuses unconnected actions instead of faking them.
- CI runs type checks, tests and the build on every push and PR.

---

## 7. Status of the earlier evaluation's items

| ID | Claimed status | Verified |
| --- | --- | --- |
| B-02 Mock data | Open | ✅ Still open. Only circle list and create hit the API. |
| B-03 Vault upload | Open | ✅ Still open. There is no upload endpoint. |
| B-04 Role enforcement | Remediated | ⚠️ **Server-side yes, but bypassable via §3.1.** |
| B-06 Tests/CI | Partially | ✅ CI exists. Tests cover only the role table. |
| H-03 Atomic circle creation | Remediated | ⚠️ Atomic, but fails for any second circle (§3.2). |
| H-04 Audit trail | Remediated | ❌ **Duplicate rows, unchecked writes, and it blocks deletes (§3.3, §3.4).** |
| M-02 Bundle splitting | Remediated | ⚠️ Views are split, but the entry chunk is still 700 kB. |
| M-03 Circle switcher | Remediated | ⚠️ Switching has no effect until reload (M7). |

---

## 8. Recommended order of work

1. **Today:**
   - Fix the `circle_members` policy and grants (§3.1).
   - Run `npm audit fix`.
2. **Next migration:**
   - Change `user_id` to unique per circle (§3.2).
   - Restructure audit FKs and the trigger (§3.3).
   - Make one audit path carry the actor (§3.4).
   - Use a partial unique index on invites (M9).
3. **Server:**
   - Map Postgres errors to 4xx and validate UUID headers (M1).
   - Set `trust proxy` and per-user limits (M2).
   - Split health from readiness (M3).
4. **Front end:**
   - Fix the asset paths (§3.5).
   - Enable `strict` in the client tsconfig.
   - Hold the active circle in state (M7).
   - Remove the unused dependencies.
5. **Tests:**
   - Add pgTAP or supabase-test RLS tests, covering at least role escalation, cross-circle reads and the delete cascade.
   - Add supertest API tests for 401/403/400 paths.
   - Add a Playwright smoke test of the demo build that checks images load.
6. **Then continue the earlier evaluation's plan:** wire calendar and notes to the API, and build the vault upload.

---

## 9. Remediation status — 3 November 2026

Verified with:
- `npm run lint` (now `strict`)
- `npm run lint:server`
- `npm test` (10 tests)
- `npm run test:db` (all migrations plus policy tests on PostgreSQL 16)
- `npm run build`
- `npm audit` (0 vulnerabilities)

| Finding | Status | Change |
| --- | --- | --- |
| §3.1 Role escalation | ✅ Fixed | `202611030001`: `authenticated` may update only `display_name`; insert/update/delete revoked otherwise. Policy test proves role and circle changes are rejected; the same check succeeds against the old schema. |
| §3.2 One circle per user | ✅ Fixed | `unique (circle_id, user_id)` replaces the global unique. |
| §3.3 Audit blocks deletes | ✅ Fixed | Audit FKs dropped, so the IDs are kept as plain UUIDs. Member removal, user deletion and circle deletion now succeed, and the trail is retained. |
| §3.4 Duplicate audit rows | ✅ Fixed | New `created_by_member_id` columns. The trigger attributes inserts (and updates/deletes via `app.actor_member_id`). The API no longer writes duplicate rows, and the download-URL audit fails closed. |
| §3.5 Broken images | ✅ Fixed | Images moved to `public/images/` and recompressed (5.8 MB → 0.6 MB). Three references that never existed now point to the real files. |
| M1 DB errors as 500 | ✅ Fixed | Postgres codes are mapped to 400/409, the circle header and document ID are validated as UUIDs, and `endsAt ≥ startsAt` is enforced. |
| M2 Rate limiting | ✅ Fixed | `TRUST_PROXY_HOPS` setting; per-IP ceiling plus per-user limit on `/api/v1`. The token is verified once per request. |
| M3 Health checks | ✅ Fixed | `/healthz` is process-only; `/readyz` checks the database and catches throws. |
| M4 Time zone | ✅ Fixed | Validated against `Intl`. |
| M5 Note/event author | ✅ Fixed | `created_by_member_id` populated by the API. |
| M6 Test name / role type | ✅ Fixed | Renamed; `MemberRole` mirrors the DB enum; test file renamed to `permissions.test.ts`. |
| M7 Circle switching | ✅ Fixed | Active circle is in React state; the portal remounts per circle; sign-out clears it. |
| M8 RPC privileges | ✅ Fixed | Covered by a policy test. |
| M9 Invite uniqueness | ✅ Fixed | Partial unique index on pending invites. |
| M10 Entry chunk | ✅ Fixed | 700 kB → 53 kB entry; vendor chunks for React, Supabase and icons. |
| Low: deps, AI Studio leftovers, tsconfig, README, shutdown | ✅ Fixed | `@google/genai` and `motion` removed; build tools moved to dev deps; package renamed; `.aistudio/` untracked; `DISABLE_HMR` hook removed; `SIGTERM` drain added. |
| Low: `'critical'` note category vs `is_critical` | ⏸ Deferred | Removing a Postgres enum value requires a product decision and a data migration. |
| Low: 1,000+ line components | ⏸ Deferred | Split them when each view is connected to the API, so that refactor and data wiring are reviewed together. |
| §8.5 API/browser end-to-end tests | ⏸ Partial | Unit and DB policy tests were added. Supertest and Playwright suites still need a test Supabase project. |

**Deploying:** Apply `heartside/supabase/migrations/202611030001_membership_and_audit_fixes.sql` to every existing Supabase project. Until then, the API writes to columns that do not exist yet, and the escalation remains open.

---

## 10. Run-through findings — 3 November 2026

Found by running the app in a browser against the configured Supabase project. These were not in the original report.

| Finding | Status | Change |
| --- | --- | --- |
| Configured Supabase project has none of the app's tables | ❌ **Open** | No migrations have been applied. This needs Supabase credentials that are not on this machine. |
| `/readyz` reported ready with every table missing | ✅ Fixed | `supabase-js` treats a 404 `HEAD` as success. It now runs a real query on a column from the newest migration. |
| "Open Fictional Preview" required a real login, the API and the database | ✅ Fixed | Demo mode needs no backend. Live mode still requires all of them. |
| Added notes and events never appeared | ✅ Fixed for this session | The notes feed and calendar are static markup. Added items now render above the samples, but are not saved. |
| Empty Switch Circle dialog in demo; hero text over the New menu; missing favicon | ✅ Fixed | |
| Live mode screens are not connected to the API | ❌ **Open** | Sign-in and circle creation use the API. Calendar and notes do not read or write it yet, even though the endpoints exist. |
| Google and Apple sign-in buttons | ❌ **Open** | Only email is enabled on the Supabase project, so these buttons will fail. |

---

## 11. Full functional test — 4 November 2026

Run against the real Supabase project after the migrations were applied, using temporary users that were deleted afterwards.

| Suite | Result |
| --- | --- |
| API, permissions and direct browser-key attacks | 102 of 107 at first run. 2 fixed, 1 was a test-script error, 2 need the new bucket migration. |
| Live-mode UI in Chrome | 27 of 30 after the Calendar crash fix. The 3 failures are the hard-coded sample data below. |
| Demo-mode click sweep | 435 clicks across all screens and sub-tabs; 0 crashes, console errors or failed requests. 52 buttons were skipped (disabled or not clickable). |
| Regression | Type checks, 11 unit tests, database policy tests, build and `npm audit` all pass. |

**Fixed during testing**

| Finding | Change |
| --- | --- |
| Calendar crashed the whole app for any account with no events | Detail panel now requires a selected event. |
| One screen crash blanked the whole app | Added `ErrorBoundary` around the portal views. |
| Malformed JSON and oversized bodies returned 500 | Now 400 and 413, with a unit test. |

**Open**

| Severity | Finding | Next step |
| --- | --- | --- |
| 🔴 Critical | Live mode shows fictional clinical data as if real on all 9 screens, including vitals, medication, contacts and "Good afternoon, Sarah". The sidebar and header show Eleanor Vance's circle whichever circle is selected. | Connect screens to the API, or show an empty or "not available" state in live mode. Do not give live mode to real users until then. |
| 🔴 High | About 90 distinct buttons show only a pop-up. Many claim something happened, such as "Care Circle notified via SMS & push", "Confirmed handoff" or "Downloading verified document". None of it happens, and the same messages appear in live mode. | Disable them in live mode or build the actions. |
| 🟠 High | `care-documents` bucket has no size or file-type limits. It existed before the migration, whose `on conflict do nothing` skipped them. | Run `202611040001_document_bucket_limits.sql`. |
| 🟠 High | Deleting a circle removes document rows but leaves the stored files, which would then have no owner record. | Delete storage objects as part of circle deletion. |
| 🟠 High | No API for document upload, tasks, medications, vitals, invitations, notifications or member management. Tables exist, but only circles, events, notes and document reads are served. | Build per feature. |
| 🟠 Medium | After a page reload the signed-in user lands on the public landing page. The session itself survives. | Restore the portal view for signed-in users. |
| 🟠 Medium | Phone layout: the sidebar takes 256 of 390 px and cannot be dismissed, squeezing the content. | Collapse it by default on narrow screens. |
| 🟡 Medium | Google sign-in opens a raw JSON error ("provider is not enabled"). Apple uses the same path but was not clicked. | Enable the providers or hide the buttons. |
| 🟡 Medium | The invite code entered at sign-up is ignored. The shared-tablet PIN accepts any 4 digits; in live mode it grants nothing but shows a success state first. | Remove or implement them. |

**Not tested**
- Real sign-up, magic-link and password-reset emails, because these would send mail to fake addresses. Try them once with your own address.
- Session expiry and token refresh.
- Production hosting, and behaviour behind a proxy.
- Screen-reader and keyboard accessibility.

**Residue:** `audit_events` retains the test runs' rows. They hold only IDs and action names, and cannot be removed because the table is append-only.
