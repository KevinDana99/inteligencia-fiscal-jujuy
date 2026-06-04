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
