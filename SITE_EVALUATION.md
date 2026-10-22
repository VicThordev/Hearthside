# Hearthside: Senior Full-Stack Engineering Evaluation

**Assessment date:** 22 October 2026  
**Scope:** React client, Express API, Supabase schema/auth foundation, configuration, deployment posture, and product claims.  
**Method:** source review, TypeScript checks, production build, package audit, and configuration inspection. Secrets were not read or recorded.

## Executive assessment

Hearthside is a strong visual prototype that now has the beginnings of a credible backend: Supabase Auth, API bearer-token verification, care-circle membership checks, database migrations, and a basic onboarding flow. It is **not production-ready**, and it must not accept real medical, legal, insurance, access-code, or personally identifiable data.

The largest risk is the gap between what the interface claims and what the system actually enforces. It presents itself as HIPAA-compliant, encrypted, audited, protected by 2FA, connected to care services, and able to upload/export clinical records. Most of those capabilities are currently mock UI, browser state, or `alert()` calls. That is a launch blocker, especially for a healthcare-adjacent product.

## Validation performed

| Check | Result |
| --- | --- |
| Client type check: `npm run lint` | Passed |
| Server type check: `npm run lint:server` | Passed |
| Production build: `npm run build` | Passed |
| Dependency audit: `npm audit --omit=dev` | 0 known production vulnerabilities at review time |
| Live Supabase/API/auth verification | Not run: local Supabase credentials are still placeholders |
| Automated tests | None present |

The production build emits one JavaScript asset of approximately 1.33 MB (about 274 kB gzip) and warns about chunk size. Vite also warns that the use of `__dirname` in `heartside/vite.config.ts` is incompatible with its planned native config loader.

## Architecture observed

```text
React/Vite browser application
  ├─ Supabase browser client (Auth session only)
  ├─ API client with Bearer token + selected circle header
  └─ Mostly mock data and local React state

Express API
  ├─ Supabase service-role client
  ├─ User validation using supplied Bearer token
  ├─ Care-circle membership lookup
  └─ Events, notes, documents, and circle bootstrap endpoints

Supabase
  ├─ Auth users
  ├─ PostgreSQL care-circle schema
  ├─ RLS enabled on application tables
  └─ Private document-storage bucket declaration
```

This is the correct broad direction: browser code should use only the Supabase anon key, and the service-role key should remain in the API process. However, the API currently bypasses RLS through that service role, so the API's own authorization checks are the effective security boundary.

## Findings

### Release blockers

| ID | Finding | Evidence | Risk | Required action |
| --- | --- | --- | --- | --- |
| B-01 | Security, privacy, and HIPAA claims materially exceed the implementation. | `AuthView.tsx`, `LandingPageView.tsx`, vault/settings views advertise HIPAA compliance, AES-256, TLS 1.3, BAAs, audit trails, and 2FA; many associated actions remain mocked. | Users can reasonably rely on false assurances while entering sensitive data. | Remove or clearly mark all unverified claims as planned/demo-only until independently implemented and validated. Obtain legal/compliance review before reintroducing them. |
| B-02 | Core product data remains mock/browser-only. | `src/data/mockData.ts`, `App.tsx`, and many component-local `useState` stores; events/notes API exists but the primary calendar and notes views do not load it. | Data disappears, users see misleading data, and collaborative care is not real. | Define API contracts and migrate each screen to server data before enabling that workflow. Start with circle membership, events, notes, and tasks. |
| B-03 | Document vault is not a secure upload system. | Schema and signed download endpoint exist, but there is no authenticated upload, scanning, metadata creation transaction, versioning, retention/deletion worker, or UI integration. | Uploaded ePHI could be unsafe, unaudited, or inaccessible. | Build a private direct-upload flow with server authorization, strict content/size limits, malware scanning, checksum verification, metadata transaction handling, and expiry/retention policy. |
| B-04 | No authorization model beyond circle membership is enforced. | `server/auth.ts` checks membership; event/note/document APIs do not check `role`. The UI shows primary organizer, clinical, and restricted roles. | A restricted/helper account could perform actions that the UI implies it should not. | Publish a permission matrix, codify server-side capabilities per role, and test every endpoint against every role. Never rely on hidden buttons. |
| B-05 | Identity configuration is incomplete for the displayed auth choices. | Auth code calls password, magic-link, Google, and Apple flows; local environment lacks real Supabase values; provider and redirect configuration is external. MFA is not implemented. | Authentication can fail or be weaker than represented. | Configure real credentials and redirects, enable only supported providers, add MFA/enrollment/recovery policy, and test confirmation/reset/OAuth failure paths. |
| B-06 | There are no tests, CI, deployment definitions, backup/restore exercises, or monitoring. | No application test files, CI workflow, Docker/deployment files, or observability integration found. | Regressions, outages, and data-loss scenarios are undetectable or unrecoverable. | Add test tiers, CI gates, migration deployment, staging, error tracking, metrics, backups, restoration drills, and runbooks before beta. |

