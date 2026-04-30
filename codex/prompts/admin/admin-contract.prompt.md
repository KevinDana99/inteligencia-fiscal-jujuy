# Admin Contract Prompt

## Objetivo

Implementar la integracion real del contrato de super administrador para el modulo `admin-panel`, reemplazando la fuente mock activa sin romper la UI ya existente.

## Referencias obligatorias

- `codex/specs/admin/admin-contract.spec.md`
- `codex/constraints/admin/admin-contract.rule.md`
- `codex/constraints/admin/admin-panel.rule.md`
- la skill `create-frontend-architecture`

## Contexto actual

- El modulo actual vive en `src/modules/admin-panel/**`.
- La UI del panel ya esta implementada.
- Hoy el modulo sigue apoyandose en una fuente mock temporal.
- El contrato real ya define endpoints, payloads y errores.
- El cambio de contraseña ya no tiene modal aparte y debe viajar dentro del `PATCH` de edicion.

## Alcance

La implementacion debe:

1. Integrar los endpoints reales del contrato de super administrador.
2. Crear la capa REST del modulo siguiendo la arquitectura del proyecto.
3. Mapear correctamente los DTOs del backend al dominio que consume la UI.
4. Conectar la UI actual de listado, alta, edicion y eliminacion al backend real.
5. Mantener la busqueda del lado frontend.
6. Mantener intacta la arquitectura de auth y sesion del proyecto.
7. Registrar logs server-side de entrada y salida para verificar el contrato.

## Endpoints a implementar

1. `GET /api/super-administrador/usuarios`
2. `GET /api/super-administrador/usuarios/{usuarioId}`
3. `POST /api/super-administrador/usuarios`
4. `PATCH /api/super-administrador/usuarios/{usuarioId}`
5. `DELETE /api/super-administrador/usuarios/{usuarioId}`

## Reglas funcionales

1. El listado debe usar `resumen.cantidadUsuariosActivos` y `usuarios`.
2. Crear usuario debe enviar:
   - `nombre`
   - `apellido`
   - `correo`
   - `cargo`
   - `contrasena`
3. Editar usuario debe enviar:
   - `nombre`
   - `apellido`
   - `correo`
   - `cargo`
   - `nuevaContrasena`
   - `confirmarContrasena`
4. Si no hay cambio de contraseña, `nuevaContrasena` y `confirmarContrasena` deben respetar el contrato esperado.
5. Eliminar usuario debe usar el `usuarioId` real del backend.
6. No crear endpoint adicional para cambio de contraseña.

## Reglas de implementacion

1. Crear DTOs de request/response separados en `data/sources/rest/dtos/`.
2. Crear mappers en `data/sources/rest/mappers/`.
3. Implementar `RestAdminPanelSource`.
4. Actualizar `data/interfaces/AdminPanelSource.ts` si hace falta para cubrir el contrato completo.
5. Actualizar `data/data-access.ts` para que el modulo pueda usar la fuente REST real.
6. Crear o ajustar server actions para query y commands.
7. Reutilizar patrones del modulo `auth` como referencia de implementacion de contratos.
8. Mantener la UI desacoplada de shapes del backend.

## Logging

1. Loggear entrada y salida del lado servidor para cada operacion del contrato.
2. Los logs deben mostrar payload y respuesta de manera util para debugging.
3. No exponer secretos completos en logs si hubiera datos sensibles.

## Archivos esperados

La implementacion deberia concentrarse en:

- `src/modules/admin-panel/data/interfaces/AdminPanelSource.ts`
- `src/modules/admin-panel/data/data-access.ts`
- `src/modules/admin-panel/data/models/AdminPanel.ts`
- `src/modules/admin-panel/data/actions/**`
- `src/modules/admin-panel/data/sources/rest/**`
- `src/modules/admin-panel/presentation/hooks/**`
- `src/modules/admin-panel/presentation/components/AdminPanelModals/index.tsx`
- `src/modules/admin-panel/presentation/components/AdminPanelUserGestionTable/index.tsx`

Si algun archivo mock deja de ser necesario como fuente activa, debe quedar desplazado por la fuente REST sin romper el modulo.

## Fuera de alcance

1. No rehacer la UI del admin panel.
2. No tocar auth fuera de lo estrictamente necesario para reutilizar el token actual.
3. No crear nuevas rutas.
4. No agregar endpoints inventados.
5. No volver al flujo mock una vez que la integracion real quede lista.

## Validacion final

Antes de cerrar la tarea:

1. Verificar que el modulo compile con la fuente REST real.
2. Verificar que la tabla siga mostrando usuarios correctamente.
3. Verificar crear usuario.
4. Verificar editar usuario, incluyendo cambio opcional de contraseña en el mismo endpoint.
5. Verificar eliminar usuario.
6. Verificar manejo de errores del contrato sin romper la pantalla.
7. Correr:

```bash
bun run lint
bun run build
```
