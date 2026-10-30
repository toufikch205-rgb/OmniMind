# OWASP Security Baseline

## Scope

OWASP guidance is used for the security of OmniMind's web client, backend/API boundaries and Android/iOS applications. Select controls based on the actual architecture and threat model; do not assume that a checklist alone makes an application secure.

## Reference projects

- **OWASP Application Security Verification Standard (ASVS):** security requirements and verification criteria for web applications and services.
- **OWASP Top 10:** awareness and risk review for common web application security risks; it is not a complete test specification.
- **OWASP Mobile Application Security Verification Standard (MASVS):** mobile security requirements for Android and iOS.
- **OWASP Mobile Application Security Testing Guide (MASTG):** practical mobile testing guidance.
- **OWASP API Security Top 10:** risk review for API-specific authorization, authentication, resource consumption and data exposure issues.

Use the current official editions published by OWASP at the time of assessment. Record the exact version and access date in assessment evidence rather than silently relying on an older edition.

## Required implementation areas

1. **Identity and sessions:** secure authentication flows, session/token lifecycle, logout and recovery; protect credentials and tokens at rest and in transit.
2. **Authorization:** deny by default; enforce ownership and role checks on the server for every protected resource and operation.
3. **Input and output:** validate untrusted input at trust boundaries; encode output appropriately; avoid unsafe dynamic execution and injection.
4. **Data protection:** classify data, minimize collection, restrict access, encrypt transport, and use platform-appropriate secure storage for sensitive mobile data.
5. **API resilience:** validate object-level authorization, pagination and resource limits; rate-limit sensitive operations; avoid leaking internal errors.
6. **Configuration and dependencies:** remove debug settings and sample secrets from production; keep dependencies reviewed and updated; produce a software bill of materials when release maturity warrants it.
7. **Logging:** record security-relevant events without passwords, tokens, secrets or unnecessary sensitive content.
8. **Mobile platform security:** use secure inter-process and deep-link handling, appropriate permissions, safe local storage, and release signing/key management.
9. **AI features:** treat prompts, retrieved content and tool outputs as untrusted; constrain tool permissions and require user confirmation for consequential data changes.

## Verification

- Map applicable ASVS requirements to web/API tests and code review.
- Map applicable MASVS requirements to mobile architecture review and device-level tests.
- Include negative authorization tests: another user's data must not be readable or modifiable.
- Test session expiry, logout, invalid input, abuse limits and sensitive error paths.
- Record findings, severity, affected component, remediation and retest evidence.

## Release rule

Critical security defects block release. High-severity findings require remediation or a documented, time-bounded risk acceptance by the authorized project owner. No security level or OWASP compliance claim may be made without scoped assessment evidence.

## Official references

- https://owasp.org/www-project-application-security-verification-standard/
- https://owasp.org/www-project-top-ten/
- https://mas.owasp.org/MASVS/
- https://mas.owasp.org/MASTG/
- https://owasp.org/www-project-api-security/
