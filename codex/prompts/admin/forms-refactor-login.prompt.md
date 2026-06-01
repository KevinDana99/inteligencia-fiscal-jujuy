## Prompt Forms Refactor - Login

Implementar exclusivamente el refactor del formulario de `login` para alinearlo con `React 19`, `Next 16`, `useActionState` y la arquitectura actual del proyecto.

### Contexto

La spec y la rule de referencia son:

- `codex/specs/admin/forms-refactor.spec.md`
- `codex/constraints/admin/forms-refactor.rule.md`

Este prompt solo cubre el formulario de `login`. No avanzar sobre:

- `create user`
- `edit user`
- `whitelist`

### Objetivo

Migrar el formulario de login al patrón moderno de formularios con:

- `useActionState`
- `useFormStatus` cuando corresponda
- `<form action={formAction}>`

El refactor debe eliminar el manejo manual del ciclo de submit que hoy existe en cliente.

### Reglas obligatorias

1. No modificar el diseño visual del login salvo que sea estrictamente necesario para soportar el nuevo flujo.
2. Mantener la lógica del formulario dentro de la hook correspondiente, respetando la arquitectura actual.
3. No introducir `useMemo` ni `useCallback`.
4. Si el flujo actual del login ya usa `useMemo` o `useCallback`, eliminarlos en este refactor.
5. Toda la validación debe quedar del lado backend.
6. La server action del login debe recibir `FormData`.
7. El state del submit debe salir de `useActionState`.
8. No mantener estado manual en cliente para:
   - `pending`
   - `error`
   - `success`
9. En success, la UI debe navegar a `/`.
10. La resolución final del destino autenticado debe quedar a cargo de `proxy.ts`.

### Estado esperado del login

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
    token: string,
    expiraEn: number,
    refrescarToken: string,
    refrescarTokenExpiraEn: number
  }
}
```

### Comportamiento actual a eliminar

Eliminar del flujo de login actual:

- `startTransition`
- `preventDefault` innecesario
- `isPending` local/manual del submit
- `error` manual del submit
- branching por `tipoUsuario` en cliente

### Criterios de implementación

1. El formulario debe migrarse a `form action={formAction}`.
2. El botón submit debe reflejar pending desde el nuevo flujo.
3. Los errores deben leerse desde el state devuelto por la action.
4. No romper el comportamiento actual de sesión/cookies.
5. No romper el contrato existente del login.

### Validación obligatoria

Después de implementar:

1. Correr:

```bash
npm run build
```

2. Verificar manualmente:
   - loading del submit
   - error de credenciales inválidas
   - submit con campos vacíos según la respuesta real del backend
   - navegación a `/` en success
   - navegación final resuelta por `proxy.ts`

### Restricción de alcance

No tocar otros formularios en esta iteración. El objetivo es dejar **solo login** correctamente refactorizado y validado.
