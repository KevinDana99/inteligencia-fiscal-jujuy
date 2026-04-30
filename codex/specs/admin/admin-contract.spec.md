## Admin Contract Spec

1. Debemos implementar estos contratos de la misma forma que se implementaron los de auth.
2. Debemos seguir la arquitectura de la skill en la parte de mock de contrato al pie de la letra integrando el nuevo contrato para el panel admin.
3. Tenemos que evitar romper las funcionalidades que ya estar implementadas en el panel de admin.
4. En el lado del servidor necesitamos registrar entrada y salida de los datos para verificar que el contrato este correctamente implementado, esto debe ser un log.
5. Implementar el siguiente contrato:
6. Todas las operaciones de crear, editar y eliminar usuario son desencadenadas desde los modales ya definidos en la UI del admin panel.
7. El cambio de contraseña no tiene modal independiente: se resuelve dentro del modal de edicion y viaja en el mismo `PATCH`.

# Contratos Super Administrador

Todos los endpoints requieren `Authorization: Bearer <token>` de un usuario Super Administrador.

El backend lista todos los usuarios; la busqueda y el filtrado visual quedan del lado del frontend.

## Listar usuarios

**Endpoint**

- `GET /api/super-administrador/usuarios`

**Type**

```ts
type Uuid = string

type UsuarioPanelSuperAdministrador = {
  usuarioId: Uuid
  nombre: string
  apellido: string
  correo: string
  cargo: string
  activo: boolean
  esSuperAdministrador: boolean
}

type RespuestaListarUsuarios = {
  resumen: {
    cantidadUsuariosActivos: number
  }
  usuarios: UsuarioPanelSuperAdministrador[]
}
```

**Request**

```json
null
```

**Response 200**

```json
{
  "resumen": {
    "cantidadUsuariosActivos": 2
  },
  "usuarios": [
    {
      "usuarioId": "019dbb8f-e390-724b-aaee-e13b1c356532",
      "nombre": "Carlos",
      "apellido": "Lopez",
      "correo": "carlos.lopez@inteligenciafiscal.local",
      "cargo": "Contador",
      "activo": true,
      "esSuperAdministrador": false
    }
  ]
}
```

## Consultar usuario

**Endpoint**

- `GET /api/super-administrador/usuarios/{usuarioId}`

**Type**

```ts
type Uuid = string

type RespuestaConsultarUsuario = {
  usuarioId: Uuid
  nombre: string
  apellido: string
  correo: string
  cargo: string
  activo: boolean
  esSuperAdministrador: boolean
}
```

**Request**

```json
null
```

**Response 200**

```json
{
  "usuarioId": "019dbb8f-e390-724b-aaee-e13b1c356532",
  "nombre": "Carlos",
  "apellido": "Lopez",
  "correo": "carlos.lopez@inteligenciafiscal.local",
  "cargo": "Contador",
  "activo": true,
  "esSuperAdministrador": false
}
```

**Response 404**

```ts
type RespuestaError = {
  codigo: string
  mensaje: string
  estado: number
}
```

```json
{
  "codigo": "super_administrador.usuarios.consultar.no_encontrado",
  "mensaje": "No se encontro el usuario indicado.",
  "estado": 404
}
```

## Crear usuario

**Endpoint**

- `POST /api/super-administrador/usuarios`

**Type**

```ts
type SolicitudCrearUsuario = {
  nombre: string
  apellido: string
  correo: string
  cargo: string
  contrasena: string
}

type RespuestaCrearUsuario = {
  usuarioId: string
  nombre: string
  apellido: string
  correo: string
  cargo: string
  activo: boolean
  esSuperAdministrador: boolean
}
```

**Request**

```json
{
  "nombre": "Carlos",
  "apellido": "Lopez",
  "correo": "carlos.lopez@inteligenciafiscal.local",
  "cargo": "Contador",
  "contrasena": "Clave123"
}
```

**Response 201**

```json
{
  "usuarioId": "019dbb8f-e390-724b-aaee-e13b1c356532",
  "nombre": "Carlos",
  "apellido": "Lopez",
  "correo": "carlos.lopez@inteligenciafiscal.local",
  "cargo": "Contador",
  "activo": true,
  "esSuperAdministrador": false
}
```

**Response 400**

```json
{
  "codigo": "super_administrador.usuarios.crear.solicitud_invalida",
  "mensaje": "El correo debe tener un formato valido.",
  "estado": 400
}
```

**Response 409**

```json
{
  "codigo": "super_administrador.usuarios.crear.correo_duplicado",
  "mensaje": "Ya existe un usuario con el correo informado.",
  "estado": 409
}
```

## Editar usuario

**Endpoint**

- `PATCH /api/super-administrador/usuarios/{usuarioId}`

**Type**

```ts
type SolicitudEditarUsuario = {
  nombre: string
  apellido: string
  correo: string
  cargo: string
  nuevaContrasena?: string | null
  confirmarContrasena?: string | null
}

type RespuestaEditarUsuario = null
```

**Request**

```json
{
  "nombre": "Carlos",
  "apellido": "Actualizado",
  "correo": "carlos.lopez@inteligenciafiscal.local",
  "cargo": "Analista",
  "nuevaContrasena": null,
  "confirmarContrasena": null
}
```

Para cambiar la contrasena desde el mismo endpoint:

```json
{
  "nombre": "Carlos",
  "apellido": "Actualizado",
  "correo": "carlos.lopez@inteligenciafiscal.local",
  "cargo": "Analista",
  "nuevaContrasena": "NuevaClave123",
  "confirmarContrasena": "NuevaClave123"
}
```

**Response 204**

```json
null
```

**Response 400**

```json
{
  "codigo": "super_administrador.usuarios.editar.solicitud_invalida",
  "mensaje": "La confirmacion de la contrasena no coincide.",
  "estado": 400
}
```

**Response 404**

```json
{
  "codigo": "super_administrador.usuarios.editar.no_encontrado",
  "mensaje": "No se encontro el usuario indicado.",
  "estado": 404
}
```

**Response 409**

```json
{
  "codigo": "super_administrador.usuarios.editar.operacion_no_permitida",
  "mensaje": "No esta permitido editar una cuenta Super Administrador.",
  "estado": 409
}
```

## Eliminar usuario

**Endpoint**

- `DELETE /api/super-administrador/usuarios/{usuarioId}`

**Type**

```ts
type RespuestaEliminarUsuario = null
```

**Request**

```json
null
```

**Response 204**

```json
null
```

**Response 404**

```json
{
  "codigo": "super_administrador.usuarios.eliminar.no_encontrado",
  "mensaje": "No se encontro el usuario indicado.",
  "estado": 404
}
```

**Response 409**

```json
{
  "codigo": "super_administrador.usuarios.eliminar.operacion_no_permitida",
  "mensaje": "No esta permitido eliminar una cuenta Super Administrador.",
  "estado": 409
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

**Response 401**

```json
{
  "codigo": "autenticacion.no_autorizado",
  "mensaje": "La solicitud requiere un token valido o credenciales correctas.",
  "estado": 401
}
```

**Response 403**

```json
{
  "codigo": "autorizacion.prohibido",
  "mensaje": "El usuario autenticado no tiene permisos suficientes para acceder a este recurso.",
  "estado": 403
}
```

8. El contrato es correcto. La estructura del contrato esta perfecta, los types deben ser en ingles manteniendo sus nombres, aunque esto no debe afectar al json, el json debe ser tal cual como esta
   en el contrato. Se tiene que usar el objeto en español tal cual esta escrito para que no sea incompatible con el backend.
