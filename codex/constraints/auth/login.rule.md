## Login Rules

## Diseño

1. El login no puede usar estilos en linea o cualquier otro estilo que no este provisto por Mantine UI
2. El login debe estar adaptado a diseño responsivo.
3. La UI del login no debe cambiar visualmente entre el modo normal y `mode=admin`.
4. La implementación visual del login debe respetar las referencias definidas en `codex/assets/design/auth/login.design.png` y `codex/assets/design/auth/error/login.error.png`.

## Funcionalidad

1. Esta implementacion es solo estetica por lo que no tiene que modificarse la funcionalidad actual del login
2. No se debe modificar el flujo actual de escalado de permisos basado en `/login?mode=admin`.
3. El enlace de recuperación de contraseña debe respetar el flujo administrativo definido en el spec actual.
