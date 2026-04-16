# Auth Feature Story

## Summary

Implemented the first authentication foundation for the project with:

- login route at `/login`
- private root route protected by proxy and server-side session checks
- cookie-based session persistence
- session refresh support
- logout flow
- reusable auth module and server-side auth helpers
- initial admin route placeholder restricted to admin

## Main Changes

### Routing and protection

- Added `app/(auth)/login/page.tsx` for the public login route.
- Moved the main page to `app/(private)/page.tsx`.
- Added `app/(private)/layout.tsx` to require a valid server session.
- Added `proxy.ts` to gate private routes, redirect unauthenticated users, refresh renewable sessions, and redirect authenticated users away from `/login`.

### Auth infrastructure

- Added `src/lib/auth/` with:
  - cookie constants
  - cookie read/write helpers
  - server session resolution
  - required-session helper
  - refresh-session helper
  - session mappers

### Auth module

- Added `src/modules/auth/` with:
  - domain models
  - source interfaces
  - REST source
  - mock source
  - server actions
  - client hooks
  - Mantine login form
  - session menu component

### Existing module integration

- Updated `src/modules/catalog-showcase/data/data-access.ts` to prefer the authenticated session token before falling back to the previous env token.

### Admin role support

- Added minimal internal role support for `admin`.
- Added a guarded placeholder route at `app/(private)/admin/page.tsx`.
- Restricted that route to the `admin` role only.
- Added a distinct mock normal user and kept a separate mock `admin`.
- Redirected authenticated non-admin users from `/admin` to `/login` without clearing the active session.
- Preserved the explicit admin escalation flow through `/login?mode=admin` for users who need to reauthenticate as `admin`.

### Mock credentials

- Normal user:
  - `correo`: `user@plantilla.local`
  - `contrasena`: `ChangeMe123!`
- Admin:
  - `correo`: `admin@plantilla.local`
  - `contrasena`: `ChangeMe123!`

### API client

- Extended `src/lib/api-client.ts` with:
  - `ApiClientError`
  - generic request helper
  - `postJson`

## Validation

Verified successfully with:

- `bun run lint`
- `bun run build`

## Notes

- The implementation uses `proxy.ts`, which matches the Next.js 16 file convention for request interception.
- Mock auth is enabled by default unless `NEXT_PUBLIC_USE_MOCK_AUTH` is explicitly set to `false`.
