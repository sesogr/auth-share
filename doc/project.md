# Phase 1: Foundations & Modeling (Aug 18th..29th)

**Goal**: Agree on problem space, ubiquitous language, domain model.

## Topics

- Recap UML (use case, class, sequence diagrams).
- DDD basics: entities, value objects, aggregates, repositories.
- Requirements engineering (use cases → domain model).

## Activities

- Nominal phrase analysis → draft class diagram.
- Sequence diagrams for 2–3 core scenarios (login, add service, launch).
- Define bounded contexts (small-scale).

**Deliverables**: Domain model v1, glossary (ubiquitous language), diagrams.

# Phase 2: Walking Skeleton & Infrastructure (Sep 1st..12th)

**Goal**: A bare-bones app runs end-to-end.

## Topics

- MVC / Hexagonal architecture.
- Authentication basics.
- Git, CI/CD intro.

## Activities

- Build minimal backend (fake data).
- Simple frontend (login form, list of mock services, “launch” button).
- Set up CI pipeline, testing scaffold.

**Deliverables**: Walking skeleton demo.

# Phase 3: Core Domain Implementation (Sep 15th..Oct 2nd)

**Goal**: Services + credentials handled properly.

## Topics

- Repository pattern.
- Persistence (DB + ORM).
- Security (hashing, encryption, secret storage).
- Immutability & value objects in practice.

## Activities

- Implement Service + Credential aggregates.
- Add “Add Service” flow with persistence.
- Launch mechanisms (direct redirect, copy to clipboard fallback).
- Unit + integration tests for aggregates.

**Deliverables**: Functioning app with services CRUD, credential handling.

# Phase 4: Cross-Cutting Concerns (Oct 6th..17th)

**Goal**: Make the system robust & professional.

## Topics

- Error handling, logging.
- Authorization & roles.
- Auditing (who accessed what, when).

## Activities

- Add audit log aggregate.
- Role-based access (admin vs member).
- QA audit checklist (review invariants, security).

**Deliverables**: Audit log feature, RBAC, QA review report.

# Phase 5: Testing & Quality (Oct 20th..30th)

**Goal**: Stabilize & raise quality bar.

## Topics

- Test pyramid (unit, integration, E2E).
- Test doubles (mocks, fakes).
- Manual exploratory testing.

## Activities

- Write missing unit tests.
- Add 1–2 E2E test flows (login, launch service).
- Peer reviews & refactoring sessions.

**Deliverables**: Test coverage reports, refactored code.

# Phase 6: Delivery & Reflection (Nov 3rd..7th)

**Goal**: Ship and reflect on learning.

## Topics

- Deployment basics (local/docker).
- Retrospectives.

## Activities

- Deploy demo version (local or cloud).
- Final presentation: domain model → architecture → demo → lessons learned.

**Deliverables**: Working app, architecture docs, presentation.