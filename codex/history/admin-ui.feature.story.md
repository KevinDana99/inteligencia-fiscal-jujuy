# Admin UI Feature Story

## Presentation Structure Refactor

Refactored the admin panel presentation layer to follow the `create-frontend-architecture` component folder convention.

### Main Changes

- Kept `AdminPanelShell` as the screen-level composition component.
- Extracted navbar, sidebar, home section, widgets section, metric card, user gestion table, modals, and settings section into dedicated folders under `presentation/components`.
- Moved `useAdminPanelShell` into `presentation/hooks` and exposed it through the hooks barrel.
- Added `presentation/utils/getInitials.ts` for shared presentation formatting.
- Preserved the current UI behavior and visual classes during the structural refactor.

### Validation

- `bun run lint`
- `bun run build`

### Notes

- The refactor intentionally kept the existing CSS module shared from `AdminPanelShell` to avoid visual churn while separating component ownership.
- Future UI prompts can move styles closer to each component when each section is iterated.
