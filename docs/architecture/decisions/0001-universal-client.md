# ADR 0001: Universal client foundation

- Status: Accepted for the initial foundation
- Date: 2026-10-30

## Context
The product must ship on Web, Android and iOS while keeping business rules and most UI logic shared.

## Decision
Use Expo, React Native and TypeScript as the universal client foundation, organized in a pnpm workspace. Platform-specific functionality will be isolated behind adapters.

## Consequences
- One primary client targets all three platforms.
- Shared domain logic and design tokens live in workspace packages.
- Native-only and browser-only behavior may have separate adapter implementations.
- Screens may adapt to each platform rather than being pixel-identical.
- Reassess only when a concrete requirement cannot be met reliably.
