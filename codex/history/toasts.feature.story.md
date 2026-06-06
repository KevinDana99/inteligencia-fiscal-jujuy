# Toasts Feature Story

## 2026-06-05 Login success toast base

- Added a reusable toast foundation backed by `@mantine/notifications` and exposed through a small `toast.success` facade.
- Built the first custom success notification UI with a white surface, green left accent, circular check icon, strong title, and muted description.
- Mounted a single global notifications viewport inside the core providers and imported Mantine notification styles at the app root.
- Added a short-lived client-readable login success flash cookie in `signInAction`, then consumed and cleared it from authenticated dashboard and admin shells.
- The login success toast now displays once after each successful login with dynamic copy: `Hola, {displayName}` and `Ingresaste correctamente al sistema.`

### Validation

- `bun x tsc --noEmit`
- `bun x tsc --noEmit --incremental false`
- `bun run test -- auth`
- Targeted `bun x eslint` over all files touched by the toast implementation
- `bun run lint` remains blocked by an existing `react-hooks/set-state-in-effect` error in `reprocessing` and existing warnings in `unified-register`.
