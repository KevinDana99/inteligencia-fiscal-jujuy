## Login Spec

#### Objetivo

- Esta pantalla de login debe permitir que los usuarios puedan acceder a un rol con sus respectivos permisos en la plataforma.

## Diseño

1. Se debe estilizar el login actual de la pagina `app/(auth)/login`.
2. La versión normal del login debe respetar visualmente la referencia definida en `codex/assets/design/auth/login.design.png`.
3. La versión de error del login debe respetar visualmente la referencia definida en `codex/assets/design/auth/error/login.error.png`.

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

Actualmente funciona de esta manera hay que tratar de no romper ese funcionamiento, osea que no se debe implementar porque ya esta implementado.

## Requerimientos

1. El login debe dejarte escribir un mail y contraseña
2. El login debe tener un boton para ingresar
3. El login debe poseer un enlace para recuperar contraseña.
   Dado que la recuperación de contraseña se gestiona actualmente desde el área administrativa,
   este enlace debe llevar al flujo de acceso administrativo:
   - si el usuario autenticado actual tiene rol `user`, debe dirigirlo a `/login?mode=admin`
   - si el usuario ya posee rol `admin`, debe permitirle acceder a `/admin`
4. El login debe poseer un icon que funcione como boton toggle para ocultar y mostrar contraseña. Por defecto esta debe mantenerse oculta.
5. Si se proporcionaron los datos solicitados el boton de ingresar del login debe dejar de mostrarse como disable y mostrarse con su color real y permitir evento click.
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
