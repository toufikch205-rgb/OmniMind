# Module Structure

OmniMind is a pnpm monorepo with an Expo Router client and framework-independent shared packages. The repository uses feature-first organization: route files adapt URLs to feature screens; reusable workspace chrome lives outside features; feature behavior stays within its owning feature.

## Repository structure

```text
OmniMind/
  apps/
    client/
      app/                         # Expo Router route adapters and layouts only
      src/
        components/
          navigation/              # Shared navigation components
          workspace/               # Shared workspace shell components
        features/
          home/
          tasks/
          planning/
          knowledge/
          projects/
  packages/
    core/                           # Platform-independent domain primitives
    data/                           # Repository contracts and data boundaries
    design-tokens/                  # Shared visual tokens
  docs/
    architecture/
    engineering/
    standards/
  .github/workflows/                # CI and deployment automation
```

## Client structure

```text
apps/client/
  app/
    _layout.tsx                     # Root Expo Router layout
    index.tsx                       # Initial redirect
    (workspace)/
      _layout.tsx                   # Composition of workspace shell
      index.tsx                     # Home route adapter
      tasks.tsx                     # Tasks route adapter
      planning.tsx                  # Planning route adapter
      knowledge.tsx                 # Knowledge route adapter
      projects.tsx                  # Projects route adapter
  src/
    components/
      AppIcon.tsx                   # Shared icon primitives
      PageFrame.tsx                 # Shared page container
      ModulePage.tsx                # Shared placeholder presentation
      navigation/
        WorkspaceNavigation.tsx     # Navigation model and NavItem
      workspace/
        WorkspaceHeader.tsx         # Workspace top header
    features/
      home/
        index.ts                    # Public feature API
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

## Architectural boundaries

- `app/` is reserved for Expo Router routes and layouts. It is not a conventional static website entry folder.
- Expo's web export generates the web HTML entry; do not add a parallel hand-written `index.html` for TSX routes.
- Route adapters import screens through the owning feature's public `index.ts`.
- Feature internals are private to that feature. Cross-feature imports must use public APIs.
- `src/components/` contains presentation primitives reused across multiple screens or workspace shell areas.
- Navigation configuration and workspace chrome are separate from route composition.
- `packages/core`, `packages/data`, and `packages/design-tokens` must remain platform-independent. Do not import React Native, Expo, browser globals, or app feature code into them.
- Add domain, application, infrastructure, hooks, services and tests layers when actual complexity requires them; do not create empty folders just to satisfy a template.

## Feature ownership

Each feature owns its screens, feature-specific components, state, types, persistence adapters and tests. Current modules:

- **Home** — workspace overview and entry points.
- **Tasks** — page tree, blocks, editor and local persistence.
- **Planning** — planned roadmap module; current screen is a placeholder.
- **Knowledge** — planned roadmap module; current screen is a placeholder.
- **Projects** — workspace placeholder, not a completed roadmap capability.

## Safe refactoring protocol

1. Inspect imports and runtime ownership before moving a file.
2. Move one coherent responsibility at a time.
3. Preserve route paths, persisted storage keys and user-visible behavior.
4. Update imports and public feature exports in the same change.
5. Run TypeScript validation and the web export before treating a refactor as complete.
6. Remove obsolete files only after repository-wide import searches show no consumers.
7. Keep behavior changes separate from structural refactors.

## Target feature layering

```text
<feature>/
  domain/          # Entities, value objects and business policies
  application/     # Use cases, commands, queries and ports
  infrastructure/  # Persistence and platform adapters
  screens/         # Feature screens
  components/      # Feature-owned UI
  hooks/           # Feature state and lifecycle logic
  services/        # Feature orchestration
  tests/           # Feature tests
  types.ts         # Feature contracts
  index.ts         # Public API
```

The target is evolutionary, not a requirement to introduce unused abstractions. The roadmap remains the authority for when future modules are implemented.
