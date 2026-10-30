# NIST Cybersecurity Baseline

## Scope

NIST references guide OmniMind's cybersecurity governance, risk assessment and operational security. They complement—not replace—technical application-security verification.

## Reference baseline

- **NIST Cybersecurity Framework (CSF) 2.0:** organize cybersecurity outcomes across Govern, Identify, Protect, Detect, Respond and Recover.
- **NIST SP 800-53:** a catalog of security and privacy controls; select and tailor controls proportionately rather than adopting the entire catalog indiscriminately.
- **NIST SP 800-63 series:** digital identity guidance where relevant to authentication, identity proofing and authenticator management.
- **NIST Secure Software Development Framework (SSDF), SP 800-218:** integrate secure development practices into the software life cycle.

Use current official publications and record exact revisions in assessment records.

## Required practices

1. Maintain an inventory of application components, data stores, external services, environments and owners.
2. Identify information types and data sensitivity; collect and retain only what the product needs.
3. Maintain a risk register covering confidentiality, integrity, availability, privacy, supply chain and operational risks.
4. Define security responsibilities, approval authority and escalation paths.
5. Apply least privilege to users, services, developers and automation.
6. Protect development and release pipelines, review dependencies and prevent secrets from entering source control.
7. Monitor relevant security events while minimizing sensitive log content.
8. Define incident handling: preparation, detection, containment, recovery and lessons learned.
9. Define backup, restoration and continuity expectations before production use.
10. Reassess risks after major architecture, provider, data-flow or threat changes.

## Risk record

Each material risk should include: identifier, scenario, affected assets, likelihood, impact, existing controls, treatment decision, owner, due date and review date. Risk acceptance must be explicit and time-bounded.

## Verification and evidence

Evidence may include architecture/data-flow diagrams, access-control tests, dependency reports, configuration reviews, incident exercises, backup-restore tests and release records. A policy statement alone is not evidence of operational effectiveness.

## Official references

- https://www.nist.gov/cyberframework
- https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final
- https://pages.nist.gov/800-63-3/
- https://csrc.nist.gov/pubs/sp/800/218/final
