# Module Structure

Each product capability will be implemented as a vertical slice under `apps/client/src/modules/<module-name>`:

```text
<module-name>/
  domain/          # entities, value objects, policies; no framework imports
  application/     # use-cases, commands, queries and ports
  infrastructure/ # repository and platform adapter implementations
  presentation/    # screens, components and view models
  tests/           # domain and application tests
  index.ts         # the public module API only
```

Rules:
- A module owns its business rules and internal implementation.
- Other modules import only its public `index.ts` API.
- Cross-module workflows are coordinated by application services, not by reaching into another module's internals.
- Shared code belongs in a shared package only when at least two modules genuinely need it.
- Do not create empty feature modules ahead of their roadmap phase; this document is the repeatable template.
- Keep browser, Android and iOS integrations in platform adapters and expose stable ports to application logic.

This structure is intended for Tasks, Planning, Notes, Knowledge, Study, Focus and AI as those roadmap phases begin.
