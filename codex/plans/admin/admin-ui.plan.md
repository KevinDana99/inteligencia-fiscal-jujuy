# Admin UI Implementation Plan

## Objetivo

Implementar la UI del panel de administracion de forma incremental, usando un unico archivo de prompts y ejecutando un prompt por vez. Este documento queda como guia auxiliar de orden y seguimiento; la implementacion concreta debe salir de `codex/prompts/admin/admin-ui.prompt.md`.

## Referencias

- Spec visual: `codex/specs/admin/admin-ui.spec.md`
- Spec funcional: `codex/specs/admin/admin-panel.spec.md`
- Reglas UI: `codex/constraints/admin/admin-ui.rule.md`
- Reglas obligatorias: `codex/constraints/admin/admin-panel.rule.md`
- Prompts de implementacion: `codex/prompts/admin/admin-ui.prompt.md`
- Implementacion actual: `src/modules/admin-panel/presentation/components/AdminPanelShell/index.tsx`
- Estilos actuales: `src/modules/admin-panel/presentation/components/AdminPanelShell/AdminPanelShell.module.css`

## Metodologia

1. Detallar una parte en `codex/specs/admin/admin-ui.spec.md`.
2. Bajar restricciones obligatorias de esa parte en `codex/constraints/admin/admin-ui.rule.md`.
3. Agregar o completar el prompt correspondiente en `codex/prompts/admin/admin-ui.prompt.md`.
4. Ejecutar solo ese prompt.
5. Validar que no se hayan implementado partes fuera de alcance.
6. Repetir el ciclo con la siguiente parte.

## Orden de prompts

1. `Prompt 1: Navbar`
2. `Prompt 2: Sidebar`
3. `Prompt 3: User Gestion Table`
4. `Prompt 4: Modals`

## Prompt 1: Navbar

### Alcance

Este prompt solo ajusta el header superior del admin panel. No incluye sidebar, contenido principal, cards, tabla, buscador ni modales.

El navbar debe:

1. Mantenerse dentro de la ruta existente `/admin`.
2. Mantener intacto el flujo actual de auth, logout, cookies, sesion y elevacion a admin.
3. Mostrar logo, divider y titulo de pagina en la seccion izquierda.
4. Mostrar user pill y boton de salida en la seccion derecha.
5. Usar Mantine UI como base y CSS Module solo para detalles visuales que Mantine no resuelva con props.

### Estado actual

El navbar ya existe dentro de `AdminPanelShell` como:

- `header`
- `headerInner`
- `brand`
- `brandLogo`
- `divider`
- `headerTitle`
- `headerActions`
- `profileChip`
- `profileAvatar`
- `profileLabel`
- `secondaryButton`

La iteracion consiste en alinear esa implementacion con las medidas y tokens del spec.

### Cambios de estructura

1. Evaluar si el header debe seguir como markup inline dentro de `AdminPanelShell` o si conviene extraerlo a un componente interno `AdminPanelNavbar`.
2. Si se extrae, mantenerlo dentro del mismo modulo:

```text
src/modules/admin-panel/presentation/components/AdminPanelShell/
├── index.tsx
├── AdminPanelShell.module.css
└── AdminPanelNavbar.tsx
```

3. Pasar al navbar solo las dependencias necesarias:
   - `session.user.userName`
   - `signOut`
   - `isSignOutPending`

### Cambios visuales

#### Header container

Alinear el contenedor superior al spec:

```css
height: var(--m-header-h);
background: var(--m-white);
border-bottom: 1px solid var(--m-gray-2);
display: flex;
align-items: center;
padding: 0 var(--m-lg);
gap: var(--m-md);
box-shadow: var(--m-shadow-xs);
flex-shrink: 0;
z-index: 20;
position: relative;
```

Notas:

- La implementacion actual usa header fixed de `68px`; revisar si `var(--m-header-h)` ya existe y cuanto mide.
- Si el layout actual depende del `68px`, cambiar header, sidebar y grid en la misma iteracion para no desalinear el panel.
- Evitar introducir cambios visuales en sidebar o main salvo offsets necesarios por altura del header.

#### Seccion izquierda

La seccion izquierda debe contener exactamente:

1. Logo
2. Divider
3. Titulo de pagina

Medidas esperadas:

```css
logo:
width: 100.938px;
height: 30px;

divider:
width: 1px;
height: 22px;
background: var(--m-gray-2);

titulo:
color: var(--m-gray-5);
font-size: 12.5px;
font-weight: 600;
width: 146.281px;
height: 16px;
```

Texto esperado del titulo:

```text
Panel de Administración
```

#### Seccion derecha

La seccion derecha debe contener:

1. User pill
2. Boton de logout

Medidas esperadas:

```css
container:
width: 217.797px;
height: 40px;
```

User pill:

```css
padding: 5px 14px 5px 5px;
display: flex;
align-items: center;
gap: var(--m-xs);
background: var(--m-blue-0);
border-radius: var(--m-radius-full);
box-sizing: border-box;
```

Avatar:

```text
size="sm"
color="blue"
radius="xl"
```

Texto:

```text
fz="sm"
fw={600}
c="blue.8"
```

Boton:

```text
variant="default"
size="sm"
```

### Criterios de aceptacion del prompt

1. El navbar se ve alineado con el spec de `admin-ui.spec.md`.
2. La seccion izquierda mantiene el orden logo, divider y titulo.
3. La seccion derecha mantiene user pill y logout.
4. El boton de logout conserva el comportamiento actual.
5. No se modifican rutas, auth, cookies, sesion ni flujo de login admin.
6. No se implementa ningun cambio funcional fuera del navbar.
7. La UI compila sin errores de TypeScript ni lint.

### Verificacion

1. Ejecutar typecheck/lint disponible en el proyecto.
2. Levantar el proyecto con Bun si hace falta validar visualmente.
3. Abrir `/admin` con sesion admin.
4. Confirmar que el header no desalineo sidebar ni main.
5. Confirmar que el logout sigue funcionando.

## Prompts pendientes

Pendientes de completar en `codex/prompts/admin/admin-ui.prompt.md` cuando el spec tenga el detalle correspondiente:

1. `Prompt 2: Sidebar`
2. `Prompt 3: User Gestion Table`
3. `Prompt 4: Modals`
