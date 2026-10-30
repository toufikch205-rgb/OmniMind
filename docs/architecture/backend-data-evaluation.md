# Backend and Data Architecture Evaluation

Status: **Decision recorded** — see [ADR 0002](./decisions/0002-backend-identity-offline-baseline.md). This document preserves the alternatives and rationale; ADR 0002 is authoritative where they differ.

## Product requirements

OmniMind needs:
- A relational model for users, workspaces, projects, tasks, plans, notes, links and study content.
- Account identity shared by Web, Android and iOS.
- Strict per-user and per-workspace authorization.
- Realtime notifications/updates across signed-in devices.
- Private file and attachment storage.
- Offline-first operation with local persistence, durable queued writes and explicit conflict handling.
- Export, backup/restore and account deletion workflows.
- No privileged server credentials in client applications.

## Evaluated approaches

### Supabase with PostgreSQL — selected initial direction

Strengths:
- Relational PostgreSQL model fits connected planning, tasks, documents and knowledge links.
- Integrated authentication, database APIs, realtime and object storage reduce infrastructure sprawl.
- Row Level Security can enforce tenant and ownership boundaries at the database layer.

Trade-offs:
- Offline-first behavior is not automatic; OmniMind must build and test local persistence, an outbox/sync protocol and conflict resolution.
- RLS, storage policies and privileged server operations require careful design and automated tests.
- Realtime is a notification/update channel, not a replacement for durable synchronization.

### Firebase / Firestore — evaluated, not selected

Strengths:
- Mature client SDK ecosystem and built-in local persistence/synchronization patterns for supported clients.
- Integrated authentication and supporting cloud services.

Trade-offs:
- Document-oriented modeling can require denormalization for interconnected knowledge and reporting.
- Security rules and query constraints need careful alignment.
- Offline behavior and consistency must be tested against exact client SDKs and requirements.

### Custom PostgreSQL backend — evaluated, not selected

Strengths:
- Maximum control over domain APIs, transactions, sync protocol and deployment.

Trade-offs:
- Highest engineering and operational burden: authentication, APIs, realtime, storage, backups, monitoring and security all need to be built or integrated.
- Slower path to a reliable first release.

## Approved direction

ADR 0002 selects Supabase with PostgreSQL as the initial managed backend direction, personal workspaces for the first release, email/password with verified email as the initial authentication method, and read/create/edit offline for core personal data using local SQLite and a durable outbox.

The selection does not authorize immediate production setup. Schema, RLS, storage policies, authentication lifecycle, sync protocol and conflict UX require separate reviewed designs and tests before implementation.

## Architecture constraints

Regardless of provider:
1. Domain models and use-cases remain provider-independent.
2. Remote persistence sits behind repository and service ports.
3. A local SQLite-backed store sits behind a separate local persistence adapter.
4. Sync uses stable operation IDs, retries, idempotency, version checks and documented conflict policies.
5. Authorization is enforced by the backend; client checks are UX only.
6. Migrations, backup/restore, export and deletion are tested before production data is introduced.
7. No privileged server key is embedded in a client build.

## Official product documentation to consult during implementation

- https://supabase.com/docs
- https://www.postgresql.org/docs/
- https://www.sqlite.org/docs.html
