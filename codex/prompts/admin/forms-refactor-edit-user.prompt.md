## Prompt Forms Refactor - Edit User

Implementar exclusivamente el refactor del formulario de `edit user` para alinearlo con `React 19`, `Next 16`, `useActionState` y la arquitectura actual del proyecto.

### Contexto

La spec y la rule de referencia son:

- `codex/specs/admin/forms-refactor.spec.md`
- `codex/constraints/admin/forms-refactor.rule.md`

Este prompt solo cubre el formulario de `edit user`. No avanzar sobre:

- `create user`
- `whitelist`

### Objetivo

Migrar el formulario de edición de usuario al patrón moderno de formularios con:

- `useActionState`
- `useFormStatus` cuando corresponda
- `<form action={formAction}>`

El refactor debe eliminar el manejo manual del ciclo de submit que hoy existe en cliente.

### Reglas obligatorias

1. No modificar el diseño visual del modal salvo que sea estrictamente necesario para soportar el nuevo flujo.
2. Mantener la lógica del formulario dentro de la hook correspondiente, respetando la arquitectura actual.
3. No introducir `useMemo` ni `useCallback`.
4. Si el flujo actual del formulario ya usa `useMemo` o `useCallback`, eliminarlos en este refactor.
5. Toda la validación de negocio debe quedar del lado backend.
6. La server action de `edit user` debe recibir `FormData`.
7. El state del submit debe salir de `useActionState`.
8. No mantener estado manual en cliente para:
   - `pending`
   - `error`
   - `success`
9. En success:
   - debe cerrarse el modal
   - debe actualizarse el listado de usuarios leyendo estado actualizado desde backend
10. No implementar `fieldErrors` estructurados si el backend no los provee.
11. Para esta iteración se asume que `cargo` sigue siendo obligatorio en el formulario.

### Request esperado

```ts
type SolicitudEditarUsuario = {
  nombre: string
  apellido: string
  correo: string
  cargo: string
  nuevaContrasena?: string | null
  confirmarContrasena?: string | null
}
```

### Estado esperado de edit user

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
  data: null
}
```

### Contrato backend actual de success

```text
Response 204
Sin cuerpo.
```

### Adaptación esperada de errores

La action debe adaptar el error global del backend al state del formulario usando:

- `message`
- `errors.code`
- `errors.message`
- `errors.statusCode`

### Comportamiento actual a eliminar

Eliminar del flujo actual de `edit user`:

- validación local de negocio como fuente de verdad
- `pending` manual del submit
- `error` manual del submit
- `success` manual del submit
- submit imperativo llamando la action desde cliente

### Criterios de implementación

1. El formulario debe migrarse a `form action={formAction}`.
2. El botón submit debe reflejar pending desde el nuevo flujo.
3. Los errores deben leerse desde el state devuelto por la action.
4. No romper el contrato existente de edición de usuario.
5. El modal solo debe cerrarse en success.
6. El listado debe actualizarse leyendo backend luego del success.
7. No asumir payload de éxito en `data`, ya que el contrato responde `204` sin cuerpo.

### Validación obligatoria

Después de implementar:

1. Correr:

```bash
npm run build
```

2. Verificar manualmente:
   - loading del submit
   - edición sin cambio de contraseña
   - edición con cambio de contraseña
   - error de solicitud inválida
   - cierre correcto del modal
   - actualización correcta del listado

### Restricción de alcance

No tocar otros formularios en esta iteración. El objetivo es dejar **solo edit user** correctamente refactorizado y validado.
