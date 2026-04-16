# Output Template

Use this structure when the user asks for a frontend architecture and does not request another format.

## Architecture Brief

- Product goal
- Users and critical journeys
- Constraints
- Assumptions

## Recommended Stack

- Framework/runtime
- Rendering strategy
- Data fetching and caching approach
- Form handling and validation approach
- Testing stack

For each choice, include one sentence on why it fits and one sentence on what was rejected.

## Application Structure

- Route groups
- Feature modules
- Shared shell
- Design system boundary
- Data-access boundary

Include example module names or folders only when they clarify ownership.

## Data And State Model

- Server state
- URL state
- Local UI state
- Session/app state
- Mutation flow

## Delivery Plan

1. Foundation work
2. Core vertical slices
3. Hardening and migration

For each phase, state the main deliverables and dependencies.

## Risks And Open Questions

- Architectural risks
- Unknowns to validate
- Follow-up spikes or decisions needed
