# IEEE Software Engineering Baseline

## Scope

IEEE standards provide structured methods for requirements, architecture and verification/validation. Apply the relevant published edition and document tailoring decisions.

## Reference baseline

- **ISO/IEC/IEEE 29148 — Requirements engineering:** requirements definition, quality, traceability and lifecycle management.
- **ISO/IEC/IEEE 42010 — Architecture description:** architecture concerns, stakeholders, viewpoints, views and rationale.
- **IEEE 1012 — System, software and hardware verification and validation:** plan and perform verification/validation activities proportionate to system risk.

These are reference frameworks, not a requirement to produce heavyweight paperwork for every small change.

## Required practices

1. Express each significant feature as clear, testable requirements with acceptance criteria.
2. Identify stakeholders, user needs, constraints, assumptions and external interfaces.
3. Maintain architecture views appropriate to the system: context, modules, data flows, deployment and security boundaries.
4. Record important architecture decisions, alternatives considered, consequences and review triggers as ADRs.
5. Maintain traceability from requirement to implementation area, tests and release evidence for critical functionality.
6. Define verification activities before implementation for high-risk or cross-platform features.
7. Distinguish verification ("built according to specification") from validation ("meets user need").
8. Review non-functional requirements including security, privacy, performance, accessibility, reliability, portability and maintainability.

## Minimum artifacts

- Roadmap and feature requirements.
- Architecture overview and module boundaries.
- Architecture Decision Records for consequential choices.
- Test plans and acceptance criteria for critical journeys.
- Traceability entries in the compliance matrix or feature documentation.

## Official references

- https://standards.ieee.org/standard/29148-2018.html
- https://www.iso.org/standard/74393.html
- https://standards.ieee.org/standard/1012-2016.html
