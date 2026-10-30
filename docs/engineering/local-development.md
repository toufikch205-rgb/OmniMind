# Local development

## Prerequisites

- Node.js 22.13 or newer
- pnpm 10.18.3
- Git

## Install and run

From the repository root:

```sh
corepack enable
pnpm install
pnpm dev
```

For a specific target:

```sh
pnpm web
pnpm android
pnpm ios
```

Expo Go or a development build may be required for device testing. iOS simulator builds require macOS and Xcode.

## Validation

Run the workspace TypeScript checks with:

```sh
pnpm typecheck
```

Then verify Web, Android and iOS independently. A successful TypeScript check does not replace platform builds or device testing.

## Current implementation boundary

The client now contains a responsive workspace shell and local tab navigation. Authentication, Supabase connectivity, persistent user data, offline storage and synchronization are not implemented yet. Do not display demo workspace content as persisted user data.
