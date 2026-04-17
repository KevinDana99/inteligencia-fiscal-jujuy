## Login Rules

## Diseño

1. El login no puede usar estilos en linea o cualquier otro estilo que no este provisto por Mantine UI
2. El login debe estar adaptado a diseño responsivo.
3. La UI del login no debe cambiar visualmente entre el modo normal y `mode=admin`.
4. La implementación visual del login debe respetar las referencias definidas en `codex/assets/design/auth/login.design.png` y `codex/assets/design/auth/error/login.error.png`.
5. La composición principal del login debe construirse prioritariamente con primitives de Mantine como `Paper`, `Stack`, `Title`, `Text`, `Input`, `Alert` y `Button`.
6. El login debe usar `Inter` como fuente visual del feature.
7. El logo usado por el login no debe estar hardcodeado dentro del componente.

## Funcionalidad

1. Esta implementacion es solo estetica por lo que no tiene que modificarse la funcionalidad actual del login
2. No se debe modificar el flujo actual de escalado de permisos basado en `/login?mode=admin`.
3. La navegación a `/login?mode=admin` debe resetear el estado visual del formulario para no arrastrar errores o validaciones previas.
4. La acción `¿Olvidaste tu contraseña?` no debe navegar a otra ruta y debe resolverse como feedback dentro del propio login según el spec vigente.
