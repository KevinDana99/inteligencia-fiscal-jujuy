# Admin UI Prompts

## Objetivo

Este archivo agrupa los prompts de implementacion de la UI del admin panel. Cada prompt debe poder ejecutarse de forma independiente y acotada, respetando:

- `codex/specs/admin/admin-ui.spec.md`
- `codex/constraints/admin/admin-ui.rule.md`
- `codex/constraints/admin/admin-panel.rule.md`
- la arquitectura definida por `create-frontend-architecture`

La UI no es lo suficientemente grande como para separar un archivo por componente. Por eso se mantiene un unico archivo `admin-ui.prompt.md` con prompts internos por parte.

## Contexto actual

- La ruta del panel es `/admin`.
- El acceso admin ya existe y no debe modificarse.
- El proyecto usa Next.js App Router y Mantine UI.
- El admin panel ya cuenta con una implementacion en `src/modules/admin-panel/**`.
- El navbar actual vive dentro de `src/modules/admin-panel/presentation/components/AdminPanelShell/index.tsx`.
- Los estilos actuales estan en `src/modules/admin-panel/presentation/components/AdminPanelShell/AdminPanelShell.module.css`.

## Prompt 1: Navbar

### Alcance

La implementacion debe:

1. Ajustar solamente el header/navbar superior.
2. Respetar la estructura visual:
   - logo
   - divider
   - titulo de pagina
   - user pill
   - boton de logout
3. Mantener el comportamiento actual del logout.
4. Mantener intactos sidebar, contenido principal, widgets, tabla, buscador y modales.
5. Mantener intactos auth, login, cookies, sesion, routing y flujo de elevacion a admin.

### Reglas visuales principales

El header debe alinearse al spec:

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

La seccion izquierda debe tener logo, divider y titulo:

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

La seccion derecha debe tener user pill y boton:

```css
container:
width: 217.797px;
height: 40px;

user-pill:
padding: 5px 14px 5px 5px;
display: flex;
align-items: center;
gap: var(--m-xs);
background: var(--m-blue-0);
border-radius: var(--m-radius-full);
box-sizing: border-box;
```

El avatar debe usar Mantine `Avatar` size `sm`, color azul y radio circular.

El texto del user pill debe usar Mantine `Text` con size chico, peso 600 y color azul oscuro.

El boton de logout debe usar Mantine `Button` con `variant="default"` y `size="sm"`.

### Archivos esperados

La implementacion deberia concentrarse en:

- `src/modules/admin-panel/presentation/components/AdminPanelShell/index.tsx`
- `src/modules/admin-panel/presentation/components/AdminPanelShell/AdminPanelShell.module.css`

Opcionalmente se puede extraer un componente interno si mejora la claridad:

- `src/modules/admin-panel/presentation/components/AdminPanelShell/AdminPanelNavbar.tsx`

No crear archivos fuera del modulo salvo que sea estrictamente necesario.

### Validacion final

Antes de cerrar la tarea:

1. Verificar que `/admin` siga cargando.
2. Verificar que el navbar muestre logo, divider, titulo, user pill y logout.
3. Verificar que el logout siga funcionando.
4. Verificar que sidebar y main no queden desalineados por el ajuste de altura del header.
5. Correr los checks disponibles del proyecto, preferentemente:

```bash
bun run lint
bun run build
```

### Fuera de alcance

- No implementar sidebar.
- No implementar widgets.
- No implementar tabla.
- No implementar buscador.
- No implementar modales.
- No modificar datos mock.
- No modificar auth.
- No crear rutas nuevas.

---

## Prompt 2: Sidebar

Pendiente de completar cuando `codex/specs/admin/admin-ui.spec.md` tenga el detalle final del sidebar.

---

## Prompt 3: User Gestion Table

Pendiente de completar cuando `codex/specs/admin/admin-ui.spec.md` tenga el detalle final de la user gestion table.

---

## Prompt 4: Modals

Pendiente de completar cuando `codex/specs/admin/admin-ui.spec.md` tenga el detalle final de los modals.
