# Login Restyle Prompt

## Objetivo

Actualizar la UI del login existente respetando:

- `codex/specs/auth/login.spec.md`
- `codex/constraints/auth/login.rule.md`
- `codex/constraints/global.rule.md`
- la arquitectura definida por `create-frontend-architecture`

Esta iteración corresponde a un restyling del mismo login. La funcionalidad base ya existe y
debe conservarse.

## Contexto Actual

- La ruta pública del login ya existe en `app/(auth)/login/page.tsx`.
- El formulario actual vive en `src/modules/auth/presentation/components/LoginForm/`.
- El flujo de auth ya está implementado.
- El escalado de permisos hacia admin sigue usando `/login?mode=admin`.
- La UI del login no debe diferir visualmente entre modo normal y `mode=admin`.
- La navegación hacia `/login?mode=admin` debe resetear el estado visual del formulario.

## Referencias

- Diseño principal: `codex/assets/design/auth/login.design.png`
- Estado de error: `codex/assets/design/auth/error/`
- SVG adicional: `codex/design/svg/login-wave.svg`

## Alcance de la tarea

La implementación debe:

- restylar el login actual sin reconstruir la feature de auth
- mantener el formulario de `email` y `password`
- mantener el botón `Ingresar`
- mantener el flujo actual de submit y redirección
- rediseñar la composición usando Mantine primitives
- incorporar el SVG decorativo al pie del container visual del login
- actualizar la sección `¿Olvidaste tu contraseña?` para que ya no navegue y muestre feedback
- mantener responsive la pantalla

## Composición requerida

1. El contenedor principal del login debe construirse con `Paper` de Mantine.
   Debe usar `shadow="xl"`, `radius="lg"` y `p="xl"`.
   Debe ocupar `width: 100%` y `max-width: 440px`.

2. El bloque de título y subtítulo debe construirse con `Stack`.
   Debe usar `gap="xs"`, `mb="lg"` y alineación visual centrada.

3. El título debe construirse con `Title`.
   Debe usar `order={2}`.
   Debe tener un salto de línea `<br />` antes de `Fiscal`.
   Debe reflejar:
   - `font-family: var(--font)`
   - `font-weight: 800`
   - `color: var(--gray-9)`
   - `letter-spacing: -0.3px`
   - `font-size: 22px`

4. El subtítulo debe construirse con `Text`.
   Debe usar `c="dimmed"` y `fz="sm"`.
   Debe ser exactamente:
   `Panel de Administración — Acceso restringido`

5. Los labels de `email` y `password` deben respetar:
   - `font-size: 12px`
   - `font-weight: 700`
   - `color: var(--gray-7)`
   - `text-transform: uppercase`
   - `letter-spacing: 0.3px`

6. Los inputs deben usar Mantine y respetar:
   - `width: 100%`
   - `padding: 10px 14px`
   - `border: 1.5px solid var(--gray-3)`
   - `border-radius: var(--radius-md)`
   - `font-family: var(--font)`
   - `font-size: 13.5px`
   - `color: var(--gray-9)`
   - `background: var(--gray-0)`
   - `transition: border-color .15s, box-shadow .15s`

7. El toggle de contraseña debe mantenerse funcional y usar:
   - caja visual de `16px`
   - color `gray-5`
   - SVG de `24px`

8. La alerta de error debe implementarse con `Alert` de Mantine en variante `light`, usando
   un estilo visual equivalente a:
   - `background: #fff0f0`
   - `border: 1px solid #ffa8a8`
   - `border-left: 4px solid var(--red-5)`
   - `color: var(--red-6)`

9. El botón principal debe implementarse con `Button` de Mantine usando:
   - `variant="filled"`
   - azul equivalente a `blue-5`
   - `size="lg"`
   - radio tipo pill/full
   - `fullWidth`

10. La página debe incluir `codex/design/svg/login-wave.svg` al pie del container visual del
    login, alineado a `bottom: 0`.

## Comportamiento funcional que debe preservarse

1. No romper el flujo actual de autenticación.
2. No romper el flujo `/login?mode=admin`.
3. Si un usuario `user` intenta acceder a `/admin`, debe seguir siendo redirigido a
   `/login?mode=admin`.
4. Si un usuario con rol `admin` inicia sesión correctamente en ese flujo, debe seguir
   terminando en `/admin`.
5. La UI debe verse igual en modo normal y en `mode=admin`.
6. Al pasar a `/login?mode=admin`, el formulario debe resetear su estado visual y no arrastrar
   errores anteriores.

## Reglas específicas nuevas

1. La acción `¿Olvidaste tu contraseña?` ya no debe navegar.
2. En lugar de redirección, debe mostrar un `Alert` indicando que el usuario debe
   contactarse con soporte para cambiar la contraseña.
3. El login debe seguir mostrando errores de credenciales inválidas.
4. El login debe seguir mostrando validaciones visibles cuando falte `mail` o `contraseña`.
5. Al volver a escribir después de un error, el formulario debe volver al estado visual
   normal.

## Restricciones

1. No introducir librerías UI nuevas.
2. No mover la lógica de auth fuera de la arquitectura actual.
3. No usar estilos inline si puede resolverse con Mantine o CSS module.
4. No hardcodear el logo dentro del componente.
5. No cambiar contratos ni comportamiento de backend/mock.

## Archivos esperados

La implementación debería concentrarse principalmente en:

- `app/(auth)/login/page.tsx`
- `app/(auth)/login/LoginPageGate.tsx`
- `src/modules/auth/presentation/components/LoginForm/index.tsx`
- `src/modules/auth/presentation/components/LoginForm/useLoginForm.ts`
- `src/modules/auth/presentation/components/LoginForm/LoginForm.module.css`

Y tocar archivos adicionales sólo si son estrictamente necesarios para incorporar assets o
alinear la metadata de la ruta.

## Validación final

Antes de cerrar la tarea:

- verificar que `/login` siga funcionando
- verificar que `/login?mode=admin` siga funcionando
- verificar que `/admin` siga requiriendo el flujo actual de escalado
- verificar que el login no arrastre errores al cambiar de modo
- verificar responsive
- correr `bun run lint`
- correr `bun run build`

## Resultado esperado

El resultado final debe ser el mismo login funcional que ya existe, pero restilizado según la
nueva dirección visual basada en Mantine, con el cambio de comportamiento de `¿Olvidaste tu
contraseña?` resuelto dentro del propio formulario.
