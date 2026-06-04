# Prompt Auth Refactor

Implementar el refactor del módulo de autenticación en base a:

- `codex/specs/auth/auth-refactor.spec.md`
- `codex/constraints/auth/auth.rule.md`

## Objetivo

Reestructurar auth para que:

- las cookies persistan solo tokens
- `session.user` se construya server-side desde `GET /api/iam/autenticacion/contexto-actual`
- la autorización use `session.user.tipoUsuario`
- `proxy.ts` sea el dueño de la lógica principal de redirección
- se eliminen inferencias por email, mocks y query params del flujo real

## Alcance

La implementación debe cubrir:

1. contrato de contexto actual
2. source REST/mock de contexto actual
3. action server-side para obtener contexto autenticado
4. refactor del login
5. refactor de cookies y lectura de sesión
6. refactor de refresh
7. ajuste de `proxy.ts`
8. migración de consumers desde `role` a `tipoUsuario`

## Reglas de implementación

1. No modificar visualmente el login salvo lo estrictamente necesario para sostener el nuevo flujo.
2. No guardar `userName`, `email`, `role`, `userType`, `subject` ni `userContext` en cookies.
3. Guardar en cookies solo:
   - `accessToken`
   - `accessTokenExpiresAt`
   - `refreshToken`
   - `refreshTokenExpiresAt`
4. `session.user` debe construirse desde el contrato de `contexto-actual`.
5. El frontend no debe inferir permisos desde `correo` o `nombreUsuario`.
6. El frontend debe usar `session.user.tipoUsuario`.
7. `SUPER_ADMINISTRADOR` y `ANALISTA_FISCAL` son los únicos tipos válidos del contrato actual.
8. `proxy.ts` debe resolver:
   - usuario no autenticado -> `/login`
   - usuario autenticado entrando a `/login` -> redirect según `tipoUsuario`
   - acceso a rutas privadas
9. Si `contexto-actual` responde `401`, se deben limpiar cookies y tratar la sesión como inválida.
10. Luego de refresh exitoso se debe volver a consultar `contexto-actual`.
11. No reintroducir query params del tipo `mode=admin`.
12. No dejar heurísticas basadas en `AUTH_MOCK_USERS` dentro del flujo real de auth.

## Contratos a usar

### Login

- `POST /api/iam/autenticacion/inicio-sesion`

### Refresh

- `POST /api/iam/autenticacion/renovar-sesion`

### Sign out

- `POST /api/iam/autenticacion/cerrar-sesion`

### Contexto actual

- `GET /api/iam/autenticacion/contexto-actual`

## Modelo esperado

```ts
type TipoUsuario = 'SUPER_ADMINISTRADOR' | 'ANALISTA_FISCAL'

type IAuthUser = {
  autenticado: boolean
  esquema: string | null
  nombreUsuario: string | null
  correo: string | null
  sujeto: string | null
  tipoUsuario: TipoUsuario | null
}

type IAuthSession = {
  accessToken?: string
  accessTokenExpiresAt?: string
  refreshToken?: string
  refreshTokenExpiresAt?: string
  user: IAuthUser
}
```

## Estructura esperada

Seguir la arquitectura del proyecto:

- `data/models`
- `data/interfaces`
- `data/sources/mock`
- `data/sources/rest`
- `data/actions`
- `presentation/hooks`

No mover lógica contractual a componentes visuales.

## Secuencia recomendada

1. Ajustar modelos de `Auth`
2. Agregar DTOs y source de `contexto-actual`
3. Refactorizar cookies para persistir solo tokens
4. Refactorizar `signInAction`
5. Refactorizar lectura de sesión server-side
6. Refactorizar refresh
7. Ajustar `proxy.ts`
8. Migrar consumers a `tipoUsuario`
9. Eliminar restos legacy (`role`, inferencias por email, query params, mocks fuera de MockAuthSource)

## Verificaciones obligatorias

1. Usuario no autenticado entrando a ruta privada -> `/login`
2. Usuario autenticado entrando a `/login` -> redirect según `tipoUsuario`
3. `SUPER_ADMINISTRADOR` puede entrar a `/admin`
4. `ANALISTA_FISCAL` no puede entrar a `/admin`
5. Luego del login se construye `session.user` desde `contexto-actual`
6. Luego de refresh exitoso se reconstruye `session.user`
7. Si falla `contexto-actual`, se limpian cookies y se invalida la sesión
8. Ninguna cookie contiene datos del contexto del usuario

## No hacer

- No dejar `session.user.role`
- No usar `AUTH_MOCK_USERS` para autorización real
- No guardar contexto de usuario en cookies
- No resolver login admin por query params
- No duplicar lógica de redirect entre page, layout y proxy si el proxy ya la cubre
