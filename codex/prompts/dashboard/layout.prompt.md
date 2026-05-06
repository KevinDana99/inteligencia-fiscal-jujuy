# Dashboard Layout Prompt

## Objetivo

Implementar el layout general del dashboard de usuario comun siguiendo la spec visual y las reglas de arquitectura del proyecto.

## Referencias obligatorias

- `codex/specs/dashboard/layout.spec.md`
- `codex/constraints/dashboard/layout.rule.md`
- la skill `create-frontend-architecture`

## Contexto actual

- El proyecto usa Next.js 16 App Router.
- La UI debe construirse con Mantine UI.
- El panel de administracion ya existe y no debe modificarse.
- Esta iteracion corresponde al layout general del dashboard de usuario comun.
- La referencia visual principal es `codex/assets/design/dashboard/layout/layout.png`.

## Alcance

La implementacion debe:

1. Construir el layout general del dashboard con:
   - navbar superior
   - sidebar izquierdo
   - contenedor principal de contenido
2. Aplicar ese layout al dashboard general y no al panel admin.
3. Crear las 4 rutas estaticas del sidebar:
   - `Padron Unificado`
   - `Gestion de Lotes`
   - `Gestion de Cruces`
   - `Reproceso`
4. Dejar `Gestion de Lotes` como la vista de trabajo real de esta iteracion.
5. Dejar el resto de las rutas como placeholders navegables si todavia no tienen desarrollo funcional.
6. Reutilizar el mismo logo del panel admin en el sidebar.
7. Mantener el sidebar fijo a la izquierda y el navbar sticky arriba.

## Reglas funcionales

1. `Padron Unificado` debe verse activo por defecto en el estado inicial.
2. El sidebar debe contener dos grupos:
   - `Analisis`
   - `Seguimiento`
3. `Analisis` debe contener exactamente:
   - `Padron Unificado`
   - `Gestion de Lotes`
   - `Gestion de Cruces`
4. `Seguimiento` debe contener exactamente:
   - `Reproceso`
5. Cada item debe navegar mediante rutas reales de Next.js 16, no con estado local simulado.
6. El footer del sidebar debe mostrar avatar, nombre y cargo del usuario.

## Reglas visuales principales

### Layout general

```css
.app {
  display: flex;
  min-height: 100vh;
}
```

### Navbar

Debe respetar esta base:

```css
.navbar {
  height: var(--header-h);
  background: white;
  border-bottom: 1px solid var(--gray-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 50;
}
```

Reglas:

- debe permanecer visible al hacer scroll
- no debe desplazarse con el contenido principal
- en esta iteracion puede mantener contenido interno minimo si la spec aun no define mas detalle

### Sidebar

Reglas:

- debe construirse con Mantine como base
- debe respetar espaciados y jerarquia del snippet de referencia
- no debe ser scrolleable en esta iteracion
- debe quedar fijo a la izquierda
- debe reemplazar el SVG inline por el logo ya existente del admin panel

## Archivos esperados

La implementacion deberia concentrarse en:

- `app/dashboard/**` o el segmento real equivalente del dashboard general
- `src/modules/dashboard-layout/**` si se crea un modulo dedicado
- componentes de presentacion del layout
- CSS Modules asociados al layout, navbar y sidebar

Si el dashboard general ya vive en otra ruta o modulo, se debe respetar esa estructura antes que inventar una paralela.

## Fuera de alcance

1. No modificar `/admin`.
2. No tocar auth ni sesion.
3. No implementar aun logica de negocio de las vistas, salvo placeholders estructurales.
4. No introducir librerias de UI nuevas.
5. No usar el SVG inline del snippet como implementacion final.

## Validacion final

Antes de cerrar la tarea:

1. Verificar que el dashboard cargue con navbar y sidebar.
2. Verificar que el navbar se mantenga sticky.
3. Verificar que el sidebar quede fijo a la izquierda.
4. Verificar que las 4 rutas del sidebar naveguen correctamente.
5. Verificar que `Gestion de Lotes` quede como la vista principal trabajada en esta iteracion.
6. Correr:

```bash
bun run lint
bun run build
```
