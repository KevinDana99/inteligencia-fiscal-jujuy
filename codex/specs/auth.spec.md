# Auth Spec

## Objetivo

Implementar autenticación para la aplicación integrada con los endpoints IAM provistos por backend.

La feature debe permitir:

- iniciar sesión con `correo` y `contrasena`
- mantener el estado autenticado en cookies
- proteger rutas privadas
- renovar sesión cuando corresponda
- cerrar sesión correctamente
- contemplar un rol especial de `admin`

## Alcance

Este spec cubre:

- login
- logout
- persistencia de sesión en cookies
- validación de acceso a rutas privadas
- validación de acceso a rutas especiales por rol
- renovación de sesión con `refrescarToken`
- resolución del usuario autenticado

## Fuera de Alcance

Este spec no incluye en esta primera iteración:

- registro de usuario
- recuperación de contraseña
- cambio de contraseña
- autenticación social
- MFA
- panel funcional completo de administración de usuarios para `admin`

## Requerimientos

1. Las rutas privadas solo deben ser accesibles si existe una sesión válida.
2. Si no existe una sesión válida, el usuario debe ser redirigido al login.
3. La autenticación debe integrarse con el contrato IAM definido en este documento.
4. La sesión debe poder renovarse usando `refrescarToken`.
5. El cierre de sesión debe invalidar la sesión activa local y remota si el backend lo requiere.
6. Debe existir un rol `admin` con acceso a todas las rutas privadas.
7. Debe existir una ruta especial exclusiva para `admin` destinada a futura configuración de usuarios.

## Rutas

### Ruta pública

- `app/(auth)/login`

### Rutas privadas

Toda ruta o grupo de rutas definido como privado por la aplicación debe requerir sesión válida.

### Ruta especial de administración

- `app/(private)/admin`

## Reglas Funcionales

### Login

- Un usuario no autenticado debe poder acceder a `app/(auth)/login`.
- Un login exitoso debe crear una sesión persistida en cookies.
- Un login fallido no debe crear sesión.
- Si las credenciales son inválidas, la UI debe informar un error funcional claro.
- Si ocurre un error técnico inesperado durante login, la UI debe informar un error genérico sin exponer detalles internos.

### Acceso a rutas privadas

- Si el usuario tiene una sesión válida, puede acceder a rutas privadas.
- Si el usuario no tiene una sesión válida, no debe acceder a rutas privadas.
- El acceso inválido debe redirigir a `app/(auth)/login`.

### Acceso especial de admin

- Debe existir un rol `admin`.
- El rol `admin` debe poder acceder a todas las rutas privadas.
- El rol `admin` debe ser el único rol con permiso para entrar a `app/(private)/admin`.
- Otros usuarios autenticados no deben poder entrar a la ruta especial de `app/(private)/admin`.
- La ruta especial puede existir como placeholder sin construir todavía el panel funcional.

### Mock de desarrollo

- El entorno mock debe contemplar al menos dos usuarios:
  - un usuario normal
  - un usuario con rol `admin`
- El usuario normal no debe poder acceder a `app/(private)/admin`.
- El usuario `admin` sí debe poder acceder a `app/(private)/admin`.

### Usuario ya autenticado en login

- Si un usuario ya tiene una sesión válida e intenta entrar a `app/(auth)/login`, la aplicación no debe tratar el login como destino principal.
- El comportamiento esperado es redirigirlo al área privada principal o equivalente.

### Renovación de sesión

- Si existe un `refrescarToken` válido, la aplicación debe poder renovar la sesión.
- Una renovación exitosa debe actualizar cookies y reemplazar los tokens anteriores.
- Si la renovación falla, la sesión se debe considerar inválida.

### Logout

- El logout debe eliminar la sesión local.
- El logout debe usar el endpoint remoto de cierre de sesión si corresponde.
- Después del logout, el usuario no debe poder seguir accediendo a rutas privadas sin autenticarse otra vez.

## Estados de Autenticación

La aplicación debe contemplar estos estados funcionales base:

- `authenticated`
- `unauthenticated`

### Definición de estados

`authenticated`

- existe una sesión válida y el usuario puede acceder a rutas privadas

