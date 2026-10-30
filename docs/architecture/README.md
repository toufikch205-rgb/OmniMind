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

## Accepted backend and identity baseline

[ADR 0002](./decisions/0002-backend-identity-offline-baseline.md) records the approved initial direction for Supabase/PostgreSQL, personal workspaces, verified email/password authentication, offline editing and synchronization boundaries. See the [backend/data evaluation](./backend-data-evaluation.md) for alternatives and implementation constraints.
