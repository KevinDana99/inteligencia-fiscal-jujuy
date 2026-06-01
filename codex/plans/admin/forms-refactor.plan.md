## Orden de implementación

### 1. Login

#### Estado actual

- submit manual
- preventDefault
- startTransition
- isPending local
- llamado imperativo a signInAction

#### Objetivo

- migrarlo a <form action={formAction}>
- mover errores y pending a useActionState
- mantener redirect actual post-login

#### Validar

- loading
- error de credenciales
- validación de vacíos
- redirect por tipo de usuario

———

### 2. Crear usuario

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

———

### 3. Editar usuario

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

———

### 4. Whitelist / dominios permitidos

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

———

## Reglas de migración

- no migrar más de un formulario por iteración
- no mezclar refactor visual con refactor de action state
- no mantener en paralelo dos fuentes de verdad para pending o error
- si un formulario usa useActionState, el estado de submit debe salir de ahí
- la validación crítica debe vivir en servidor, aunque exista validación mínima en cliente

———

## Definiciones pendientes por formulario

Para cada formulario cerrar:

- initialState
- shape exacto de fieldErrors
- si la action recibe FormData o payload adaptado
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
