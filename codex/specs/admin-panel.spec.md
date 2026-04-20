## Admin-Panel Spec

#### Objetivo

- Esta es la pantalla de administracion a la cual un usuario con un token valido del roll admin sera redirigido a esta despues de login. Esta pantalla permite configurar los usuarios y las credenciales de todo el proyecto.

## Diseño

1. Toda la implementación del AdminPanel debe usar Mantine UI salvo que exista una limitación real del componente en ese caso usara css Modules.
2. La referencia visual principal a respetar es `codex/assets/design/admin/admin-panel.design.png`.
3. Ningun SVG debe estar harcodeado, deberian venir de integraciones de MantineUi Junto con el componente o en caso de no venir se solicitara para que se tome una decision de agregar un svg para dicho caso.
4. Todos los elementos visuales del admin-panel deben usar la fuente global definida por la aplicación a través de `var(--font)`.

## Estructura

- El Admin-Panel esta compuesto de varios componentes y widgets, a continuacion se procedera a explicar como estara compuesto:

- Navbar: El navbar sera el menu de navegacion donde los usuarios podran hacer logout y ver informacion de su profile como el nombre de usuario, su icono o image, el titulo de la page del panel, etc. Tal como se muestra en la referencia `codex/assets/design/admin/admin-panel.design.png`.

- Sidebar: El menu del sidebar por ahora solo debera tener 2 iconos en sus respectivos items, un item seria el de inicio y el otro de configuracion

- PrincipalPanel: Compuesto por widgets de usuarios, SearchList de usuarios, y un boton para añadir usuarios

## Maquetacion

///////////// Navabar////////////////////////////
Sidebar | WidgetCard | WidgetCard | WidgetCard
item ///| Button-new-users
item ///| Search List

## Estilos

1. Los siguientes estilos deben tratar de agregarse como primera directiva como props que existan para cada uno en el componente propio de Mantine UI.

WidgetCard :
<Card> variant-gradient bg-blue p-lg
background: linear-gradient(135deg, var(--m-blue-8) 0%, var(--m-blue-5) 100%);
border: none;
position: relative;
overflow: hidden;
padding: var(--m-lg);
border-radius: var(--m-radius-md);
box-sizing: border-box;

Table-wrapper: <div>
background: var(--m-white);
border: 1px solid var(--m-gray-2);
border-radius: var(--m-radius-md);
overflow: hidden;
box-shadow: var(--m-shadow-sm);
<Stack> gap-md
inputsearch: <Group> gap-md
table-users:

Button-new-users:
<Button> variant-filled bg-blue-5 size-sm radius-full
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
transition: all .15s;
text-decoration: none;

<Table>
    width: 100%;
    border-collapse: collapse;
    text-indent: initial;
    unicode-bidi: isolate;
    border-spacing: 2px;
    border-color: gray;
</Stack>

## Requerimientos

Sidebar:

Se requiere que cuando uses los items del sidebar se pueda navegar entre ellos

WidgetCardList:
Debe mostrar en cada card (4) en total:
Usuarios activos (en una card)
Usuarios Eliminados (en una card)
Contraseñas cambiadas (en una card)
Cargos / roles (en una card)

Button-new-users:

1. Al hacer click en el boton deberia abrir un modal donde podemos añadir a un usuario.
   Modal-new-users:
1. Al crear un nuevo usuario en el modal deberia agregarse a la tabla a travez de un server action que envie la operacion POST al backend.

   Table-wrapper:
   Titulo: Gestión de usuarios
   Subtitulo: Administrá las cuentas del sistema

1. Debe contener un input y al lado un label. Este input sera un input text buscador con un place holder ${cantidad_usuarios}
1. Dentro de Table-wrapper tendremos <Table> de Mantine UI.
1. <Table> debe tener 4 columnas: Usuario | Email | Cargo | Acciones
1. Tiene que contener en cada row un item con icono + user , email, cargo o rol, acciones (crud con icons)
1. Cada icon del crud debe invocar un modal segun corresponda (CRUD)

### Mock de desarrollo

1. El adminpanel debe usar el mock de desarrollo actual como lo hace de momento en caso de no tener uno crear uno temporalmente.

## Criterios de aceptación

- El admin debe poder ver los usuarios
- El admin deberia poder modificar los usuarios mediante el modal
- El admin deberia poder eliminar los usuarios mediante el modal
- El admin deberia poder listar los usuarios y sus cargos
- Un usuario `user` que entra a `/admin` es redirigido a `/login?mode=admin`.
- Si inicia sesión con credenciales `admin`, termina en `/admin`.
- Si inicia sesión con credenciales inválidas, permanece en `/login`.
- Si intenta enviar el login con el mail vacío, la UI muestra un mensaje visible al final del
  formulario indicando el error.
- Si intenta enviar el login con la contraseña vacía, la UI muestra un mensaje visible al
  final del formulario indicando el error.
- La acción `¿Olvidaste tu contraseña?` no navega y muestra una alerta indicando que se debe
  contactar a soporte.
