# Auth Rules

## Objetivo

Estas reglas definen restricciones obligatorias para implementar auth en este proyecto.

## Reglas Obligatorias

1. La protección de rutas privadas se debe resolver con `proxy.ts` de Next.js 16.
2. La sesión se debe persistir usando cookies de Next.
3. No se deben guardar tokens de autenticación en `localStorage`, `sessionStorage` ni otros stores cliente equivalentes.
4. No se deben exponer tokens de autenticación a componentes cliente salvo que exista una necesidad explícita y validada por el contrato del feature.
5. Los componentes de UI no deben consumir directamente los endpoints IAM.
6. La integración con IAM debe pasar por la capa de datos y los mecanismos server-side definidos por la arquitectura del proyecto.
7. Las respuestas externas de IAM deben mapearse a contratos internos antes de llegar a presentation.
8. Las rutas privadas no deben renderizar contenido protegido cuando no exista sesión válida.
9. Cuando la sesión sea inválida y no pueda renovarse, se deben limpiar las cookies de autenticación.
10. Los errores mostrados al usuario no deben exponer detalles sensibles del backend, tokens, stack traces ni payloads internos.
11. La ruta especial `app/admin` debe ser accesible únicamente para `session.user.tipoUsuario === 'SUPER_ADMIN'`.
12. Si un usuario autenticado sin `tipoUsuario === 'SUPER_ADMIN'` intenta acceder a `app/admin`, la aplicación debe redirigirlo a `app/(auth)/login` sin invalidar su sesión.
13. La intención de acceso a `admin` no debe exponerse mediante query params visibles en la URL de login si puede resolverse por mecanismos server-side.
14. `proxy.ts` debe ser el dueño de la lógica principal de redirección por autenticación y tipo de usuario.
15. La autorización no debe inferirse desde `correo` ni `nombreUsuario`; debe resolverse desde `session.user.tipoUsuario`.
16. `session.user` debe construirse server-side a partir del endpoint de contexto autenticado.

## Reglas de Persistencia

- La cookie de sesión debe representar la fuente de verdad de autenticación para el frontend.
- Si existen `token` y `refrescarToken`, ambos deben gestionarse desde la capa server-side.
- La expiración de sesión debe respetar los tiempos provistos por el backend.
- Las cookies de auth solo pueden persistir:
  - `accessToken`
  - `accessTokenExpiresAt`
  - `refreshToken`
  - `refreshTokenExpiresAt`
- No se deben persistir en cookies:
  - `userName`
  - `email`
  - `role`
  - `userType`
  - `subject`
  - `userContext`

## Reglas de Integración

- El login debe usar el endpoint `POST /api/iam/autenticacion/inicio-sesion`.
- El contexto autenticado debe usar el endpoint `GET /api/iam/autenticacion/contexto-actual`.
- La renovación debe usar el endpoint `POST /api/iam/autenticacion/renovar-sesion`.
- El cierre de sesión debe usar el endpoint `POST /api/iam/autenticacion/cerrar-sesion` cuando aplique.
- Luego de login exitoso se debe consultar `contexto-actual` con el `accessToken`.
- Luego de un refresh exitoso se debe volver a consultar `contexto-actual`.
- Si `contexto-actual` responde `401`, la sesión debe considerarse inválida, limpiarse cookies y redirigir a `/login` en rutas protegidas.

## Prohibiciones

- No implementar auth apoyándose en estado exclusivo de cliente.
- No permitir acceso a rutas privadas por validación solo visual.
- No mezclar contratos IAM crudos dentro de componentes de presentación.
- No tratar una sesión expirada como autenticada.
- No guardar contexto de usuario en cookies.
- No reconstruir permisos o tipo de usuario desde mocks o emails hardcodeados.
- No reintroducir flujos de login condicionados por query params como `mode=admin`.