`unauthenticated`

- no existe una sesión válida
- la sesión expiró
- el usuario todavía no inició sesión
- la sesión no pudo renovarse

## Validación de Entrada

El flujo de login debe validar como mínimo:

- `correo` requerido
- `contrasena` requerida

Durante el envío del formulario:

- no se deben permitir envíos duplicados mientras el proceso esté pendiente

## Errores Funcionales

La feature debe contemplar al menos estos escenarios:

- credenciales inválidas
- sesión inexistente
- sesión expirada
- error técnico al iniciar sesión
- error técnico al renovar sesión
- error técnico al cerrar sesión
- acceso no autorizado a la ruta especial de administración

El comportamiento esperado es:

- mostrar mensajes seguros para el usuario
- no exponer tokens, payloads internos ni detalles técnicos sensibles
- mantener el acceso privado bloqueado cuando la sesión no sea válida

## Comportamientos Esperados

### Caso 1. Login exitoso

Dado un usuario no autenticado en `app/(auth)/login`

Cuando envía credenciales válidas

Entonces:

- se debe llamar al endpoint de inicio de sesión
- se deben guardar los tokens en cookies
- la aplicación debe reconocer al usuario como autenticado
- el usuario debe ser redirigido al área privada

### Caso 2. Login inválido

Dado un usuario no autenticado en `app/(auth)/login`

Cuando envía credenciales inválidas

Entonces:

- no se debe crear sesión
- no se deben persistir cookies de autenticación válidas
- la UI debe mostrar un mensaje de error funcional

### Caso 2.1. Login con error técnico

Dado un usuario no autenticado en `app/(auth)/login`

Cuando el backend o la red fallan durante el inicio de sesión

Entonces:

- no se debe crear sesión
- la UI debe mostrar un mensaje de error técnico genérico
- no se deben exponer detalles internos del backend

### Caso 3. Acceso anónimo a ruta privada

Dado un usuario sin sesión válida

Cuando intenta acceder a una ruta privada

Entonces:

- el contenido privado no debe renderizarse
- el usuario debe ser redirigido al login

### Caso 4. Sesión expirada con refresh válido

Dado un usuario con sesión expirada y `refrescarToken` válido

Cuando la aplicación intenta renovar sesión

Entonces:

- se debe llamar al endpoint de renovación
- si la respuesta es exitosa, se deben actualizar cookies
- el usuario debe mantener acceso a la zona privada

### Caso 5. Sesión expirada sin refresh válido

Dado un usuario con sesión inválida y sin posibilidad de renovación

Cuando intenta acceder a una ruta privada

Entonces:

- la sesión se debe considerar terminada
- se deben limpiar cookies de autenticación
- el usuario debe ser redirigido a `app/(auth)/login`

### Caso 6. Logout exitoso

Dado un usuario autenticado

Cuando ejecuta logout

Entonces:

- se debe llamar al endpoint de cierre de sesión usando el `refrescarToken` si aplica
- se deben eliminar las cookies de sesión
- el usuario debe perder acceso a rutas privadas

### Caso 7. Usuario autenticado entrando a `app/(auth)/login`

Dado un usuario con sesión válida

Cuando intenta navegar a `app/(auth)/login`

Entonces:

- la app no debe presentarle el login como flujo principal
- el usuario debe ser redirigido al área privada principal o equivalente

### Caso 8. Acceso de admin a ruta especial

Dado un usuario autenticado con rol `admin`

Cuando intenta navegar a `app/(private)/admin`

Entonces:

- debe poder acceder a la ruta
- la ruta puede mostrar un placeholder mientras el panel no exista

### Caso 9. Acceso no autorizado a ruta especial

Dado un usuario autenticado sin rol `admin`

Cuando intenta navegar a `app/(private)/admin`

Entonces:

- no debe poder acceder a la ruta especial
- la aplicación debe redirigirlo a `app/(auth)/login`
- la sesión no debe invalidarse por ese motivo
- la URL de login no debe exponer parámetros técnicos de redirección o rol
- la intención de acceso a `admin` puede resolverse internamente por mecanismos server-side

### Caso 10. Usuario normal en mock