### High-priority engineering findings

| ID | Finding | Evidence | Recommendation |
| --- | --- | --- | --- |
| H-01 | API is not rate-limited or abuse-protected. | `server/index.ts` has Helmet/CORS/JSON limit but no rate limiter, request-size policy beyond JSON, abuse controls, or account-specific throttling. | Add reverse-proxy and API rate limits, auth throttling, upload quotas, request timeouts, and a WAF/CDN policy. |
| H-02 | API validation errors become generic 500s. | Zod parsing is used in endpoint handlers, but no Zod-specific error handler maps malformed requests to 400 responses. | Add a centralized Zod error mapper and a stable machine-readable error contract. |
| H-03 | Care-circle creation is not atomic. | `POST /api/v1/circles` creates a circle, then member, then recipient; only one failure path deletes the circle. | Use a PostgreSQL RPC/function or transaction-capable server workflow so all three writes succeed or roll back together. |
| H-04 | Audit trail is incomplete and not demonstrably immutable. | SQL triggers log event/note/document row changes only, with no authenticated actor attribution, auth/export/download entries, hash chaining, retention controls, or restricted write model. | Treat audit events as a dedicated security feature: capture actor, source/IP policy, action, resource, result, request ID, and minimal metadata; block modifications/deletions; centralize exports/downloads. |
| H-05 | Runtime observability is insufficient. | API writes basic console JSON; errors have no correlation-safe reporting, alerting, redaction policy, or dashboard. | Add structured logging with PII/ePHI redaction, request IDs propagated end-to-end, error monitoring, SLOs, and on-call alerting. |
| H-06 | Data model does not yet cover the product shown. | Schema covers circles/events/notes/documents, while UI also presents tasks, medication/vitals, invitations, notifications, comments, billing, services, exports, access sessions, and integrations. | Write a domain/data-model specification before continuing feature-by-feature migrations. Include ownership, lifecycle, retention, and permission rules. |
| H-07 | Current UI includes simulated clinical/operational actions. | Numerous `alert()` calls in calendar, document, care-team, settings, reports, and emergency views. | Replace with implemented endpoints, or disable and label each as unavailable. Do not let a visual simulation look operational. |
| H-08 | Mock content includes sensitive-style data and device/access details. | `mockData.ts` and views contain realistic names, clinical details, locations, medication text, and access-code-like values. | Confirm all data is fictional; remove access-code patterns and use clearly synthetic seeded fixtures. Keep fixtures out of production bundles where possible. |

### Medium-priority findings

| ID | Finding | Recommendation |
| --- | --- | --- |
| M-01 | No documented Node version, toolchain lock policy, or release versioning. | Add `engines`, `.nvmrc`/Volta, semantic release/versioning, and dependency-update policy. |
| M-02 | Large client bundle and no route splitting. | Add lazy-loaded views/routes, inspect bundle composition, and set performance budgets. |
| M-03 | The selected circle is stored in `localStorage`. | This is acceptable only as a preference; continue to authorize every request server-side and validate the selected ID against memberships, as the API currently does. Add a deliberate circle-switcher backed by the API. |
| M-04 | Supabase data access has mixed responsibilities. | Keep browser access limited to Auth until RLS policies and direct-access contracts are mature, or consistently use the API as the domain boundary. Document the chosen pattern. |
| M-05 | User-facing error/recovery states are thin. | Add network/offline behavior, expired-session handling, email confirmation return flow, loading skeletons, empty states, and accessible error announcements. |
| M-06 | Accessibility has not been verified. | Run automated scans and keyboard/screen-reader testing; establish WCAG 2.2 AA acceptance criteria, especially for seniors and emergency actions. |

