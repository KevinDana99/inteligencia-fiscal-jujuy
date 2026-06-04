## Objetivo

Refactorizar el módulo de autenticación para que la única verdad del usuario autenticado sea el endpoint de contexto y no inferencias locales por email, mocks o cookies enriquecidas.

## Problemas actuales

- `session-mapper.ts` infiere permisos/rol desde `AUTH_MOCK_USERS`.
- `cookies.ts` persiste datos de usuario que no deben vivir en cookies.
- `refresh-session.ts` reconstruye usuario mock.
- `useSignIn.ts` decide navegación con heurísticas locales.
- Existen responsabilidades mezcladas entre login, cookies, sesión, refresh y proxy.

## Flujo objetivo

1. El usuario inicia sesión.
2. El backend responde tokens del contrato de login.
3. El frontend guarda solo tokens en cookies.
4. Con el `accessToken` se consulta `GET /api/iam/autenticacion/contexto-actual`.
5. Con esa respuesta se construye `session.user` server-side.
6. `proxy.ts` decide autenticación y redirecciones según tokens válidos + `userType`.

## Persistencia en cookies

Las cookies de autenticación deben guardar únicamente:

- `accessToken`
- `accessTokenExpiresAt`
- `refreshToken`
- `refreshTokenExpiresAt`

No se debe guardar en cookies:

- `userName`
- `email`
- `role`
- `userType`
- `subject`
- `userContext`

## Modelo de sesión

La sesión en runtime debe seguir exponiendo `session.user`, pero ese objeto se construye desde el contrato de contexto y no se persiste en cookies.

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

## Reglas de autorización

- La aplicación no debe inferir permisos desde `correo` o `nombreUsuario`.
- La aplicación debe usar `session.user.tipoUsuario`.
- `SUPER_ADMINISTRADOR` habilita acceso a `/admin`.
- `ANALISTA_FISCAL` habilita acceso al dashboard privado común.
- `proxy.ts` es el dueño de la lógica principal de redirección.
- Los consumers del frontend deben migrar de `session.user.role` a `session.user.tipoUsuario`.

## Reglas de sesión server-side

- El contexto del usuario se resuelve server-side usando el `accessToken`.
- El contexto no se persiste en cookies.
- En la primera request server-side se leen los tokens y luego se consulta `contexto-actual`.
- Durante ese request la sesión enriquecida puede reutilizarse en memoria server-side.

## Reglas de refresh

- Si el `accessToken` venció pero el `refreshToken` sigue vigente:
  1. llamar `POST /api/iam/autenticacion/renovar-sesion`
  2. guardar los nuevos tokens en cookies
  3. volver a consultar `GET /api/iam/autenticacion/contexto-actual`
  4. reconstruir `session.user`
- Si el refresh falla:
  - limpiar cookies
  - invalidar sesión
  - redirigir a `/login` en rutas protegidas
- Si `contexto-actual` responde `401`, incluso después de un refresh exitoso:
  - limpiar cookies
  - invalidar sesión
  - redirigir a `/login` en rutas protegidas

## Reglas de proxy

`proxy.ts` debe encargarse de:

- si no hay sesión válida, redirigir a `/login`
- si un usuario autenticado entra a `/login`, redirigir según `tipoUsuario`
- si un usuario `SUPER_ADMINISTRADOR` entra a `/login`, redirigir a `/admin`
- si un usuario `ANALISTA_FISCAL` entra a `/login`, redirigir a `/`
- si una ruta privada requiere autenticación, resolverlo desde proxy

`proxy.ts` no debe:

- inferir usuario por email
- inferir permisos por nombre de usuario
- depender de query params para decidir login admin

## Implementación deseada

### 1. Login

- `signInAction` debe:
  - llamar `POST /api/iam/autenticacion/inicio-sesion`
  - guardar solo tokens en cookies
  - consultar `GET /api/iam/autenticacion/contexto-actual`
  - devolver la sesión compuesta con `user`

### 2. Contexto actual

- Agregar DTOs del contrato de contexto.
- Agregar source REST/mock para `contexto-actual`.
- Agregar action para obtener contexto autenticado.

### 3. Lectura de sesión

- La lectura de sesión debe partir de cookies con tokens.
- La construcción de `session.user` debe partir del endpoint de contexto.
- No se debe reconstruir usuario desde cookies.
- No se debe reconstruir usuario desde `AUTH_MOCK_USERS`.

### 4. Refresh

- `refresh-session.ts` debe renovar tokens.
- Luego del refresh debe volver a obtener `contexto-actual`.
- Debe reconstruir `session.user` con ese contexto.

### 5. Limpieza legacy

- Sacar `AUTH_MOCK_USERS` del flujo real de auth.
- Mantener mocks solo dentro de `MockAuthSource`.
- Sacar inferencias por email.
- No reintroducir `mode` ni query params para distinguir login admin.

