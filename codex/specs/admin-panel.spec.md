## Admin Panel Spec

#### Objetivo

- Esta es la pantalla de administración disponible en `/admin`.
- Solo el único usuario con rol `admin` del sitio puede acceder a este panel.
- Si un usuario no cuenta con sesión `admin`, debe continuar usando el flujo actual de acceso a `/admin` y elevación a `/login?mode=admin`.
- Esta pantalla permite administrar usuarios del sistema y visualizar métricas históricas relacionadas a usuarios.
- En esta primera iteración no existe contrato backend para esta feature, por lo tanto la implementación debe usar un mock temporal y luego iterarse.

## Diseño

1. Toda la implementación del Admin Panel debe usar Mantine UI salvo que exista una limitación real del componente. En ese caso se podrá usar CSS Modules.
2. La referencia visual principal a respetar es `codex/assets/design/admin/admin-panel.design.png`.
3. Todos los elementos visuales del admin panel deben usar la fuente global definida por la aplicación a través de `var(--font)`.
4. Los íconos deben provenir de librerías compatibles con React, por ejemplo `@tabler/icons-react` u otra dependencia equivalente si hiciera falta.
5. No se deben hardcodear SVG como string, incrustar SVG vía `<img>` ni crear assets SVG ad hoc para resolver iconografía del panel.
6. Si faltara un ícono, debe priorizarse una librería de íconos que respete la referencia visual del diseño. Si no existe un equivalente razonable, el icono puede omitirse temporalmente.

## Alcance

1. La ruta del panel es `/admin`.
2. No se debe modificar el routing actual.
3. La implementación debe reemplazar el contenido placeholder actual de `/admin`.
4. En esta iteración no existen otras pantallas dentro del panel más allá de la principal.
5. El sidebar puede contener items navegables visualmente, pero no requiere crear nuevas rutas todavía.

## Estructura

- `Navbar`
  Debe mostrar el título del panel, datos del usuario administrador autenticado y la acción de logout, respetando la referencia visual del diseño.

- `Sidebar`
  Debe mostrar por ahora dos items con iconos:
  - inicio
  - configuración

- `PrincipalPanel`
  Debe contener:
  - widgets de métricas
  - bloque de gestión de usuarios
  - buscador de usuarios
  - botón para añadir usuarios

## Maquetación

```text
Navbar
Sidebar | WidgetCard | WidgetCard | WidgetCard | WidgetCard
Sidebar | Header de gestión + Button New User
Sidebar | Search input
Sidebar | Users Table
```

## Estilos

1. Los estilos deben resolverse primero con props nativas de Mantine UI y solo complementar con CSS Modules cuando sea necesario.

### WidgetCard

- usar `<Card>`
- gradiente azul
- sin borde
- `position: relative`
- `overflow: hidden`
- `padding: var(--m-lg)`
- `border-radius: var(--m-radius-md)`

Referencia visual esperada:

```css
background: linear-gradient(135deg, var(--m-blue-8) 0%, var(--m-blue-5) 100%);
border: none;
position: relative;
overflow: hidden;
padding: var(--m-lg);
border-radius: var(--m-radius-md);
box-sizing: border-box;
```

### Table Wrapper

- contenedor blanco
- borde gris suave
- radio mediano
- sombra sutil
- contenido interno con `Stack`

Referencia visual esperada:

```css
background: var(--m-white);
border: 1px solid var(--m-gray-2);
border-radius: var(--m-radius-md);
overflow: hidden;
box-shadow: var(--m-shadow-sm);
```

### Button New User

- usar `<Button>`
- `variant="filled"`
- color azul
- tamaño pequeño
- radio full
- peso fuerte

Referencia visual esperada:

```css
background: var(--m-blue-5);
color: var(--m-white);
border-radius: var(--m-radius-full);
padding: 9px 16px;
font-size: 13px;
display: inline-flex;
align-items: center;
justify-content: center;
gap: 7px;
border: none;
font-family: inherit;
font-weight: 700;
cursor: pointer;
transition: all 0.15s;
text-decoration: none;
```

### Table

- usar `<Table>` de Mantine UI
- ocupar `width: 100%`
- respetar la estética del diseño

## Requerimientos funcionales

### Acceso

1. Solo el usuario con rol `admin` puede ver el contenido del panel.
2. El acceso al panel sigue colgando de la ruta `/admin`.
3. Si no existe sesión `admin`, se debe mantener el flujo actual de redirección al login admin.

### Sidebar

1. Los items del sidebar deben ser interactivos.
2. En esta iteración no requieren resolver navegación a nuevas rutas.
3. Deben respetar la selección visual mostrada en el diseño.

### Navbar

1. Debe mostrar el título de la pantalla.
2. Debe mostrar información del usuario administrador autenticado.
3. Debe incluir acción de logout.

### WidgetCardList

Debe mostrar 4 cards:

