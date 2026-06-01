## Prompt Forms Refactor - Create User

Implementar exclusivamente el refactor del formulario de `create user` para alinearlo con `React 19`, `Next 16`, `useActionState` y la arquitectura actual del proyecto.

### Contexto

La spec y la rule de referencia son:

- `codex/specs/admin/forms-refactor.spec.md`
- `codex/constraints/admin/forms-refactor.rule.md`

Este prompt solo cubre el formulario de `create user`. No avanzar sobre:

- `edit user`
- `whitelist`

### Objetivo

Migrar el formulario de creación de usuario al patrón moderno de formularios con:

- `useActionState`
- `useFormStatus` cuando corresponda
- `<form action={formAction}>`

El refactor debe eliminar el manejo manual del ciclo de submit que hoy existe en cliente.

### Reglas obligatorias

1. No modificar el diseño visual del modal salvo que sea estrictamente necesario para soportar el nuevo flujo.
2. Mantener la lógica del formulario dentro de la hook correspondiente, respetando la arquitectura actual.
3. No introducir `useMemo` ni `useCallback`.
4. Si el flujo actual del formulario ya usa `useMemo` o `useCallback`, eliminarlos en este refactor.
5. Toda la validación debe quedar del lado backend.
6. La server action de `create user` debe recibir `FormData`.
7. El state del submit debe salir de `useActionState`.
8. No mantener estado manual en cliente para:
   - `pending`
   - `error`
   - `success`
9. En success:
   - debe cerrarse el modal
   - debe actualizarse el listado de usuarios leyendo estado actualizado desde backend
10. No implementar `fieldErrors` estructurados si el backend no los provee.

### Request esperado

```ts
type SolicitudCrearUsuario = {
  nombre: string
  apellido: string
  correo: string
  cargo: string
  contrasena: string
}
```

### Estado esperado de create user

#### initialState

```ts
{
  success: null,
  message: null,
  errors: null,
  data: null
}
```

#### error

```ts
{
  success: false,
  message: string,
  errors: {
    code: string,
    message: string,
    statusCode: number
  },
  data: null
}
```

#### success

```ts
{
  success: true,
  message: string | null,
  errors: null,
  data: {
    usuarioId: string,
    nombre: string,
    apellido: string,
    correo: string,
    cargo: string,
    activo: boolean,
    esSuperAdministrador: boolean
  }
}
```

### Contrato backend actual de error

#### Response 400

```json
{
  "codigo": "super_administrador.usuarios.crear.solicitud_invalida",
  "mensaje": "El correo debe tener un formato valido.",
  "estado": 400
}
```

#### Response 409

```json
{
  "codigo": "super_administrador.usuarios.crear.correo_duplicado",
  "mensaje": "Ya existe un usuario con el correo informado.",
  "estado": 409
}
```

La action debe adaptar ese error global del backend al state del formulario usando:

- `message`
- `errors.code`
- `errors.message`
- `errors.statusCode`

### Comportamiento actual a eliminar

Eliminar del flujo actual de `create user`:

- validación local de negocio como fuente de verdad
- `pending` manual del submit
- `error` manual del submit
- submit imperativo llamando la action desde cliente

### Criterios de implementación

1. El formulario debe migrarse a `form action={formAction}`.
2. El botón submit debe reflejar pending desde el nuevo flujo.
3. Los errores deben leerse desde el state devuelto por la action.
4. No romper el contrato existente de creación de usuario.
5. El modal solo debe cerrarse en success.
6. El listado debe actualizarse leyendo backend luego del success.

### Validación obligatoria

Después de implementar:

1. Correr:

```bash
npm run build
```

2. Verificar manualmente:
   - loading del submit
   - error de solicitud inválida
   - error de correo duplicado
   - cierre correcto del modal
   - actualización correcta del listado

### Restricción de alcance

No tocar otros formularios en esta iteración. El objetivo es dejar **solo create user** correctamente refactorizado y validado.
