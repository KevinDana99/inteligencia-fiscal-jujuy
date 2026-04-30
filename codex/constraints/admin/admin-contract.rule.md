# Admin Contract Rules

## Objetivo

Estas reglas definen las restricciones obligatorias para integrar el contrato real del panel de super administrador sin romper la feature ya implementada.

## Fuente de verdad

1. La fuente principal del contrato es `codex/specs/admin/admin-contract.spec.md`.
2. Si existe cualquier diferencia entre mocks previos del panel y el contrato real, prevalece el contrato.
3. Los nombres de campos del JSON deben respetarse exactamente como vienen del backend en español.
4. Los types internos de TypeScript pueden estar en ingles, pero eso no debe alterar el shape del payload ni de las respuestas.

## Arquitectura

1. La implementacion debe seguir la skill `create-frontend-architecture`.
2. La capa de datos del modulo `admin-panel` debe migrar desde mock temporal a una integracion real basada en:
   - `data/interfaces/`
   - `data/sources/rest/`
   - `data/sources/rest/dtos/`
   - `data/sources/rest/mappers/`
   - `data/sources/rest/cache/` si hiciera falta
   - `data/actions/`
3. No se debe saltar directo desde presentation a `fetch`.
4. La logica de llamadas HTTP debe vivir en `RestAdminPanelSource`.
5. Los mappers deben convertir DTOs del backend a modelos del dominio del modulo.
6. El modulo debe conservar la separacion entre datos, modelos y presentacion.

## Autorizacion y sesion

1. Todos los endpoints requieren `Authorization: Bearer <token>`.
2. La implementacion no debe cambiar el contrato actual de auth.
3. No se debe reimplementar login, logout, refresh token ni cookies para resolver el contrato admin.
4. La integracion debe reutilizar la sesion/token actual del sistema.
5. Si hace falta leer el token del lado servidor, debe hacerse siguiendo el mismo criterio ya usado por auth en el proyecto.

## Endpoints obligatorios

1. Debe integrarse:
   - `GET /api/super-administrador/usuarios`
   - `GET /api/super-administrador/usuarios/{usuarioId}`
   - `POST /api/super-administrador/usuarios`
   - `PATCH /api/super-administrador/usuarios/{usuarioId}`
   - `DELETE /api/super-administrador/usuarios/{usuarioId}`
2. La busqueda y el filtrado visual siguen del lado del frontend.
3. No se deben inventar endpoints adicionales si no estan en el contrato.

## DTOs y mapeo

1. Deben existir DTOs separados para:
   - listar usuarios
   - consultar usuario
   - crear usuario
   - editar usuario
   - errores transversales
2. Los DTOs deben reflejar el contrato tal cual:
   - `usuarioId`
   - `nombre`
   - `apellido`
   - `correo`
   - `cargo`
   - `activo`
   - `esSuperAdministrador`
3. El dominio del modulo puede seguir usando nombres propios del frontend, pero debe existir mapper explicito.
4. El mapper debe resolver correctamente:
   - nombre completo del usuario
   - email
   - rol/cargo
   - flag de super admin
   - cantidad de usuarios activos desde `resumen.cantidadUsuariosActivos`

## Operaciones funcionales

1. Crear usuario debe usar `POST /api/super-administrador/usuarios`.
2. Editar usuario debe usar `PATCH /api/super-administrador/usuarios/{usuarioId}`.
3. El cambio de contraseña debe resolverse dentro del mismo `PATCH`, no con endpoint aparte.
4. Eliminar usuario debe usar `DELETE /api/super-administrador/usuarios/{usuarioId}`.
5. Consultar usuario por id debe estar disponible en la capa de datos aunque la UI actual no lo consuma todavia.

## Errores y restricciones

1. Deben contemplarse errores `400`, `401`, `403`, `404` y `409` segun el contrato.
2. No se debe inventar un formato propio de error distinto al del backend.
3. La cuenta `Super Administrador` no debe poder editarse ni eliminarse si el backend responde operacion no permitida.
4. La UI no debe romper si el backend responde esos errores.
5. En esta iteracion alcanza con propagar o mapear esos errores correctamente; estados visuales complejos pueden iterarse luego si no son necesarios para completar la integracion.

## Logging servidor

1. Deben registrarse logs de entrada y salida del lado servidor para verificar la implementacion del contrato.
2. Los logs deben vivir en la capa server/data, no en presentation.
3. No se deben loggear secretos sensibles completos si el token o datos delicados estuvieran disponibles.
4. El logging debe ser suficiente para ver:
   - endpoint invocado
   - payload enviado
   - estado de respuesta
   - payload recibido

## Compatibilidad con la feature actual

1. No se debe romper la UI ya implementada del panel admin.
2. No se debe romper `/admin` ni `/admin/configuracion`.
3. No se deben reintroducir widgets eliminados si el contrato no los trae.
4. Si alguna parte de la UI actual depende de datos mock que ya no existen, debe ajustarse al contrato real sin inventar datos.
5. La busqueda local de usuarios debe seguir funcionando sobre la respuesta real del backend.

## Validacion

1. `bun run lint` debe seguir pasando.
2. `bun run build` debe seguir pasando.
3. La implementacion debe poder listar usuarios reales del contrato.
4. Crear, editar y eliminar deben quedar conectados al backend real.
5. La capa mock anterior no debe seguir siendo la fuente activa de datos para esta feature una vez terminada la integracion.
