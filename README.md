# Hearthside

Hearthside is a collaborative elder-care coordination interface for families and caregivers. It now includes an initial TypeScript API and Supabase schema foundation, but it is not yet a complete production application and must not be used to store real health or personal data.

## Current state

The application builds successfully as a static front end:

```bash
cd heartside
npm install
npm run dev
```

Production validation at the time of this assessment:

```bash
npm run lint   # TypeScript check
npm run build  # Vite production build
```

Both commands pass. The build output is static files in `heartside/dist/`.

### Server foundation

The initial API is in `heartside/server/`, and Supabase migrations are in `heartside/supabase/migrations/`. Authentication uses Supabase Auth and server-side bearer-token verification.

1. Create a Supabase project and apply both SQL migrations in order through the Supabase CLI or SQL editor.
2. Copy `heartside/.env.example` to `heartside/.env` and provide the project's URL, browser anon key, and **server-only** service-role key.
3. In Supabase Auth, configure the local and deployed application URLs as allowed redirect URLs; enable email/password and any OAuth providers you intend to display.
4. Run `npm run dev:server` in one terminal and `npm run dev` in another.

The API provides `/healthz`, authenticated circle creation/listing, authenticated event and note endpoints, and document metadata/download URLs. Every circle-scoped request requires a Supabase bearer token and verifies the caller's membership server-side.

After the first verified sign-in, Hearthside asks the account owner to create a Care Circle. The API creates the recipient and owner membership together, and the browser stores only the selected circle ID; authorization is always rechecked on the server.

### What works today

- Responsive care-coordination user interface.
- Landing, sign-up/sign-in, dashboard, calendar, tasks, care-team, notes, document-vault, reports, directory, and settings views.
- In-memory interactions for adding events, notes, documents, and invitations.
- Local mock content and bundled visual assets.

### What is simulated

This is important: no interaction below currently has a persistent or secure server implementation.

- Authentication, Google/Apple sign-in, magic links, password reset, and PIN access.
- Care-circle permissions and two-factor authentication.
- Database persistence, multi-user synchronization, and audit logs.
- Document uploads, downloads, encrypted storage, sharing, medical-record requests, and exports.
- Email, SMS, push notifications, calendar syncing, GPS, billing, and device integrations.
- HIPAA compliance, cryptographic signing, encryption, and emergency escalation.

The UI's care data comes from `heartside/src/data/mockData.ts`; most changes live only in React state and disappear on refresh. Several product actions are intentionally represented by browser alerts, timers, or generated placeholder downloads.

## Deployment choices

### 1. Static prototype/demo

The existing app can be deployed now to a static hosting provider. This is appropriate only for demos using fictional data.

Requirements:

- A static host/CDN and custom domain.
- HTTPS and DNS configuration.
- A build command of `npm run build` from `heartside/`.
- Publish directory `heartside/dist/`.
- Clear demo labeling; do not collect real care, identity, insurance, legal, or medical information.

### 2. Production care platform

A production release requires a real backend and the controls listed below before accepting any real data.

## Required production architecture

| Capability | Required implementation |
| --- | --- |
| Web client | Existing React app refactored to load and mutate server data through authenticated APIs. |
| API service | A versioned TypeScript API with request validation, error handling, rate limiting, health checks, structured logs, and authorization middleware. |
| Identity | Secure sign-up/sign-in, email verification, password reset or passwordless access, MFA, session management, Google/Apple OAuth if retained, and invite acceptance. |
| Authorization | Server-enforced multi-tenant care-circle isolation and role/permission checks on every record and document request. UI visibility alone is not authorization. |
| Database | Managed PostgreSQL for users, care circles, memberships, schedules, tasks, notes, notifications, permissions, billing state, and audit events. |
| File vault | Private object storage, signed upload/download URLs, file-type/size validation, malware scanning, encryption, document metadata/versioning, and retention/deletion workflows. |
| Background work | A queue and worker processes for reminders, email/SMS/push, exports, document processing, calendar synchronization, and scheduled jobs. |
| Audit trail | Append-only, server-generated events for sign-in, access, change, export, share, permission, and administrative actions. |
| Observability | Error tracking, metrics, centralized logs, uptime checks, paging/alerting, and privacy-safe telemetry. |
| Delivery | Container build, staging and production environments, CI/CD, migration deployment, automated rollback, and secret management. |

### Suggested initial service layout

```text
Browser
  └─ CDN/static web app
       └─ HTTPS API
            ├─ Identity and authorization
            ├─ PostgreSQL database
            ├─ Private document object storage
            ├─ Job queue and worker
            ├─ Email/SMS/push providers
            └─ Observability and audit-log pipeline
```