1. Usuarios activos
2. Usuarios eliminados
3. Contraseñas cambiadas
4. Cargos / roles

Reglas:

1. Estos datos representan un histórico del sistema.
2. En esta iteración el histórico será mock.
3. La semántica inicial mock será:
   - usuarios activos: total actual de usuarios activos
   - usuarios eliminados: total acumulado de usuarios eliminados
   - contraseñas cambiadas: total acumulado de cambios de contraseña
   - cargos / roles: total actual de roles distintos presentes en el sistema

### Button New User

1. Al hacer click en el botón debe abrir un modal para crear un usuario.
2. Al confirmar la creación, el nuevo usuario debe agregarse a la tabla.
3. En esta iteración la operación será mock temporal.
4. Cuando exista backend real, esta operación se iterará contra el contrato correspondiente.

### Users Table

1. Debe mostrar:
   - título: `Gestión de usuarios`
   - subtítulo: `Administrá las cuentas del sistema`
2. Debe contener un buscador de usuarios.
3. El buscador solo busca usuarios.
4. El buscador no tiene filtros en esta iteración.
5. El placeholder del buscador debe reflejar la cantidad de usuarios disponible en la lista.
6. Debe usar `<Table>` de Mantine UI.
7. Debe tener 4 columnas:
   - Usuario
   - Email
   - Cargo
   - Acciones
8. Cada fila debe mostrar:
   - icono o avatar del usuario
   - nombre de usuario
   - email
   - cargo o rol
   - acciones disponibles

### Acciones sobre usuarios

1. Cada acción del CRUD debe abrir el modal correspondiente.
2. En esta iteración las acciones serán mock temporales.
3. Debe existir edición de usuario mediante modal.
4. Debe existir eliminación de usuario mediante modal.
5. El usuario `admin` no puede ser eliminado.
6. El rol `admin` se carga desde backend y su alcance funcional es:
   - lectura
   - modificación
7. Ese rol no habilita eliminación del propio admin.
8. Hasta tener contrato real, estas restricciones deben mantenerse en el mock temporal.

### Estados

1. En esta iteración no se implementan pantallas de error específicas del admin panel.
2. Debe priorizarse la pantalla principal del diseño.
3. Si más adelante se necesitan estados de error, se iterarán en una fase posterior.

## Mock de desarrollo

1. Como todavía no existe contrato backend para el panel, debe crearse un mock temporal específico para esta feature.
2. Ese mock no debe apoyarse únicamente en el mock actual de autenticación, porque auth hoy no cubre el dominio de administración de usuarios.
3. El mock temporal debe incluir:
   - listado de usuarios
   - alta de usuario
   - edición de usuario
   - eliminación de usuario
   - métricas históricas mock
4. El usuario admin del mock no puede eliminarse.
5. El mock debe servir solo como base temporal hasta que exista contrato real.

## Plan de implementación

### Etapa 1. Reemplazo del placeholder actual

1. Reemplazar el contenido actual de `app/admin/page.tsx`.
2. Mantener intacta la ruta `/admin`.
3. Mantener intacto el flujo actual de acceso admin ya implementado.

### Etapa 2. Módulo temporal del admin panel

1. Crear el módulo del admin panel dentro de `src/modules/`.
2. Separar presentación, modelos y acceso a datos.
3. Mantener la implementación alineada a la arquitectura vigente del repositorio.

### Etapa 3. Mock temporal del dominio

1. Crear una fuente mock específica del panel admin.
2. Modelar usuarios, roles y métricas históricas.
3. Resolver alta, edición y eliminación sobre datos mock.
4. Bloquear la eliminación del usuario admin.

### Etapa 4. UI principal

1. Construir navbar, sidebar, widgets, buscador, tabla y modales.
2. Ajustar la UI a la referencia `codex/assets/design/admin/admin-panel.design.png`.
3. Usar íconos de librería, no SVG incrustados como assets.

### Etapa 5. Integración funcional

1. Conectar la UI al mock temporal.
2. Reflejar los cambios de alta, edición y eliminación en tabla y métricas.
3. Mantener el comportamiento del admin coherente con sus restricciones.

## Criterios de aceptación

- Solo el usuario `admin` puede acceder al contenido del panel en `/admin`.
- El panel reutiliza la ruta `/admin` existente y reemplaza el placeholder actual.
- El admin puede ver la lista de usuarios.
- El admin puede buscar usuarios por texto.
- El admin puede crear usuarios mediante modal.
- El admin puede modificar usuarios mediante modal.
- El admin puede eliminar usuarios mediante modal, excepto al usuario `admin`.
- El panel muestra widgets con métricas históricas mock de usuarios.
- El panel muestra usuarios y cargos en la tabla.
- La UI respeta como referencia principal `codex/assets/design/admin/admin-panel.design.png`.
- La implementación usa mock temporal específico del dominio hasta que exista contrato backend.
