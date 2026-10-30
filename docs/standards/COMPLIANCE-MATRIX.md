# OmniMind Standards Compliance Matrix

**Last updated:** 2026-10-30  
**Assessment status:** Initial baseline; controls have not yet been technically assessed.

This matrix tracks implementation evidence. A roadmap item or policy document is not proof of a verified control.

| ID | Reference | Control / expected outcome | Scope | Evidence expected | Initial status |
|---|---|---|---|---|---|
| OWASP-01 | ASVS | Authentication and session handling meet selected verification requirements | Web/API | Requirements mapping, automated and manual tests | Not assessed |
| OWASP-02 | ASVS / API Security | Server-side object and role authorization; deny by default | API/data | Negative access-control tests | Not assessed |
| OWASP-03 | ASVS | Input validation, output encoding and injection defenses | Web/API | Unit, integration and security tests | Not assessed |
| OWASP-04 | ASVS | Sensitive data minimized and protected in transit/at rest | All | Data-flow review, storage/configuration tests | Not assessed |
| OWASP-05 | MASVS / MASTG | Secure local storage, permissions, links and platform integration | Android/iOS | Mobile security review and device tests | Not assessed |
| OWASP-06 | OWASP guidance | AI prompts and tool outputs treated as untrusted; user approval for consequential changes | AI | Threat model and approval-flow tests | Not assessed |
| NIST-01 | CSF 2.0 | Assets, owners and security responsibilities identified | Project | Asset inventory and ownership records | Not assessed |
| NIST-02 | CSF 2.0 | Risks assessed, treated and reviewed | Project | Risk register and review history | Not assessed |
| NIST-03 | SSDF | Secure development and dependency practices integrated into workflow | Engineering | Review checklist, dependency and pipeline evidence | Not assessed |
| NIST-04 | CSF 2.0 | Incident response and recovery process defined and exercised | Operations | Incident procedure and exercise record | Not assessed |
| IEEE-01 | 29148 | Significant requirements are clear, testable and traceable | Product | Requirements and acceptance criteria | Not assessed |
| IEEE-02 | 42010 | Architecture views and key decisions are documented | Architecture | Architecture docs and ADRs | In progress |
| IEEE-03 | 1012 | Verification/validation is planned and evidenced for critical features | Engineering | Test plans, results and defect records | Not assessed |
| ISO-01 | 25010 | Quality attributes translated into measurable requirements | Product | Quality requirements and measurements | Not assessed |
| ISO-02 | 27001 / 27002 | Security risks and selected controls are managed | Security | Risk treatment and control evidence | Not assessed |
| ISO-03 | 12207 | Lifecycle activities and change records are defined | Engineering | Lifecycle docs, commits, releases | In progress |
| GIT-01 | Project Git policy | Changes are small, traceable and reviewable | Repository | Commit/PR history and review records | In progress |
| GIT-02 | Project Git policy | Secrets and sensitive data are excluded from source control | Repository | Secret scanning and repository review | Not assessed |
| REL-01 | Combined | Release gates cover tests, security findings and known limitations | Delivery | CI results and release checklist | Not assessed |

## Assessment record template

For each control, record:
- assessment date and assessor;
- exact standard edition/version and applicable requirement IDs;
- affected files, modules, services and platforms;
- test or review method;
- evidence location (commit, pull request, test report or issue);
- result and limitations;
- remediation owner and due date, if failed;
- approval and review date for any exception.

## Status discipline

Use only the states defined in [the standards policy](./README.md). Change a control to **Verified** only when evidence exists and the verification has passed. Reassess after material changes to architecture, dependencies, data flows or threat exposure.