Use managed services with documented disaster recovery rather than operating a single long-lived virtual machine. A single VM can host a demo, but it is an unsuitable foundation for sensitive, multi-user care data.

## Product work required before connecting the UI

1. Define the data model and ownership boundaries: user, care circle, recipient, membership, caregiver role, invite, schedule event, task, note, document, notification, audit event, and billing entitlement.
2. Decide the identity model, MFA policy, recovery process, and the exact roles each care-circle member may hold.
3. Implement authentication and server-side authorization first.
4. Add database schema migrations, repositories/services, API contracts, and client data fetching.
5. Replace mock data and browser-only state with server data incrementally, starting with care circles, members, and schedules.
6. Implement the file-vault pipeline before enabling real document uploads.
7. Implement genuine audit, export, deletion, retention, and account-recovery workflows.
8. Connect external providers only after consent, authorization, failure handling, and audit behavior are designed.
9. Add unit, integration, end-to-end, security, and accessibility tests.
10. Establish backups, restore testing, incident response, monitoring, and support procedures before launch.

## Security and health-data gate

The interface presents medical records, insurance cards, clinical notes, legal directives, access logs, and HIPAA/encryption claims. Treat any live deployment as potentially handling sensitive health data.

Before accepting real data, obtain qualified legal/compliance guidance and complete a documented risk assessment. If Hearthside acts for a HIPAA covered entity or business associate, cloud providers and other vendors that create, receive, maintain, or transmit ePHI need appropriate safeguards and a Business Associate Agreement (BAA). Encryption alone does not remove that obligation. See the U.S. HHS guidance on [HIPAA and cloud computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html) and the [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html).

At a minimum, plan for:

- Least-privilege, server-side access controls and MFA.
- Encryption in transit and at rest with managed key controls and rotation procedures.
- Tamper-resistant audit logging and access review.
- Secure file validation/scanning and scoped, expiring download links.
- Backup encryption, restoration tests, and business-continuity procedures.
- Incident response and breach-notification procedures.
- Data retention, export, correction, deletion, and account-recovery policies.
- Vendor due diligence and BAAs where required.
- No sensitive data in logs, analytics, client bundles, or non-production environments.

This is an engineering assessment, not legal or compliance advice.

## Repository gaps to address

- The API and Supabase schema foundation are implemented; event and note persistence is ready once the migration and environment are configured.
- Supabase Auth, persistent browser sessions, password login/sign-up, password reset, magic links, Google/Apple OAuth handoff, sign-out, and server-side circle membership enforcement are implemented. OAuth providers and redirect URLs must be configured in the Supabase dashboard before the respective buttons can work.
- Circle invitations, role administration, MFA enforcement, account recovery policy, and authenticated client conversion from mock data remain to be implemented.
- Document metadata and time-limited download URLs are implemented; secure upload, malware scanning, versioning, and retention workflows remain to be built.
- No seed strategy or client-side conversion from mock data to the API has been completed.
- No deployment infrastructure, Dockerfile, environment schema, or CI/CD workflow.
- No test suite.
- No Node version/engine declaration.
- `express`, `dotenv`, and `@google/genai` are installed but not currently used by the application.
- `.env.example` documents `GEMINI_API_KEY` and `APP_URL`, but neither is wired to an active server flow. Never expose real secret values through Vite client variables or committed `.env` files.
- The production bundle is a single approximately 813 kB JavaScript chunk (about 180 kB gzip); introduce route/component code splitting as features become server-backed.
- Vite warns that `__dirname` in `vite.config.ts` will be unsupported by its future native config loader; migrate to `import.meta.dirname` or another compatible approach.

## Environment configuration

The current template is in [`heartside/.env.example`](heartside/.env.example). It is a template only; create a local ignored environment file for local development. Production secrets belong in the chosen platform's secret manager, not in Git.

As backend work begins, replace the minimal template with documented, validated server-only and client-safe variables. Typical groups include:

- Runtime: `NODE_ENV`, `PORT`, `APP_URL`, `API_URL`.
- Database: a server-only connection URL and migration credentials.
- Auth: session/signing keys, OAuth client credentials, approved redirect URLs.
- Storage: bucket name, encryption-key identifier, upload limits, malware-scanning configuration.
- Messaging: provider credentials and approved sender identifiers.
- Observability: error-tracking and logging configuration.

## Near-term roadmap

1. Publish the current build as a fictional-data demo, if desired.
2. Choose the production cloud and vendors that can meet the intended data and contractual requirements.
3. Define the product's data, role, consent, retention, and integration requirements.
4. Build identity, authorization, database migrations, and care-circle APIs.
5. Connect the client to the API and replace mock data feature by feature.
6. Add the document-vault, worker, audit, operational, and compliance controls.
7. Complete security review, test coverage, restore exercises, and staging validation before production onboarding.
