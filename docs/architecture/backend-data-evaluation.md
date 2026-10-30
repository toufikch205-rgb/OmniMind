# Backend and Data Architecture Evaluation

Status: evaluation only — no provider has been selected or connected.

## Product requirements

OmniMind needs:
- A relational model for users, workspaces, projects, tasks, plans, notes, links and study content.
- Account identity shared by Web, Android and iOS.
- Strict per-user and per-workspace authorization.
- Realtime updates across signed-in devices.
- File and attachment storage with private access.
- A path to offline-first operation, including a local database and explicit conflict handling.
- Export, backup and account deletion workflows.
- No privileged server credentials in client applications.

## Shortlisted approaches

### Supabase (Postgres platform)
Strengths:
- Relational PostgreSQL model fits connected planning, tasks, documents and knowledge links.
- Integrated authentication, database APIs, realtime and object storage reduce infrastructure sprawl.
- Row Level Security can enforce tenant and ownership boundaries at the database layer.

Trade-offs:
- Offline-first behavior is not automatic; OmniMind still needs a local persistence layer, an outbox/sync protocol and conflict-resolution rules.
- RLS policies, storage policies and privileged server operations require careful security design and automated tests.
- Realtime should be treated as a notification/update channel, not as a replacement for durable sync.

### Firebase (Firestore platform)
Strengths:
- Mature client SDK ecosystem and built-in local persistence/synchronization patterns for supported clients.
- Authentication and supporting cloud services are integrated.

Trade-offs:
- Firestore is document-oriented; complex relational queries, cross-linked knowledge and reporting may require denormalization and additional design.
- Security rules and query constraints need careful alignment.
- Cross-platform offline behavior and data consistency must be tested against the exact client SDKs and product requirements.

### Custom PostgreSQL backend
Strengths:
- Maximum control over domain APIs, transactions, sync protocol and deployment.
- Relational model and authorization behavior can be tailored to OmniMind.

Trade-offs:
- Highest engineering and operational burden: authentication, APIs, realtime, storage, backups, monitoring and security all need to be built or integrated.
- Slower path to a reliable first release.

## Provisional direction (not an approved decision)

Supabase + PostgreSQL is the strongest initial candidate because OmniMind's data is highly relational and needs consistent cross-platform identity, authorization and realtime behavior. This is only a recommendation for evaluation, not permission to connect a project or create tables.

Regardless of provider, the architecture should keep:
1. Domain models and use-cases provider-independent.
2. Remote persistence behind repository interfaces.
3. A local SQLite-backed store behind a separate local persistence adapter.
4. A sync engine with an outbox, stable operation IDs, retry/idempotency, version checks and documented conflict policies.
5. Authorization enforced by the backend; client-side checks are UX only.
6. Migrations, backup/restore and export tested before production data is introduced.

## Decisions required before implementation

- Approve a backend direction (Supabase, Firebase, or custom backend).
- Define whether workspaces can be shared with other users in the first release.
- Define the first-release offline promise: read-only cached access, or create/edit offline with later synchronization.
- Choose the initial authentication methods (email/password, magic link, Google/Apple, or a staged combination).

No provider SDK, credentials, production schema or security policies should be added until these decisions are approved.
