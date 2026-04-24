# Admin UI Feature Story

## Presentation Refactor And UI Iteration

Refined the admin panel presentation layer so the UI can be iterated by section while keeping the visual implementation aligned with `admin-ui.spec.md`.

### Main Changes

- Refactored `presentation/components` into dedicated component folders:
  - `AdminPanelNavbar`
  - `AdminPanelSidebar`
  - `AdminPanelShell`
  - `AdminPanelSettingsSection`
  - `AdminPanelSettingsPage`
  - `AdminPanelHomeSection`
  - `AdminPanelUserGestionTable`
  - `AdminPanelModals`
- Moved `useAdminPanelShell` into `presentation/hooks` and exposed it through the hooks barrel.
- Added shared presentation utilities such as `getInitials` and avatar color helpers.
- Implemented the navbar visual iteration from `admin-ui.spec.md`.
- Adjusted the sidebar visual behavior and converted section items to real Next.js links.
- Iterated the user management table UI:
  - admin avatar fixed in `blue-5`
  - non-admin avatars rotate through palette colors without repetition until the set is exhausted
  - admin row has no destructive or editing actions
  - admin row includes crown affordance

### Validation

- `bun run lint`
- `bun run build`

### Notes

- The admin UI is tracked separately from the feature-level module history so functional changes and visual changes do not get mixed.
- The removed widgets section should not be reintroduced unless the spec explicitly adds it again.
