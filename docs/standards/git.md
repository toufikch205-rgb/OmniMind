# Git Version-Control and Change Policy

## Purpose

Git is OmniMind's source-control mechanism. This policy makes changes traceable, reviewable and recoverable. Git itself is not a security or quality certification standard.

## Branching

- Keep `main` releasable; do not use it as an unreviewed scratch branch.
- Implement non-trivial work on a short-lived feature or fix branch.
- Use pull requests for review and merge when repository protections and team size permit.
- Avoid force-pushing shared branches. Any exceptional history rewrite requires explicit coordination and a recovery plan.

## Commits

- Make small, logically coherent commits with descriptive imperative messages.
- Do not mix unrelated features, formatting sweeps and fixes in one commit.
- Never commit secrets, credentials, private keys, personal data or production exports.
- Do not rewrite history to conceal a security incident; follow the incident process and rotate exposed credentials.

## Review

Before merge, check:
- intended scope and absence of unrelated changes;
- correctness and maintainability;
- security and privacy impact;
- tests and documentation;
- migrations and compatibility impact;
- dependency and configuration changes.

Sensitive changes—authentication, authorization, cryptography, personal data, billing, infrastructure and release workflows—require heightened review.

## Tags and releases

- Tag released versions and associate them with a known commit.
- Record release notes, supported platforms, test evidence, migrations and known limitations.
- Keep build artifacts and secrets out of source history; use controlled release storage and secret management.

## Recovery

Use revert commits for ordinary rollback when possible. For exposed credentials, revoke/rotate them immediately; removing a secret from the latest commit does not remove it from Git history or copies.

## Suggested commit convention

Use concise prefixes such as `docs:`, `feat:`, `fix:`, `refactor:`, `test:`, `build:` and `security:`. This is a project convention, not a requirement of Git.

## Official reference

- https://git-scm.com/docs