## Supabase and security review

### Positive foundations

- The browser client uses the public anon key, while the server uses the service-role key.
- Application tables have RLS enabled.
- The API calls `supabase.auth.getUser()` against the presented bearer token rather than trusting a client-supplied user ID.
- Circle-scoped API calls require a membership record matching the authenticated user.
- Documents are configured as a non-public Supabase storage bucket and downloads use short-lived signed URLs.
- Client, server, and migration type/build checks pass.

### Important constraints

- A service-role Supabase client bypasses RLS. Every present and future API endpoint must authenticate and authorize before any query or storage action. A missed check is a cross-tenant data exposure.
- RLS currently has only a membership self-read/update policy. That safely blocks direct browser reads of clinical tables, but means all domain access depends on the API.
- The browser does not yet consume the newly created events/notes/document APIs in its main views.
- The report does not attest to actual cloud configuration, encrypted backups, key management, logging destinations, contractual BAAs, or Supabase Auth settings because no live project configuration was available for inspection.

## Product and UX assessment

The information architecture and visual language are strong: the landing flow, care-circle concept, high-contrast design, and task-oriented dashboard communicate the product well. The product needs a sharper distinction between:

1. **A demo experience:** fictional data, no operational/security claims, static or sandbox deployment.
2. **A private beta:** real auth and a small, implemented feature set with support and incident processes.
3. **A healthcare-data product:** verified security controls, legal/compliance program, vendor contracts, documented policies, and operational evidence.

Avoid launching a wide surface area with simulation behind it. A smaller real release is safer: authenticated care circles, invitations, events, notes, and read-only documents first; then uploads, permissions, notifications, exports, and integrations in controlled releases.

## Recommended implementation sequence

### Phase 0 — Correct the public contract

1. Remove or qualify every unsupported HIPAA, encryption, audit, 2FA, BAA, clinician integration, emergency, and “live” claim.
2. Mark mock actions as demo-only or disable them.
3. Establish the intended product classification and obtain legal/compliance guidance before collecting PHI.

### Phase 1 — Make the security boundary complete

1. Apply both Supabase migrations in a non-production project.
2. Configure Supabase Auth email, redirects, password rules, OAuth providers, and email templates.
3. Implement role/capability checks in the API and invitation acceptance.
4. Add endpoint-level rate limits, Zod 400 handling, audit attribution, request timeouts, and PII-redacted logging.
5. Replace multi-write circle creation with a transactional database function.

### Phase 2 — Ship a narrow real beta

1. Move events, notes, and circle-membership UI from `mockData.ts` to APIs.
2. Create task and notification schemas only after their permission/lifecycle rules are agreed.
3. Add first-class empty, loading, failure, retry, and session-expired states.
4. Add unit tests for permission functions, API integration tests against an isolated Supabase project, and end-to-end auth/onboarding tests.

### Phase 3 — Documents and operations

1. Build secure document upload and scan workflow.
2. Add immutable audit architecture and privileged audit exports.
3. Implement retention, deletion, data export, backups, recovery, and support access procedures.
4. Add CI/CD, staging, error monitoring, metrics, alerts, infrastructure-as-code, and rollback/runbook coverage.

### Phase 4 — Regulated-data readiness, if applicable

1. Complete a risk assessment and security/privacy program.
2. Ensure appropriate vendor agreements, including BAAs where required.
3. Validate technical, administrative, and physical safeguards; train staff and rehearse incident response.
4. Commission independent application and infrastructure security testing before launch.

