# ADR 0002: Backend, identity, workspace and offline data baseline

- Status: Accepted for Phase 1 planning and architecture
- Date: 2026-10-30
- Decision owner: Project owner
- Supersedes: The provisional direction in `backend-data-evaluation.md` where it conflicts with this ADR

## Context

OmniMind must support Web, Android and iOS with one account, private user data, cross-device synchronization and useful offline behavior. Its core data is relational and interconnected: workspaces, projects, tasks, plans, notes, knowledge links and study content.

The project needs a practical first-release scope without closing the door to future collaboration or creating a provider-dependent domain model.

## Decisions

### 1. Backend and database

Select **Supabase with PostgreSQL** as the initial managed backend direction.

Rationale:
- PostgreSQL fits the relational and interconnected product domain.
- Supabase provides a coherent initial path for authentication, database, private object storage and realtime notifications.
- Row Level Security can enforce ownership and workspace access close to the data.

Conditions:
- Domain and application layers remain provider-independent.
- Supabase SDK usage is confined to infrastructure/adapters and composition boundaries.
- No service-role key or privileged credential may ship in a client.
- RLS is mandatory for user-owned data; storage access policies are mandatory for private files.
- Every policy must be tested for both allowed and denied access.
- Reassess the provider if validated requirements, data residency, cost, reliability or portability constraints cannot be met.

This ADR approves the provider direction, not creation of production tables or immediate connection of credentials. Schema and security policies require a separate reviewed design before implementation.

### 2. Workspace model

The first release supports **personal workspaces only**.

Each account receives its own private workspace. The data model should retain a workspace boundary and be designed so membership and roles can be added later without rewriting every feature.

Shared workspaces, invitations, multi-member roles and collaborative editing are explicitly out of first-release scope. Do not expose incomplete collaboration controls in the UI.

### 3. Offline behavior

The target first-release experience is **read and create/edit offline** for the core personal data:
- tasks and subtasks;
- goals and plans;
- notes and documents in the supported editor scope;
- personal workspace metadata and selected preferences.

Authentication, account recovery, billing if introduced, and other server-authoritative actions require connectivity.

Use a local SQLite-backed persistence adapter with a durable outbox. The server remains authoritative for synchronized state. Realtime events are hints to refresh/synchronize, not the durable sync mechanism.

### 4. Synchronization contract

The initial sync design must provide:
- stable client-generated identifiers;
- durable queued operations and retry;
- idempotency keys to prevent duplicate writes;
- server-side authorization for every operation;
- record revisions or equivalent optimistic concurrency checks;
- deletion tombstones so deletes propagate to other devices;
- observable sync status and recoverable error states;
- safe behavior when a user signs out or changes accounts on a shared device.

Initial conflict policy:
- **Independent new records:** merge when identifiers differ.
- **Same record edited on multiple devices:** do not silently overwrite; detect revision conflict and present a recoverable resolution flow. Preserve both versions or a conflict copy where practical.
- **Deletion versus edit:** deletion must not silently erase a concurrent edit; flag the conflict for resolution.
- **Server-enforced security and ownership fields:** server wins; clients cannot set or override them.

The exact wire protocol, schema and conflict UX require a dedicated design and tests before implementation.

### 5. Authentication

For the first release, use **email and password with verified email**, plus secure password-reset flow.

Google and Apple sign-in are deferred until the core account lifecycle is stable. If added later, account linking must prevent accidental account takeover or duplicate identities.

Requirements:
- use the backend provider's supported secure session flow;
- keep tokens in platform-appropriate secure storage, never ordinary app preferences or logs;
- support logout and session revocation;
- rate-limit authentication and recovery endpoints;
- avoid account enumeration in recovery responses;
- define session expiry and refresh behavior;
- never log passwords, tokens, recovery codes or magic links.

Email verification and password reset must be tested on web and native deep-link flows before release.

### 6. User data rights and account lifecycle

The product must support:
- export of a user's personal data in a documented, usable format;
- account deletion with deletion or anonymization of associated personal data according to the retention policy and applicable legal obligations;
- clear disclosure of any data that must be retained for legal/security reasons;
- backup and restore procedures that do not accidentally resurrect deleted accounts or data;
- a user-visible path to request and confirm destructive account deletion.

The detailed retention schedule and export format must be specified before production launch.

### 7. First-release synchronized data

The first release synchronizes:
- account profile essentials;
- personal workspace metadata;
- projects and categories needed by core planning;
- tasks, subtasks and goals;
- plans and calendar entries;
- notes and supported document content;
- user preferences necessary to restore the experience across devices.

Derived analytics, local caches, temporary UI state and device-specific settings do not need to sync unless a later requirement establishes otherwise.

Attachments are stored in private object storage with metadata and access policies; upload/download retry and offline attachment limits must be specified before enabling attachments.

## Security and verification gates

Before backend implementation is considered complete:
1. Document the entity model, ownership rules and data classification.
2. Define and review PostgreSQL schema and migrations.
3. Write RLS policies and private storage policies before exposing data access.
4. Add cross-user and cross-workspace negative authorization tests.
5. Define token/session storage separately for web and native.
6. Threat-model sync, replay, duplicate operations, conflict resolution and account switching.
7. Test export, deletion, restore and deletion propagation.
8. Keep privileged secrets server-side and enable secret scanning.

## Consequences

Positive:
- Clear initial product scope and a practical backend direction.
- Offline editing is treated as a first-class requirement rather than an afterthought.
- Personal workspace simplicity avoids premature collaboration complexity.
- Provider boundaries preserve a future migration path.

Trade-offs:
- Offline-first synchronization increases engineering and testing effort.
- Email/password requires secure verification, recovery and abuse protection.
- A future shared-workspace feature will require explicit membership and role policies.
- Provider selection must be re-evaluated if real constraints invalidate the assumptions.

## Revisit triggers

Revisit this ADR if:
- collaborative workspaces become a first-release requirement;
- offline editing cannot meet acceptable consistency or security guarantees;
- Supabase data residency, cost, availability or feature constraints are unacceptable;
- identity requirements change materially;
- regulatory or contractual requirements impose additional controls.
