## Login Spec

#### Objetivo

- Esta pantalla de login debe permitir que los usuarios puedan acceder a un rol con sus respectivos permisos en la plataforma.

## Diseño

1. Toda la implementación del login debe usar Mantine UI salvo que exista una limitación real del componente.
2. La referencia visual principal a respetar es `codex/assets/design/auth/login.design.png`.
3. La referencia visual del estado de error a respetar es `codex/assets/design/auth/error/`.
4. El logo del login no debe estar hardcodeado y debe usar el asset institucional correspondiente.
5. Todos los elementos visuales del login deben usar la fuente global definida por la aplicación a través de `var(--font)`.
6. El contenedor principal del login debe implementarse con `<Paper>` de Mantine usando `shadow="xl"`, `radius="lg"` y `p="xl"`.
7. El contenedor principal del login debe ocupar `width: 100%` con `max-width: 440px`.
8. El bloque que contiene título y subtítulo debe implementarse con `<Stack>` usando `gap="xs"`, `mb="lg"` y alineación visual centrada.
9. El título debe implementarse con `<Title>` usando `order={2}` y un salto de línea `<br />` antes de `Fiscal`.
10. El título debe usar:
    - `font-family: var(--font)`
    - `font-weight: 800`
    - `color: var(--gray-9)`
    - `letter-spacing: -0.3px`
    - `font-size: 22px`
11. El subtítulo debe implementarse con `<Text>` usando `c="dimmed"` y `fz="sm"`.
12. El subtítulo debe usar:
    - `color: var(--gray-6)`
    - `font-size: 12.5px`
13. El subtítulo debe ser exactamente: `Panel de Administración — Acceso restringido`.
14. Los labels de `email` y `password` deben implementarse con componentes de Mantine y usar:
    - `font-size: 12px`
    - `font-weight: 700`
    - `color: var(--gray-7)`
    - `text-transform: uppercase`
    - `letter-spacing: 0.3px`
15. Los campos de entrada deben implementarse con componentes de input de Mantine.
16. Los inputs de `email` y `password` deben usar:
    - `width: 100%`
    - `padding: 10px 14px`
    - `border: 1.5px solid var(--gray-3)`
    - `border-radius: var(--radius-md)`
    - `font-family: var(--font)`
    - `font-size: 13.5px`
    - `color: var(--gray-9)`
    - `background: var(--gray-0)`
    - `outline: none`
    - `transition: border-color .15s, box-shadow .15s`
17. El toggle de contraseña debe usar:
    - caja de icono de `16px`
    - color `gray-5`
    - SVG interno de `24px`
18. La alerta de error o excepción debe implementarse usando el componente `<Alert>` de Mantine.
19. La alerta de error debe usar `variant="light"`, color rojo equivalente a `red-5` y margen inferior visual equivalente a `mb="sm"`.
20. La alerta de error debe incluir un icono de error provisto por Mantine UI y respetar como referencia visual `codex/assets/design/auth/error/`.
21. La alerta de error debe reflejar visualmente:
    - `background: #fff0f0`
    - `border: 1px solid #ffa8a8`
    - `border-left: 4px solid var(--red-5)`
    - `color: var(--red-6)`
22. El botón principal debe implementarse con `<Button>` de Mantine usando:
    - `variant="filled"`
    - color azul equivalente a `blue-5`
    - `size="lg"`
    - `radius="xl"` o equivalente visual de pill/full
    - `fullWidth`
23. El botón principal debe mostrar el texto `Ingresar`.
24. La página de login debe incluir el SVG `codex/assets/design/svg/login-wave.svg` dentro de su
    composición visual.
25. Ese SVG debe posicionarse al pie de la página del login usando alineación visual equivalente a
    `bottom: 0`.

## Alcance

- formulario de email y contraseña
- validación básica de campos
- feedback de error
- redirección post-login

## Fuera de Alcance

- recuperación de contraseña
- registro
- MFA

## Reglas de comportamiento

- Si no hay sesión, la página debe mostrar el formulario.
- Si `mode=admin` y la sesión actual es `user`, debe mostrar el formulario para permitir
  reautenticación.
- Si `mode=admin` y el login exitoso corresponde a un usuario con rol `admin`, debe
  redirigir a `/admin`.
- Si el login falla, debe permanecer en `/login`.
- La UI del login no debe cambiar visualmente entre el modo normal y `mode=admin`.
- El parámetro `mode=admin` solo modifica el comportamiento funcional del flujo de
  autenticación y redirección, no la presentación visual de la pantalla.
- La navegación a `/login?mode=admin` debe resetear el estado visual del formulario para no
  arrastrar errores ni validaciones previas.

Actualmente funciona de esta manera hay que tratar de no romper ese funcionamiento, osea que no se debe implementar porque ya esta implementado.

## Requerimientos

1. El login debe dejarte escribir un mail y contraseña
2. El login debe tener un boton para ingresar
3. La sección de `¿Olvidaste tu contraseña?` ya no debe redirigir a ninguna ruta.
4. En lugar de redirección, esa sección debe mostrar un `<Alert>` informando que el usuario
   debe contactarse con soporte para cambiar la contraseña.
5. El login debe poseer un icon que funcione como boton toggle para ocultar y mostrar contraseña. Por defecto esta debe mantenerse oculta.
6. Al hacer click en ingresar, el boton del login debe tener un estado cargando con un loader circular blanco y gris.
7. En caso de que las credenciales sean incorrectas el login debe mostrar un error como el
   que esta en `codex/assets/design/auth/error/login.error.png`.
8. En caso de credenciales invalidas todos los input deberia tener un borde rojo como el de
   la captura en `codex/assets/design/auth/error/login.error.png`.
9. El mensaje de error de credenciales debe ser identico al de la captura de
   `codex/assets/design/auth/error/login.error.png`.
10. Si el campo mail está vacío al intentar enviar el formulario, el login debe mostrar al
    final un mensaje con el mismo formato visual de `codex/assets/design/auth/error/login.error.png`
    indicando que el campo mail está vacío.
11. Si el campo contraseña está vacío al intentar enviar el formulario, el login debe mostrar
    al final un mensaje con el mismo formato visual de
    `codex/assets/design/auth/error/login.error.png` indicando que el campo contraseña está vacío.
12. Las validaciones de campos vacíos deben mostrar mensaje visible al final del formulario y
    no resolverse únicamente con el estado deshabilitado del botón.

### Mock de desarrollo

1. El login debe usar el mock de desarrollo actual como lo hace de momento.

## Criterios de aceptación

- Un usuario sin sesión puede autenticarse desde `/login`.
- Un usuario `user` que entra a `/admin` es redirigido a `/login?mode=admin`.
- Si inicia sesión con credenciales `admin`, termina en `/admin`.
- Si inicia sesión con credenciales inválidas, permanece en `/login`.
- Si intenta enviar el login con el mail vacío, la UI muestra un mensaje visible al final del
  formulario indicando el error.
- Si intenta enviar el login con la contraseña vacía, la UI muestra un mensaje visible al
  final del formulario indicando el error.
- La acción `¿Olvidaste tu contraseña?` no navega y muestra una alerta indicando que se debe
  contactar a soporte.
