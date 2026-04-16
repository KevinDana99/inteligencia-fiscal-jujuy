# Architecture Patterns

Use this reference when choosing the app shape, rendering model, or state strategy.

## Quick Selection

Choose a React SPA when:

- SEO is unimportant.
- The product is mostly authenticated.
- API boundaries already exist.
- Fast iteration matters more than first-request performance.

Choose SSR or hybrid rendering when:

- Landing pages or content routes need SEO.
- Time-to-first-meaningful-render matters.
- Personalization can still be resolved quickly on the server.

Choose a server-first framework when:

- The app mixes content and product surfaces.
- You want route-level data loading and fewer client round trips.
- The team can support stricter server/client boundaries.

Choose a BFF when:

- Multiple backend calls must be orchestrated per screen.
- The frontend needs normalized auth/session behavior.
- Backend APIs are fragmented or unstable.

Avoid micro-frontends unless:

- Teams deploy independently with hard ownership lines.
- Runtime isolation is more valuable than consistency.
- You can afford the operational and UX overhead.

## State Placement

Default placement:

- Server data: query/cache layer.
- URL-driven state: router search params.
- Ephemeral UI state: local component state.
- Cross-route session state: top-level app/session provider.

Introduce a global client store only when:

- The same client-owned state is consumed across distant branches.
- URL state is insufficient.
- Prop drilling or context composition becomes structurally expensive.

## Module Boundaries

Use feature modules for:

- Dashboards with multiple business capabilities.
- SaaS apps with billing, users, settings, reporting, and workflows.
- Teams that want clear ownership boundaries.

Use a lighter layered structure for:

- Small marketing sites.
- Simple internal tools.
- Short-lived MVPs with a narrow scope.

Stable boundary rule:

- UI components render.
- Feature modules coordinate use cases.
- Data modules talk to APIs.
- Shared libraries hold reusable primitives, not app-specific business rules.

## Performance Defaults

- Split by route before splitting by component.
- Stream or progressively reveal expensive regions only where it improves perceived load.
- Cache server data close to usage, but define invalidation rules early.
- Treat images, fonts, and third-party scripts as architecture decisions, not polish.

## Testing Defaults

- Put pure business logic under unit and integration tests.
- Cover critical user flows with e2e tests.
- Add contract tests or runtime validation around unstable APIs.
- Use visual regression only for design-system or highly visual surfaces.