HHS explains that cloud services creating, receiving, maintaining, or transmitting ePHI for a covered entity/business associate require appropriate safeguards and a BAA; encrypted data alone does not change that classification. See [HHS HIPAA cloud-computing guidance](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html) and the [HIPAA Security Rule overview](https://www.hhs.gov/hipaa/for-professionals/security/index.html). This is engineering guidance, not legal advice.

## Go/no-go decision

| Release target | Decision | Conditions |
| --- | --- | --- |
| Visual demo with fictional data | **Conditional go** | Remove misleading production/compliance claims or prominently label it as a demo; do not collect user information. |
| Authenticated internal prototype | **Conditional go** | Configure Supabase credentials, apply migrations, test full auth/onboarding, and limit users to trained internal testers with fictional data. |
| Private beta with real non-health care coordination data | **No-go until Phase 1 and Phase 2** | Complete permissions, persistence, tests, observability, and operational controls. |
| Any launch accepting PHI/ePHI | **No-go** | Complete the regulated-data readiness program and obtain appropriate legal/compliance approval. |

## Immediate next actions

1. Provision a separate Supabase development project and populate local `.env` values without committing them.
2. Apply both migrations and configure Auth redirects/providers.
3. Implement role-based API authorization and a transactional `create_care_circle` RPC.
4. Wire calendar and care-notes screens to the API, with automated integration tests.
5. Remove unsupported security/compliance and “live action” claims until the corresponding feature is real.

## Remediation update — 22 October 2026

The following code-level controls have been added since the initial review:

- Default browser release mode is now **demo**. It shows a persistent fictional-data warning; a `live` mode starts with empty data for workflows not connected to the API.
- The highest-visibility compliance/encryption statements and the HIPAA FAQ response now state that the product is a preview and is not approved for real health information.
- Document-vault copy and export/upload controls now identify unavailable preview behavior instead of presenting a working encrypted vault.
- The API now has a global request rate limit, Zod validation errors return 400 responses, and circle creation is delegated to a transactional Supabase RPC migration.
- The API now enforces role capabilities for event, note, and document operations; it records the authenticated member when it issues create/download audit events.
- CI now runs client/server type checks, server permission tests, and a production build on pushes and pull requests; supported Node/npm versions are declared.

These changes make the current preview materially safer and reduce several backend risks. They **do not** close B-02, B-03, B-05, or B-06 for a real-data release: the main UI has not yet been converted from all mock workflows, the vault has no scan/upload pipeline, external Supabase Auth configuration cannot be verified without credentials, and test coverage/operational readiness remain incomplete.

## High-priority remediation update — 22 October 2026

- **H-01:** Global API rate limiting, request-size limits, and server request/header timeouts are now configured.
- **H-02:** Zod validation errors now produce 400 responses with field-level details rather than generic 500 errors.
- **H-03:** Care-circle creation now uses the `create_care_circle` transactional Supabase RPC in migration `202610220003_transactional_circle_creation.sql`.
- **H-04:** Core API actions now record an authenticated member ID; the audit table has an append-only database trigger. Audit coverage is not yet complete for every future endpoint/integration.
- **H-05:** Request IDs, JSON request-completion events, privacy-safe error events, `/healthz`, `/readyz`, and server timeouts are implemented. External error monitoring, metric retention, and alerting remain deployment work.
- **H-06:** Migration `202610220004_domain_and_audit_hardening.sql` introduces the foundational task, comment, invite, notification, medication, and vital-reading domains. Their API/UI workflows still need to be built deliberately.
- **H-07:** In live mode, top-level new-item, invite, event, note, vault upload, and medical-record-request flows are blocked until connected to authenticated APIs. Preview mode remains explicitly marked as fictional.
- **H-08:** The preview warning and claim removals reduce the chance that fixture data is mistaken for operational data. A separate fixture/development-only bundle remains future cleanup work.

## Medium-priority remediation update — 22 October 2026

- **M-01:** Node/npm engine constraints and `.nvmrc` are now committed; CI installs from the lockfile.
- **M-02:** Portal views are lazy-loaded with React `Suspense`, and Vite now uses `import.meta.dirname`, eliminating its native-config-loader warning.
- **M-03:** The selected circle is validated against API memberships during bootstrap; users can select from their server-returned circles and recover from loading failures with a retry control.
- **M-04:** The README now records the browser/Auth/API/Supabase boundary and the consequence of using a service-role client.
- **M-05:** Auth and circle bootstrap now present loading, failure, and retry states; live-mode workflows report that they are unavailable rather than pretending to persist.
- **M-06:** A skip-to-content link, visible keyboard focus treatment, and focusable main landmark have been added. Automated and assistive-technology accessibility testing is still required before release.
