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

## 2026-06-03 Login real conectado

- Auth dejó de entrar en mock por default.
- El flujo real queda activo salvo que `NEXT_PUBLIC_USE_MOCK_AUTH=true`.
- Se unificó el criterio mock/real en `src/lib/auth/is-mock-auth-enabled.ts` para alinear `data-access.ts` y `refresh-session.ts`.
- El login mantiene visibles las credenciales de prueba sólo cuando auth mock está habilitado explícitamente.
- La config de `k3s/frontend-config.yaml` quedó alineada para usar el backend real en despliegue.
- Se agregó normalización del DTO de `contexto-actual` para soportar `tipo_usuario` del backend y poblar correctamente `session.user.tipoUsuario`.

## 2026-06-04 Separación estricta entre admin y dashboard privado

- `proxy.ts` ahora resuelve la separación completa entre `/admin` y el dashboard privado común, no solo la entrada a `/login`.
- Un `SuperAdministrador` que intente abrir `/` o cualquier ruta del dashboard privado es redirigido de vuelta a `/admin`.
- Un `ANALISTA_FISCAL` que intente abrir `/admin` o subrutas como `/admin/configuracion` es redirigido a `/login` sin invalidar su sesión.
- `app/(private)/PrivateLayoutGate.tsx` dejó de aceptar cualquier sesión autenticada y ahora exige una sesión apta para el dashboard privado común.
- Se agregó `src/lib/auth/route-access.ts` con pruebas unitarias para blindar la matriz de redirecciones y evitar regresiones en navegación.
- Se relajó el guard server-side del dashboard privado para que replique la misma regla del `proxy`: solo expulsa a admins, evitando bucles cuando el backend devuelve variantes no-admin de `tipoUsuario`.

## 2026-06-11 Renovación resiliente de sesión expirada

- Se agregó refresh proactivo con margen de 60 segundos antes del vencimiento del access token.
- `getServerAuthSession({ forceRefresh: true })` centraliza renovación, persistencia de cookies, recomposición de `contexto-actual` y limpieza ante sesión inválida.
- `proxy.ts` propaga cookies renovadas al response y al request interno para que el render server-side del mismo request use la sesión fresca.
- `src/lib/api-client.ts` reintenta una sola vez ante `401` usando `refreshAccessToken`, y los data sources protegidos comparten `createAuthenticatedApiClientConfig`.
- Los sources REST con `fetch` directo y la descarga local de documentos quedaron cubiertos por `fetchWithAuthRetry`.
- `/login` muestra una notificación segura y efímera cuando el usuario fue redirigido porque la sesión expiró.
- Validado con `bun run test`, `bunx tsc --noEmit`, `bun run lint` y `bun run build`.

## 2026-06-15 Chrome DevTools well-known redirect

- Se corrigió el redirect post-login para ignorar rutas internas del navegador bajo `/.well-known`, incluyendo `/.well-known/appspecific/com.chrome.devtools.json`.
- `proxy.ts` ya no aplica el proxy de auth sobre `/.well-known`, evitando que Chrome DevTools contamine la cookie `auth-post-login-redirect`.
- `signInAction` valida la cookie antes de redirigir y cae al destino por tipo de usuario cuando el valor no es una ruta válida de la app.
- Se agregaron tests en `route-access.test.ts` para rutas privadas válidas, `/login`, redirects externos y rutas internas de navegador.

## 2026-06-16 Login Server Action cache guard

- Se movió el render del `LoginForm` detrás de un Server Component con `connection()` dentro de `Suspense`, evitando que `/login` prerenderice/cachee HTML con IDs viejos de Server Actions.
- `useLoginForm` importa `signInAction` desde el archivo directo de comando, no desde el barrel `data/actions`.
- `useSignOut` importa `signOutAction` desde el archivo directo de comando, manteniendo la misma defensa para el menú de sesión.
- Validado con `bun x eslint`, `bun x tsc --noEmit --incremental false`, `bun run build` y `git diff --check`.
