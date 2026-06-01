## Rule Forms Refactor

## Alcance

- Esta rule aplica solo al refactor de formularios con inputs incluido en `codex/specs/admin/forms-refactor.spec.md`.
- El alcance actual es:
  - `login`
  - `create user`
  - `edit user`
  - `whitelist`
- No se debe aplicar este refactor a acciones simples sin inputs.

## Reglas obligatorias

1. Se debe usar `useActionState` en todos los formularios con submit real incluidos en el alcance.
2. `useFormStatus` debe usarse en botones submit o subcomponentes internos del formulario cuando sea necesario leer el estado `pending` desde el contexto del form.
3. Tanto `useActionState` como la lógica asociada al flujo del formulario deben mantenerse dentro de la hook del componente en cuestión.
4. La lógica del formulario no debe moverse al componente visual salvo que sea estrictamente render-related.
5. No se deben introducir `useMemo` ni `useCallback` en el refactor de estos formularios.
6. Si alguno de los formularios incluidos en el alcance ya usa `useMemo` o `useCallback` para manejar lógica funcional, ese uso debe eliminarse como parte del refactor.
7. Solo se permite conservar o incorporar `useMemo` o `useCallback` en casos excepcionales, y ese uso debe justificarse explícitamente antes de implementarse.
8. No se debe mantener en paralelo estado manual de submit si el formulario ya usa `useActionState`.

## Validación y estado

1. Toda la validación debe ser realizada por el backend.
2. El frontend no debe definir reglas de validación de negocio como fuente de verdad.
3. Las server actions deben leer la respuesta del backend y devolver el state correspondiente al formulario.
4. La UI debe actuar en consecuencia a partir del state devuelto por la action.
5. En esta instancia del refactor debe eliminarse todo estado local manual relacionado al ciclo del formulario:
   - `pending` del submit
   - `error` del submit
   - `success` del submit
6. Pueden mantenerse estados locales de UI que no formen parte del ciclo del submit del formulario.

## Contracto del state

El state general esperado por los formularios refactorizados debe respetar este shape:

```ts
{
  success: boolean | null
  message: string | null
  errors: {
    code: string
    message: string
    statusCode: number
  } | null
  data: unknown | null
}
```

Notas:
- `success: null` representa estado inicial.
- `errors` solo debe contener el error adaptado desde backend.
- `data` debe tiparse con el contrato real del formulario cuando corresponda.
- No se debe implementar `any` como shape final.

## Reglas de integración

1. Las server actions de los formularios incluidos deben recibir `FormData`.
2. La extracción, normalización y validación del payload debe ocurrir dentro de la action.
3. No se debe mantener submit imperativo en cliente armando el payload manualmente para estos formularios.

## Regla de iteración

1. No se debe migrar más de un formulario por iteración.
2. No se debe mezclar refactor visual con refactor de `useActionState`.
3. Después de cada refactor individual debe correr `npm run build`.
4. No se debe avanzar al siguiente formulario sin validación manual E2E posterior al build.

## Login

### Reglas específicas

1. El formulario de login debe migrarse a `<form action={formAction}>`.
2. El login no debe seguir usando:
   - `startTransition`
   - `preventDefault` innecesario
   - `isPending` local/manual del submit
   - `error` manual del submit
   - branching por `tipoUsuario` en cliente
3. En success, la UI debe navegar a `/`.
4. `proxy.ts` debe resolver el destino final del usuario autenticado.

### State esperado

```ts
// initialState
{
  success: null,
  message: null,
  errors: null,
  data: null
}
```

```ts
// error
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

```ts
// success
{
  success: true,
  message: string | null,
  errors: null,
  data: {
    token: string,
    expiraEn: number,
    refrescarToken: string,
    refrescarTokenExpiraEn: number
  }
}
```

## Create User

### Reglas específicas

1. El formulario de `create user` debe migrarse a `<form action={formAction}>`.
2. `create user` no debe seguir usando:
   - validación local de negocio
   - `pending` manual del submit
   - `error` manual del submit
   - submit imperativo llamando la action desde cliente
3. En success:
   - debe cerrarse el modal
   - debe actualizarse el listado de usuarios leyendo estado actualizado desde backend
4. El backend devuelve un error global tipado.
5. No se deben implementar `fieldErrors` estructurados para este formulario si el backend no los provee.

### Request esperado

La action debe recibir `FormData` con estos campos:

```ts
type SolicitudCrearUsuario = {
  nombre: string
  apellido: string
  correo: string
  cargo: string
  contrasena: string
}
```

### State esperado

```ts
// initialState
{
  success: null,
  message: null,
  errors: null,
  data: null
}
```

```ts
// error
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

```ts
// success
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

```json
{
  "codigo": "super_administrador.usuarios.crear.solicitud_invalida",
  "mensaje": "El correo debe tener un formato valido.",
  "estado": 400
}
```

```json
{
  "codigo": "super_administrador.usuarios.crear.correo_duplicado",
  "mensaje": "Ya existe un usuario con el correo informado.",
  "estado": 409
}
```

## Edit User

### Reglas específicas

1. El formulario de `edit user` debe migrarse a `<form action={formAction}>`.
2. `edit user` no debe seguir usando:
   - validación local de negocio como fuente de verdad
   - `pending` manual del submit
   - `error` manual del submit
   - `success` manual del submit
   - submit imperativo llamando la action desde cliente
3. En success:
   - debe cerrarse el modal
   - debe actualizarse el listado de usuarios leyendo estado actualizado desde backend
4. El backend devuelve un error global tipado.
5. No se deben implementar `fieldErrors` estructurados para este formulario si el backend no los provee.
6. Para esta iteración se asume que `cargo` sigue siendo obligatorio en el formulario.

### Request esperado

La action debe recibir `FormData` con estos campos:

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

### State esperado

```ts
// initialState
{
  success: null,
  message: null,
  errors: null,
  data: null
}
```

```ts
// error
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

```ts
// success
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

## Criterio de cierre

La migración de un formulario se considera correcta cuando:

1. No queda `startTransition` para el submit de ese formulario.
2. No queda `preventDefault` innecesario en ese formulario.
3. `pending`, `error` y `success` salen del flujo de `useActionState`.
4. El comportamiento funcional previo se mantiene.
5. `npm run build` pasa.
6. La validación manual E2E del formulario refactorizado queda aprobada antes de pasar al siguiente.