Dado un usuario autenticado normal en entorno mock

Cuando navega por rutas privadas comunes

Entonces:

- debe poder acceder a ellas
- no debe poder acceder a `app/(private)/admin`

## Contratos IAM

### Inicio de sesión

**Endpoint**

- `POST /api/iam/autenticacion/inicio-sesion`

**Type**

```ts
type SolicitudInicioSesion = {
  correo: string
  contrasena: string
}
```

**Request**

```json
{
  "correo": "admin@plantilla.local",
  "contrasena": "ChangeMe123!"
}
```

**Response 200**

```ts
type RespuestaInicioSesion = {
  token: string
  expiraEn: number
  refrescarToken: string
  refrescarTokenExpiraEn: number
  usuario: {
    nombreUsuario: string
    correo: string
  }
}
```

```json
{
  "token": "jwt-access-token",
  "expiraEn": 300,
  "refrescarToken": "token-de-renovacion",
  "refrescarTokenExpiraEn": 604800,
  "usuario": {
    "nombreUsuario": "admin",
    "correo": "admin@plantilla.local"
  }
}
```

### Renovar sesión

**Endpoint**

- `POST /api/iam/autenticacion/renovar-sesion`

**Type**

```ts
type SolicitudRenovarSesion = {
  refrescarToken: string
}
```

**Request**

```json
{
  "refrescarToken": "token-de-renovacion"
}
```

**Response 200**

```ts
type RespuestaRenovarSesion = {
  token: string
  expiraEn: number
  refrescarToken: string
  refrescarTokenExpiraEn: number
  usuario: {
    nombreUsuario: string
    correo: string
  }
}
```

```json
{
  "token": "jwt-access-token-nuevo",
  "expiraEn": 300,
  "refrescarToken": "token-de-renovacion-nuevo",
  "refrescarTokenExpiraEn": 604800,
  "usuario": {
    "nombreUsuario": "admin",
    "correo": "admin@plantilla.local"
  }
}
```

### Cerrar sesión

**Endpoint**

- `POST /api/iam/autenticacion/cerrar-sesion`

**Type**

```ts
type SolicitudCerrarSesion = {
  refrescarToken: string
}

type RespuestaCerrarSesion = null
```

**Request**

```json
{
  "refrescarToken": "token-de-renovacion"
}
```

**Response 204**

```json
null
```

## Contrato Funcional de Sesión

La aplicación debe poder resolver como mínimo esta información de sesión:

```ts
type AuthSession = {
  token: string
  expiraEn: number
  refrescarToken: string
  refrescarTokenExpiraEn: number
  usuario: {
    nombreUsuario: string
    correo: string
  }
}
```

## Criterios de Aceptación

- Un usuario anónimo puede acceder a `app/(auth)/login`.
- Un login exitoso crea cookies válidas de autenticación.
- Un login inválido no crea sesión.
- Un error técnico en login no crea sesión y muestra un error seguro.
- Un usuario autenticado puede entrar a rutas privadas.
- Un usuario no autenticado es redirigido a `app/(auth)/login` por `proxy.ts`.
- Un usuario autenticado que entra a `app/(auth)/login` es redirigido al área privada.
- La sesión puede renovarse con `refrescarToken` cuando corresponda.
- El logout elimina la sesión y corta el acceso a contenido privado.
- Si la sesión no puede renovarse, la app trata al usuario como no autenticado.
- Un usuario con rol `admin` puede entrar a `app/(private)/admin`.
- Un usuario autenticado sin rol `admin` no puede entrar a `app/(private)/admin`.
- Un usuario autenticado sin rol `admin` que intenta entrar a `app/(private)/admin` es redirigido a `app/(auth)/login` sin perder sesión.
- La redirección a `app/(auth)/login` para elevar acceso a `admin` no expone parámetros de intención en la URL.
- El entorno mock ofrece al menos un usuario normal y un `admin`.

## Notas

- Este documento define el comportamiento funcional y los contratos de la feature.
- Las restricciones de implementación viven en `codex/constraints/auth.rule.md`.
- La estrategia técnica y el orden de implementación deben vivir en `codex/prompts/auth.prompt.md`.
