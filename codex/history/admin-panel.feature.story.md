# Admin Panel Feature Story

## Feature Foundation

Implemented the initial `admin-panel` module as the administrative feature entry for `/admin`.

### Main Changes

- Added the module structure under `src/modules/admin-panel` following the `create-frontend-architecture` skill.
- Defined the admin panel domain models, mock source, data-access entry, and query action to serve temporary data while there is no backend contract.
- Established the main presentation flow for the admin dashboard, including user management state, mock CRUD interactions, and admin-only restrictions.
- Added routing support for separate admin pages:
  - `/admin`
  - `/admin/configuracion`
- Introduced a shared `AdminPanelTemplate` so dashboard and settings pages use the same shell, navbar, sidebar, and page padding.

### Validation

- `bun run lint`
- `bun run build`

### Notes

- The module remains on mock data until a backend contract exists.
- UI refinements and visual parity are tracked separately in `codex/history/admin-ui.feature.story.md`.

## 2026-06-03 Super Admin users real

- `admin-panel` dejó de caer en mock por default y ahora usa REST salvo que `NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL=true`.
- Se conectó `GET /api/super-administrador/usuarios` al backend real.
- El mapper del listado ahora soporta tanto el contrato completo con `usuarioId/nombre/apellido/...` como la respuesta real actual del backend con `usuario/correo/cargo`.
- La capa REST alinea `err` con el contrato interno del frontend para que las server actions no pierdan mensajes de error.
- `k3s/frontend-config.yaml` quedó preparado para usar REST en el panel admin.

## 2026-06-03 Super Admin allowed domains real

- Se conectó `GET|POST|DELETE /api/super-administrador/dominios-permitidos` en la sección `Configuración` del `admin-panel`.
- `/admin/configuracion` ahora resuelve la carga inicial a través de `getAllowedDomainsAction`, con logging server-side y manejo explícito de errores.
- El formulario de alta de dominios migró a `useActionState`, con validación server-side de requerido, formato y duplicados antes de invocar el `POST`.
- Las acciones de agregar y eliminar dominios ahora revalidan `/admin/configuracion` y exponen errores con la clave interna `error`, evitando perder mensajes del backend en la UI.
- La whitelist quedó centralizada en un provider del módulo con persistencia en `localStorage`, para que create/edit user validen el dominio del email contra la configuración activa antes de enviar el submit.

## 2026-06-04 Admin layout shell refactor

- El shell compartido de admin dejó de vivir dentro de `AdminPanelModule` y ahora se monta desde `app/admin/layout.tsx`.
- `AdminPanelModule` quedó enfocado en la home y mueve el `Loader` al `Suspense` de `AdminPanelHomeSection`.
- `useAdminPanelShell` quedó como hook orquestador y delega responsabilidades en hooks SOLID para usuarios, búsqueda, modales, eliminación y palette de avatares.
- Se separaron constantes y utilidades de roles, navegación, fechas, fingerprints, configuración, formularios y fortaleza de contraseña.
- Se chunkearon componentes largos de settings, tabla de usuarios y modales de usuario para mantener lectura simple y props tipadas en el mismo archivo.
- Los tests de contrato admin se alinearon con los modelos normalizados actuales (`isAdmin`, `isDeleted`, `newPassword`/`confirmPassword`).

### Validation

- `bun x tsc --noEmit`
- `bun run test -- admin-panel`
- `bun run lint` queda sin errores; mantiene 4 warnings existentes en `unified-register`.

## 2026-06-04 Admin layout loading fallback

- Se reemplazó el fallback `null` del `Suspense` de `app/admin/layout.tsx` por un skeleton de shell admin con el loader de `AdminPanelHomeSection` en el área principal.
- El refresh de `/admin` y `/admin/configuracion` ya no muestra el fondo vacío mientras resuelve sesión y dominios permitidos.
- La carga bloqueante sigue aislada en `AdminLayoutGate`, debajo de la boundary suspendible.

### Validation

- `bun x tsc --noEmit`
- `bun run lint` queda sin errores; mantiene 4 warnings existentes en `unified-register`.
