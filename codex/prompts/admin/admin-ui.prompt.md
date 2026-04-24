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

### Alcance

La implementacion debe:

1. Ajustar solamente los modales del admin panel y las acciones estrictamente necesarias para abrirlos.
2. Mantener el flujo actual de crear usuario, editar usuario, eliminar usuario y logout.
3. Hacer que crear usuario y editar usuario compartan la misma base visual y estructural.
4. Hacer que logout y eliminar usuario compartan la misma base visual y estructural.
5. Cambiar el boton `Salir` del navbar para que primero abra un modal de confirmacion y solo despues, si el usuario confirma, ejecute el handler de logout.
6. Mantener intactos sidebar, layout general, tabla fuera de sus triggers modales, auth, cookies, sesion y rutas.
7. No crear un modal separado para cambio de contraseña. Ese flujo no debe existir como modal independiente.

### Reglas funcionales principales

1. El boton `Salir` no debe cerrar sesion de forma directa.
2. El click en `Salir` debe abrir un modal de confirmacion.
3. Si el usuario confirma logout, recien ahi debe ejecutarse el handler existente.
4. Si el usuario cancela, el modal solo debe cerrarse.
5. El modal de eliminar usuario debe seguir apuntando al flujo de delete actual.
6. El modal de crear usuario debe seguir apuntando al flujo de alta actual.
7. El modal de editar usuario debe seguir apuntando al flujo de actualizacion actual.
8. No reintroducir el icono ni el modal intermedio de cambio de contraseña.

### Reglas visuales del modal create/update usuario

Debe usar `Modal` de Mantine y alinearse al spec:

```css
background: var(--m-white);
border-radius: var(--m-radius-lg);
width: 100%;
max-width: 480px;
box-shadow: var(--m-shadow-xl);
```

Header:

```css
padding: 22px 26px 18px;
border-bottom: 1px solid var(--m-gray-2);
display: flex;
align-items: flex-start;
justify-content: space-between;
```

Body:

```css
padding: 22px 26px;
```

Orden obligatorio:

1. nombre
2. apellido
3. email
4. cargo
5. contraseña
6. verificador de dureza

Reglas:

- Solo nombre y apellido van en una grilla de dos columnas.
- Email, cargo y contraseña ocupan ancho completo.
- El campo contraseña debe tener toggle para mostrar/ocultar.
- El verificador de dureza debe mostrar progresion visual con la paleta actual:
  - rojo
  - naranja
  - amarillo
  - verde
  - verde oscuro
- El select de cargo puede reutilizar el control actual si ya coincide visualmente.
- Los botones pueden conservar base actual, pero se deben quitar los hovers custom indicados en el spec.

### Reglas visuales del modal logout/delete usuario

Debe usar `Modal` de Mantine y compartir la misma estructura base para ambas acciones.

Contenedor:

```css
padding: 32px 28px 24px;
text-align: center;
```

ThemeIcon:

```css
width: 52px;
height: 52px;
border-radius: 50%;
margin: 0 auto var(--m-md);
```

Logout:

- usa semantica azul
- icono de logout
- boton principal azul
- el icono de logout tambien debe estar en el boton `Salir` del navbar

Delete user:

- usa semantica roja
- icono semantico de delete
- boton principal rojo

Footer:

```css
padding: 16px 26px;
border-top: 1px solid var(--m-gray-2);
display: flex;
gap: 10px;
```

Para logout/delete, el footer debe centrarse.

### Archivos esperados

La implementacion deberia concentrarse en:

- `src/modules/admin-panel/presentation/components/AdminPanelModals/index.tsx`
- `src/modules/admin-panel/presentation/components/AdminPanelNavbar/index.tsx`
- `src/modules/admin-panel/presentation/components/AdminPanelUserGestionTable/index.tsx`
- `src/modules/admin-panel/presentation/components/AdminPanelShell/index.tsx`
- `src/modules/admin-panel/presentation/hooks/useAdminPanelShell.ts`
- `src/modules/admin-panel/presentation/components/AdminPanelShell/AdminPanelShell.module.css`

No crear archivos fuera del modulo salvo que sea estrictamente necesario.

### Validacion final

Antes de cerrar la tarea:

1. Verificar que crear y editar usuario abran el mismo tipo de modal con distinto copy/accion.
2. Verificar que eliminar usuario y logout usen la misma base visual con distinto color semantico.
3. Verificar que `Salir` ya no haga logout directo.
4. Verificar que `Salir` abra el modal y que confirmar ejecute logout.
5. Verificar que cancelar cierre el modal sin cerrar la sesion.
6. Verificar que no exista modal separado de cambio de contraseña.
7. Correr los checks disponibles del proyecto, preferentemente:

```bash
bun run lint
bun run build
```

### Fuera de alcance

- No tocar sidebar.
- No tocar layout general fuera de ajustes necesarios para abrir el modal de logout.
- No crear rutas nuevas.
- No modificar auth, cookies o contratos de sesion.
- No reintroducir widgets.
