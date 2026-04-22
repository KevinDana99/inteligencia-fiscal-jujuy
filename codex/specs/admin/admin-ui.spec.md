## Admin UI Spec

## Diseño

1. Navbar:

<AppShell.Header>
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

- Entre el logo y el titulo de pagina tiene que haber una separacion de un divider, en total en esa seccion de la izq son 3 elementos dentro de un contenedor. El primero es el logo, el segundo el divider y el tercero el titulo de pagina.

Seccion izquierda del header:

logo:
width: 100.938px;
height: 30px;

Divider:
width: 1px;
height: 22px;
background: var(--m-gray-2);

Titulo-page: span
color: var(--m-gray-5);
font-size: 12.5px;
font-weight: 600;
width: 146.281px;
height: 16px;

Seccion derecha del header:

Container-section:
<Group gap-sm>
width: 217.797px
height: 40px;

<div>user-pill
padding: 5px 14px 5px 5px;
    display: flex;
    align-items: center;
    gap: var(--m-xs);
    background: var(--m-blue-0);
    border-radius: var(--m-radius-full);
    box-sizing: border-box;
<Avatar> 
size-sm bg-blue-5 border-radius:50%
<Text> fz-sm fw-600 c-blue-8
</div>
<Button> variant-default size-sm
<Group>
</AppShell.Header>

2. Widgets-section:

title:

<h2> Title.order-2 {
font-size: 22px;
font-family: 'DM Sans', sans-serif;
font-weight: 800;
letter-spacing: -.3px;
}
subtitle:
 <Text> fz-sm c-dimmed
color: gray-5
fz-sm :
font-size: 12.5px;
entre el <h2> y <Text> debe haber un gap de 8px
El total de height de los dos titulos debe ser de 54
