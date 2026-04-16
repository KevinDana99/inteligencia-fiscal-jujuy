# Login Implementation Prompt

## Objetivo

Implementar el rediseño visual de la pantalla de login respetando:

- `codex/specs/auth/login.spec.md`
- `codex/constraints/auth/login.rule.md`
- `codex/constraints/global.rule.md`
- la arquitectura definida por `create-frontend-architecture`

Esta iteración es principalmente visual. La funcionalidad actual del login ya existe y debe
preservarse.

## Contexto Actual

- La ruta pública actual del login es `app/(auth)/login/page.tsx`.
- El formulario actual vive en `src/modules/auth/presentation/components/LoginForm/`.
- El flujo actual de escalado administrativo usa `/login?mode=admin`.
- Si un usuario `user` intenta entrar a `/admin`, la aplicación lo redirige a
  `/login?mode=admin`.
- Si un usuario inicia sesión correctamente con rol `admin` en ese flujo, termina en `/admin`.
- La UI del login debe verse igual en modo normal y en `mode=admin`.

## Referencias de Diseño

- Estado normal: `codex/assets/design/auth/login.design.png`
- Estado error: `codex/assets/design/auth/error/login.error.png`

La implementación debe acercarse visualmente a esas referencias usando Mantine y estilos
coherentes con el proyecto.

## Alcance de Implementación

La tarea debe cubrir:

- rediseñar visualmente el login actual
- respetar el layout, colores y jerarquía visual de la referencia
- mantener campos de mail y contraseña
- mantener el botón de ingreso
- agregar o ajustar el toggle de mostrar/ocultar contraseña
- agregar el enlace de recuperación de contraseña según el flujo administrativo definido
- implementar el estado visual de loading del botón
- implementar el estado visual de error por credenciales inválidas
- implementar el estado visual de error para campos vacíos
- mantener responsive el login

## Restricciones Obligatorias

1. No modificar la funcionalidad actual del login salvo lo estrictamente necesario para
   conectar estados visuales requeridos por el spec.
2. No reemplazar ni romper el flujo actual basado en `/login?mode=admin`.
3. No cambiar la lógica de redirección post-login ya implementada.
4. No introducir librerías UI nuevas; usar Mantine.
5. No usar estilos inline si puede resolverse con Mantine, `className` o estilos ya
   consistentes con el proyecto.
6. No hacer que `mode=admin` cambie la UI del login.
7. No alterar el mock de desarrollo actual.

## Comportamiento Visual Esperado

### Estado normal

- El login debe respetar la referencia de `codex/assets/design/auth/login.design.png`.
- El formulario debe mostrar mail, contraseña, CTA principal y enlace secundario.
- El botón principal debe verse deshabilitado mientras no corresponda permitir envío según la
  lógica actual del formulario.

### Estado loading

- Al enviar el formulario, el botón principal debe entrar en estado cargando.
- El loader del botón debe seguir la referencia del spec: circular, blanco y gris.

### Estado error por credenciales inválidas

- Si las credenciales son inválidas, el login debe mostrar el mensaje de error con el mismo
  formato visual de `codex/assets/design/auth/error/login.error.png`.
- En ese estado, los inputs deben verse con borde rojo como en la referencia.

### Estado error por campos vacíos

- Si se intenta enviar con el mail vacío, se debe mostrar al final del formulario un mensaje
  visible con el mismo formato visual del estado error indicando que el campo mail está vacío.
- Si se intenta enviar con la contraseña vacía, se debe mostrar al final del formulario un
  mensaje visible con el mismo formato visual del estado error indicando que el campo
  contraseña está vacío.
- Estas validaciones no deben resolverse únicamente con el botón deshabilitado; el error debe
  quedar visible al final del formulario cuando el usuario intente enviar.

## Flujo del enlace secundario

El enlace de recuperación de contraseña debe respetar el contrato actual:

- si el usuario autenticado actual tiene rol `user`, debe dirigir al flujo
  `/login?mode=admin`
- si el usuario ya posee rol `admin`, debe permitir acceder a `/admin`

Si el enlace necesita apoyarse en información de sesión actual, resolverlo sin romper la
arquitectura existente.

## Archivos Esperados

La implementación debería concentrarse principalmente en:

- `src/modules/auth/presentation/components/LoginForm/index.tsx`
- `src/modules/auth/presentation/components/LoginForm/useLoginForm.ts`

Y sólo tocar archivos adicionales si son necesarios para soportar el diseño o estados
visuales requeridos.

## Validación Final

Antes de dar la tarea por cerrada:

- verificar que el login siga funcionando en `/login`
- verificar que el flujo `/login?mode=admin` siga funcionando
- verificar que el usuario `admin` termine en `/admin`
- verificar que el usuario `user` no rompa el flujo de escalado
- verificar responsive
- correr `bun run lint`
- correr `bun run build`

## Resultado Esperado

El resultado final debe ser un login visualmente alineado con las referencias del diseño,
sin romper el flujo actual de autenticación ni el escalado administrativo existente.
