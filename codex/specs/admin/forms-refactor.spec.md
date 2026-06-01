## Spec Forms Refactor

## Descripcion

- Se informo que hay componentes de formularios que actualmente estan usando estados divididos o varios estados diferentes para manejar los inputs del formulario lo cual eso no esta alineado con los nuevos estandares de Next 16 y React 19.

## Requsitos

1. Los componentes con formularios cambiaran la estructura de estados de la hook en la cual este implementada la funcionalidad que maneja los estados de cada formulario descripto.
2. Se requiere usar `useActionState` en todos los formularios con submit real incluidos en el alcance de esta spec.
3. `useFormStatus` debe usarse en botones submit o subcomponentes internos del formulario cuando sea necesario leer el estado `pending` desde el contexto del form.
4. Tanto `useActionState` como la lógica asociada al flujo del formulario deben mantenerse dentro de la hook del componente en cuestión, respetando la arquitectura actual del proyecto.
5. La funcionalidad no debe moverse al componente visual salvo que sea estrictamente render-related; la lógica debe seguir viviendo en hooks existentes o en hooks nuevos creados para ese formulario.
6. Se requiere usar las ultimas implementaciones de `React 19`. Como el proyecto usa `React Compiler`, no se deben introducir `useMemo` ni `useCallback` en el refactor de estos formularios.
7. Si alguno de los formularios incluidos en el alcance ya usa `useMemo` o `useCallback` para manejar su lógica funcional, ese uso debe refactorizarse y eliminarse como parte de esta migración.
8. Solo se permite conservar o incorporar estas APIs en casos excepcionales, y ese uso debe justificarse explícitamente antes de implementarse.
9. La implementación debe apoyarse en la optimización automática provista por `React 19` y mantener la lógica simple y directa.
4. En caso de necesitar manejar la cache se debe hacer uso de los `Cache Components`, ya que estan habilitados en el proyecto para esto.
5. Se debe poder manejar estados de `error`, `pending`,`success`.
6. Actualmente se usan server actions para comunicarnos con el backend tanto mock como en contrato produccion. Por ende debemos seguir ese estandar.

## Reglas de migración

- no migrar más de un formulario por iteración
- no mezclar refactor visual con refactor de action state
- no mantener en paralelo dos fuentes de verdad para pending o error
- si un formulario usa useActionState, el estado de submit debe salir de ahí
- toda la validación debe ser realizada por el backend
- el frontend no debe definir reglas de validación de negocio como fuente de verdad
- las server actions deben leer la respuesta del backend y devolver el state correspondiente al formulario
- la UI debe actuar en consecuencia a partir del state devuelto por la action
- en esta instancia del refactor debe dejar de existir todo estado local manual relacionado al ciclo del formulario:
  - pending del submit
  - error del submit
  - success del submit
- ese estado debe pasar a resolverse exclusivamente desde useActionState
- pueden mantenerse estados locales de UI que no formen parte del ciclo del submit del formulario

## Estructura del estado en formularios

{
success: boolean | null, // Para saber si fue éxito, error o estado inicial
message: string | null, // El mensaje principal para el usuario
errors?: { // Solo se devuelve en caso de que success sea `false`,
},
data?: (Con el tipo de dato que corresponde segun el contrato) | null // Opcional: datos que quieras devolver (ej. ID del objeto creado)
}

### Estado inicial de todos los formularios

{
success: null,
message: null,
errors: null,
data: null
}

### Estado respuesta de todos los formularios

## Error:

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

## Success:

{
success: true,
message: string | null,
errors: null,
data?: (Con el tipo de dato que corresponde segun el contrato)
}

## Estado de formulario de login

## InitialState:

{
success: null,
message: null,
errors: null,
data: null
}

## Error:

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

## Success:

{
success: true,
message: string | null,
errors: null,
data: {
"token": string,
"expiraEn": number,
"refrescarToken": string,
"refrescarTokenExpiraEn": number,
}
}

## Alcance

1. Se debe implementar estos estandares de manejo de estado en los formularios actuales de la aplicacion. Actualmente son los formularios - login
   `create user`, `edit user`, `whitelist`.
2. No se debe implementar refactor en otros componentes que no tengan que ver con los formularios solicitados. Por ahora nos enfocaremos solo en estos.

## Definiciones pendientes por formulario

Para cada formulario cerrar:

- initialState
- shape exacto del state devuelto por la action
- la action recibe `FormData`
- si el success cierra modal o redirige
- si hay redirectTo
- si hay revalidateTag o router.refresh

———

## Checklist por formulario

- [ ] action compatible con useActionState
- [ ] initialState definido
- [ ] submit migrado a form action={formAction}
- [ ] pending manual eliminado
- [ ] errores renderizados desde state
- [ ] success flow validado
- [ ] tests / smoke manual actualizado

———

## Criterio de cierre

La migración se considera correcta cuando:

- no queda startTransition para submits de formularios incluidos en alcance
- no queda preventDefault innecesario en esos formularios
- pending, error y success salen del flujo de useActionState
- el comportamiento funcional previo se mantiene

---

## Implementacion Incremental por formulario

1. Login

#### Estado actual

- submit manual
- preventDefault
- startTransition
- isPending local
- llamado imperativo a signInAction

#### Objetivo

- migrarlo a <form action={formAction}>
- mover errores y pending a useActionState
- en success la UI navega a `/`
- proxy.ts resuelve el destino final del usuario autenticado
- eliminar startTransition
- eliminar preventDefault innecesario
- eliminar isPending local/manual del submit
- eliminar error manual del submit
- eliminar branching por tipoUsuario en cliente

#### Validar

- loading
- error de credenciales
- validación de vacíos
- navegación a `/` en success
- resolución final del destino por proxy.ts

---

2. Crear usuario

#### Estado actual

- modal con inputs
- validación local
- pending manual
- llamada imperativa a createAdminUserAction

#### Objetivo

- migrar el submit a useActionState
- definir errores por campo y error global desde la action
- mantener cierre del modal solo en success

#### Validar

- campos obligatorios
- formato de email
- dominio permitido
- password mínima
- loading
- cierre correcto

---

3. Editar usuario

#### Estado actual

- mismo patrón que create
- submit imperativo
- pending manual

#### Objetivo

- replicar patrón del create
- conservar comportamiento de edición parcial
- mantener cierre solo en success

#### Validar

- mismos campos que create
- password opcional cuando corresponda
- error global
- actualización visual del usuario editado

---

4. Whitelist / dominios permitidos

#### Estado actual

- revisar implementación real antes de tocar
- identificar create/edit si existen

#### Objetivo

- aplicar useActionState a los formularios con input
- no tocar acciones sin formulario

#### Validar

- formato del dominio
- duplicados
- errores visibles
- loading
- actualización del listado