### 6. Consumers

- Migrar consumers de `session.user.role` a `session.user.tipoUsuario`.
- Ajustar:
  - `proxy.ts`
  - guards server-side
  - layout/sidebar/navbar
  - redirects post-login

## Contrato nuevo para obtener el contexto

# Contrato Contexto Actual IAM

El endpoint requiere `Authorization: Bearer <token>` de un usuario autenticado.

Este documento contiene unicamente el contrato vigente para frontend:

- `GET /api/iam/autenticacion/contexto-actual`

## Reglas generales

- La ruta publica cuelga de `/api/iam`.
- Los cuerpos JSON usan `camelCase`.
- El endpoint no recibe body ni query params.
- La respuesta se construye desde los claims del token autenticado.
- `autenticado` debe volver `true` cuando el token es valido.
- `sujeto` representa el identificador del usuario autenticado.
- `tipoUsuario` informa el tipo de usuario que viaja en el token.
- `tipoUsuario` puede ser `"SUPER_ADMINISTRADOR"` o `"ANALISTA_FISCAL"`.
- Si el token falta, expiro o no es valido, el backend responde `401`.

## Cambios internos del modelo

- `tipoUsuario` se toma del claim interno `iam.tipo_usuario`.
- `nombreUsuario` se toma del claim de nombre.
- `correo` se toma del claim de correo.
- `sujeto` se toma del identificador de usuario del token.
- No se expone ningun dato sensible del token, hash, permisos internos ni refresh token.

## Tipos comunes

```ts
type Uuid = string

type RespuestaError = {
  codigo: string
  mensaje: string
  estado: number
}

type TipoUsuario = 'SUPER_ADMINISTRADOR' | 'ANALISTA_FISCAL'

type RespuestaContextoActual = {
  autenticado: boolean
  esquema: string | null
  nombreUsuario: string | null
  correo: string | null
  sujeto: Uuid | string | null
  tipoUsuario: TipoUsuario | null
}
```

## Obtener contexto actual

**Endpoint**

- `GET /api/iam/autenticacion/contexto-actual`

**Headers**

```http
Authorization: Bearer <token>
```

**Query params**

```ts
type SolicitudContextoActual = null
```

Reglas:

- Debe enviarse un token valido en el header `Authorization`.
- El token debe pertenecer a un usuario vigente del sistema.
- El endpoint no exige una policy especifica de rol; solo requiere autenticacion.
- Si el usuario es super administrador, `tipoUsuario` debe volver `"SUPER_ADMINISTRADOR"`.
- Si el usuario es analista fiscal, `tipoUsuario` debe volver `"ANALISTA_FISCAL"`.
- `esquema` refleja el esquema/tipo de autenticacion informado por el runtime.
- El frontend no debe inferir permisos desde `nombreUsuario` o `correo`; debe usar `tipoUsuario`.

**Type**

```ts
type RespuestaObtenerContextoActual = RespuestaContextoActual
```

**Request**

```json
null
```

Ejemplo:

- `GET /api/iam/autenticacion/contexto-actual`

**Response 200 - Super administrador**

```json
{
  "autenticado": true,
  "esquema": "AuthenticationTypes.Federation",
  "nombreUsuario": "superadmin",
  "correo": "superadmin@inteligenciafiscal.local",
  "sujeto": "b9188b53-90df-427d-9b96-77d2cc54197a",
  "tipoUsuario": "SUPER_ADMINISTRADOR"
}
```

**Response 200 - Analista fiscal**

```json
{
  "autenticado": true,
  "esquema": "AuthenticationTypes.Federation",
  "nombreUsuario": "analista",
  "correo": "analista@inteligenciafiscal.local",
  "sujeto": "73f2f98c-496c-44cf-98e7-6fba8614453f",
  "tipoUsuario": "ANALISTA_FISCAL"
}
```

**Response 401**

```json
{
  "codigo": "autenticacion.no_autorizado",
  "mensaje": "La solicitud requiere un token valido o credenciales correctas.",
  "estado": 401
}
```

## Errores transversales

**Type**

```ts
type RespuestaError = {
  codigo: string
  mensaje: string
  estado: number
}
```

Codigos posibles:

| Estado | Codigo                        | Mensaje                                                           |
| ------ | ----------------------------- | ----------------------------------------------------------------- |
| 401    | `autenticacion.no_autorizado` | `La solicitud requiere un token valido o credenciales correctas.` |

## Reglas

- No se debe borrar el contrato existente para login de usuarios.
- Se debe agregar este contrato de contexto a los otros contratos de login y usuario.
- Para usar el contexto del usuario primero se debe obtener un token valido desde login.
