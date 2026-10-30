# Engineering, Security and Quality Standards

**Status:** Project policy — initial baseline  
**Applies to:** OmniMind web, Android, iOS, backend services, data, interfaces, tests, delivery and maintenance.  
**Policy owner:** OmniMind project maintainers  
**Review:** At the start of each roadmap phase and whenever a referenced standard changes materially.

## 1. Purpose

This policy turns OWASP, NIST, IEEE and ISO references into practical engineering controls for OmniMind. Git is the version-control and change-management mechanism used to preserve traceability. These references are applied according to their scope; they are not interchangeable and are not all certification schemes.

The policy is intended to be proportionate to the product's actual risks and maturity. A control may be marked **Not applicable** only with a documented reason and reviewer approval.

## 2. Reference families

- **OWASP:** application and API security; mobile application security.
- **NIST:** cybersecurity governance, risk management and security practices.
- **IEEE:** requirements engineering, architecture description, and verification/validation.
- **ISO/IEC:** product quality, information-security management and software life-cycle processes.
- **Git:** source history, reviewable changes, release traceability and recovery.

The detailed scope and implementation approach are recorded in [OWASP](./owasp.md), [NIST](./nist.md), [IEEE](./ieee.md), [ISO](./iso.md) and [Git workflow](./git.md).

## 3. Mandatory engineering principles

1. Security, privacy, accessibility, reliability and maintainability are design concerns from the beginning—not a final polishing step.
2. Every feature has an owner, defined boundaries, documented behavior and appropriate tests.
3. Authorization is enforced by trusted backend boundaries; hiding a control in the UI is not authorization.
4. Secrets, private keys, credentials and production personal data must not be committed to Git.
5. AI-generated suggestions or plans must not modify user data until the user explicitly approves the proposed change.
6. Changes to architecture, data contracts, security posture or major dependencies require a recorded rationale.
7. Defects and accepted risks are tracked; critical security issues block release until fixed or formally risk-accepted by an authorized owner.
8. Tests and evidence must be reproducible. Never claim a test, audit or certification that has not actually occurred.

## 4. Compliance states

Use these states in the compliance matrix:

- **Not assessed:** no assessment has been performed.
- **Planned:** implementation or assessment is scheduled.
- **In progress:** work has started but evidence is incomplete.
- **Implemented — unverified:** a control exists but has not passed its defined verification.
- **Verified:** the control passed a documented review or test; include evidence and date.
- **Not applicable:** scope exclusion with a written rationale and approval.
- **Accepted risk:** a documented exception with owner, rationale, impact, mitigation and expiry/review date.

A document describing a control is not proof that the control is implemented.

## 5. Change and release gates

Before merging a change:
- Review its scope and ensure unrelated functionality is untouched.
- Run the relevant automated checks and tests.
- Review security, privacy and data-access implications.
- Update documentation and the compliance matrix where applicable.
- Require review for sensitive changes, especially authentication, authorization, payments, personal data, cryptography and deployment configuration.

Before a release:
- Resolve release-blocking defects and critical/high security findings, or record an explicitly authorized risk decision.
- Verify supported platform builds and critical user journeys.
- Confirm backup/recovery and operational readiness appropriate to the release.
- Record the source commit, version, test evidence and known limitations.

## 6. Scope and claims

This is an internal engineering policy, not a claim of certification or independent conformity. Formal certification or attestation requires the relevant external assessment. Exact standard editions and OWASP project versions must be checked against their official publishers during each standards review and recorded before claiming alignment.

## 7. Compliance tracking

The living control register is [COMPLIANCE-MATRIX.md](./COMPLIANCE-MATRIX.md). Initially, controls are **Not assessed** unless there is direct evidence in the repository. The current project setup documents architecture and principles, but has not yet been installed, built or tested in a runtime environment.
