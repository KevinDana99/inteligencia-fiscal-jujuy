# Dashboard Layout Rules

## Objetivo

Estas reglas definen restricciones obligatorias para implementar el layout general del dashboard de usuario comun en base a `codex/specs/dashboard/layout.spec.md`.

## Alcance general

1. Esta iteracion solo debe construir el layout general del dashboard:
   - navbar
   - sidebar
   - contenedor principal
2. Esta iteracion no debe implementar aun el contenido funcional interno de las vistas, salvo placeholders donde haga falta para sostener routing.
3. El layout debe aplicarse al dashboard general de la app y no al panel de administracion.
4. No se debe modificar la estructura ni el flujo existente de `/admin`.
5. La referencia visual principal es `codex/assets/design/dashboard/layout/layout.png`.

## Arquitectura

1. La implementacion debe seguir la skill `create-frontend-architecture`.
2. El layout debe resolverse con Next.js 16 App Router y Mantine UI.
3. Si se crea un modulo nuevo, debe respetar la estructura del proyecto:
   - `src/modules/<module-name>/`
   - `data/`
   - `presentation/`
   - `types.ts`
   - `index.tsx`
4. CSS Modules solo debe usarse para medidas, posicionamiento y detalles visuales que no convenga expresar con props de Mantine.
5. No se deben introducir librerias de UI nuevas.

## Routing y alcance de vistas

1. El sidebar debe exponer exactamente 4 items navegables:
   - `Padron Unificado`
   - `Gestion de Lotes`
   - `Gestion de Cruces`
   - `Reproceso`
2. Cada item del sidebar debe tener una ruta estatica real de Next.js 16.
3. En esta iteracion solo `Gestion de Lotes` debe considerarse vista de trabajo real.
4. Las otras rutas pueden existir como placeholders, pero deben quedar navegables.
5. El estado inicial visible del sidebar debe dejar activo `Padron Unificado`.

## Reglas del layout general

1. Debe existir un contenedor general `app` que envuelva el dashboard.
2. El layout base debe responder a una composicion flex.
3. La aplicacion debe ocupar al menos el alto completo del viewport.
4. El navbar debe vivir arriba y el sidebar a la izquierda.
5. El contenido principal no debe superponerse con navbar ni sidebar.

## Reglas del navbar

1. El navbar debe tener posicion `sticky`.
2. El navbar debe permanecer en `top: 0`.
3. El navbar debe usar un `z-index` superior al contenido principal.
4. Al hacer scroll del contenido, el navbar no debe desplazarse de su posicion.
5. En esta iteracion el navbar debe resolverse como estructura de layout; cualquier contenido interno no definido aun por spec debe mantenerse minimo y sobrio.

## Reglas del sidebar

1. El sidebar debe construirse prioritariamente con componentes de Mantine.
2. El logo del sidebar debe reutilizar el mismo logo usado en el panel de admin.
3. No se debe conservar el SVG inline provisto en el HTML de referencia.
4. El sidebar debe incluir dos grupos:
   - `Analisis`
   - `Seguimiento`
5. El grupo `Analisis` debe contener exactamente:
   - `Padron Unificado`
   - `Gestion de Lotes`
   - `Gestion de Cruces`
6. El grupo `Seguimiento` debe contener exactamente:
   - `Reproceso`
7. El sidebar debe quedar fijo a la izquierda.
8. En esta iteracion el sidebar no debe ser scrolleable.
9. El footer del sidebar debe incluir:
   - avatar
   - nombre del usuario
   - cargo del usuario
10. Los espaciados y jerarquia visual deben seguir la referencia del spec.

## Tokens y estilos

1. Los tokens visuales deben salir prioritariamente de Mantine.
2. Si la spec usa nombres genericos como `--header-h` o `--gray-2`, en implementacion deben resolverse con tokens reales del sistema visual vigente.
3. No se deben inventar aliases nuevos si Mantine ya provee el token necesario.
4. No se deben hardcodear estilos innecesarios si Mantine resuelve correctamente la pieza.

## Prohibiciones

- No tocar auth para implementar este layout.
- No tocar `/admin` ni su template.
- No introducir estado local para simular navegacion si la ruta debe existir.
- No implementar aun logica de negocio de `Gestion de Lotes`, `Gestion de Cruces`, `Padron Unificado` o `Reproceso` fuera de placeholders estructurales.
- No usar SVG inline del snippet como implementacion final del logo.

## Validacion

1. La app debe compilar sin errores de TypeScript.
2. El lint debe pasar si existe script disponible.
3. El navbar debe permanecer visible al scrollear.
4. El sidebar debe permanecer fijo a la izquierda.
5. Las 4 rutas del sidebar deben navegar correctamente.
6. `Padron Unificado` debe verse activo por defecto en el estado inicial definido por el spec.
