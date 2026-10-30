# Module Structure

The client uses a feature-first structure. Expo Router files are route adapters only; each feature owns its screen and feature-specific implementation.

## Current client structure

```text
apps/client/
  app/
    _layout.tsx                 # Root navigation shell
    index.tsx                   # Redirect to workspace
    (workspace)/
      _layout.tsx               # Shared workspace shell and navigation
      index.tsx                 # Home route adapter
      tasks.tsx                 # Tasks route adapter
      planning.tsx              # Planning route adapter
      knowledge.tsx             # Knowledge route adapter
      projects.tsx              # Projects route adapter
  src/
    components/                 # Reusable presentation components
      AppIcon.tsx
      PageFrame.tsx
      ModulePage.tsx
    features/
      home/
        index.ts                # Public feature API
        screens/HomeScreen.tsx
      tasks/
        index.ts
        screens/TasksScreen.tsx
        components/
        storage.ts
        types.ts
      planning/
        index.ts
        screens/PlanningScreen.tsx
      knowledge/
        index.ts
        screens/KnowledgeScreen.tsx
      projects/
        index.ts
        screens/ProjectsScreen.tsx
```

## Rules

- Files under `app/` define routes and layout only. They should not contain feature UI or business logic.
- A route imports a feature through its public `index.ts`; it must not reach into private feature implementation paths.
- A feature owns its screen, components, hooks, services, types and storage as those are needed. Do not create empty folders in advance.
- Shared UI belongs in `src/components/` only when it is genuinely reusable by more than one feature.
- Keep feature-specific components inside that feature. Avoid a large shared file containing unrelated screens.
- Move code without changing its behavior first; refactor behavior separately, with tests.
- Preserve existing route paths when moving screens so navigation and deep links remain stable.

## Target module layering

As a feature gains domain and application complexity, evolve it toward this structure without forcing empty layers into simple screens:

```text
<feature-name>/
  domain/          # Entities, value objects and policies; no UI framework imports
  application/     # Use cases, commands, queries and ports
  infrastructure/ # Repository and platform adapter implementations
  screens/         # Route-level presentation screens
  components/      # Feature-specific UI
  hooks/           # Feature-specific state and lifecycle logic
  services/        # Feature orchestration and integrations
  tests/           # Feature tests
  types.ts         # Feature contracts when needed
  index.ts         # Public feature API
```

Rules:
- A feature owns its business rules and internal implementation.
- Other features import only its public `index.ts` API.
- Cross-feature workflows are coordinated by application services, not by reaching into another feature's internals.
- Shared code belongs in a shared package only when at least two features genuinely need it.
- Keep browser, Android and iOS integrations in platform adapters and expose stable ports to application logic.
- Do not create empty feature modules ahead of their roadmap phase.

This structure supports the roadmap modules: Tasks, Planning, Notes, Knowledge, Study, Focus and AI.
