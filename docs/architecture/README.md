# Architecture

## Platform strategy
OmniMind targets **3 platforms**: Web, Android and iOS. The initial client uses Expo + React Native + TypeScript as a shared foundation. Platform-specific capabilities must sit behind adapters.

## Repository boundaries
- `apps/client`: routing, composition and platform entry points.
- `packages/core`: shared business foundations.
- `packages/design-tokens`: cross-platform visual tokens.
- `packages/data`: persistence contracts, not vendor-specific SDKs.
- `docs`: architecture decisions and engineering standards.

## Dependency direction
Presentation -> application use-cases -> domain contracts. Infrastructure implements contracts and is injected at the application boundary. Domain logic must not import React, Expo, database SDKs or platform APIs.

## Decisions still open
Backend/database/auth provider, offline storage and conflict resolution, final design system, deployment and release environments. These are not guessed in the scaffold; each needs a recorded decision before implementation.

## Phase 1 readiness

See [Phase 1 Readiness Review](./phase-1-readiness-review.md) for the current foundation assessment, recommendations, unresolved decisions and evidence-based completion gates.
