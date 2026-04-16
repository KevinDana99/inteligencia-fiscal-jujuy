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
11. La ruta especial `app/(private)/admin` debe ser accesible únicamente para el rol `admin`.
12. Si un usuario autenticado sin rol `admin` intenta acceder a `app/(private)/admin`, la aplicación debe redirigirlo a `app/(auth)/login` sin invalidar su sesión.
13. La intención de acceso a `admin` no debe exponerse mediante query params visibles en la URL de login si puede resolverse por mecanismos server-side.

## Reglas de Persistencia

- La cookie de sesión debe representar la fuente de verdad de autenticación para el frontend.
- Si existen `token` y `refrescarToken`, ambos deben gestionarse desde la capa server-side.
- La expiración de sesión debe respetar los tiempos provistos por el backend.

## Reglas de Integración

- El login debe usar el endpoint `POST /api/iam/autenticacion/inicio-sesion`.
- La renovación debe usar el endpoint `POST /api/iam/autenticacion/renovar-sesion`.
- El cierre de sesión debe usar el endpoint `POST /api/iam/autenticacion/cerrar-sesion` cuando aplique.

## Prohibiciones

- No implementar auth apoyándose en estado exclusivo de cliente.
- No permitir acceso a rutas privadas por validación solo visual.
- No mezclar contratos IAM crudos dentro de componentes de presentación.
- No tratar una sesión expirada como autenticada.
