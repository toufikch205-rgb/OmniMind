# Security & Data Principles

- No credentials, API keys, tokens, private keys or real personal data in Git.
- Keep secrets in environment variables managed by the deployment/runtime provider; commit only documented placeholders.
- Validate and normalize all external input at trust boundaries.
- Enforce authorization on the server/data layer; hiding a UI control is not authorization.
- Design user data access around least privilege and explicit ownership.
- AI may propose actions but must not write, delete, reschedule or share user data without explicit confirmation.
- Plan for export, backup and account deletion before production data is stored.
- Choose encryption, session lifetime, recovery and sync-conflict rules in the database/auth ADR before implementing accounts.
