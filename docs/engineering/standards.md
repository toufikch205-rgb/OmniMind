# Engineering Standards

- TypeScript strict mode.
- Keep modules cohesive; isolate domain rules from UI and infrastructure.
- Prefer explicit interfaces and dependency injection over global mutable state.
- No direct database/vendor calls from presentation components.
- Validate external input at boundaries.
- Never commit secrets, tokens, credentials or real user data.
- Add tests with each meaningful behavior; test domain rules independently of UI.
- Keep platform-specific code behind named adapters.
- Record architectural changes as ADRs in `docs/architecture/decisions`.
- Do not remove or rewrite existing behavior without impact analysis and approval.
