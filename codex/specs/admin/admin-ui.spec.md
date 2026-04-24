## Admin UI Spec

## Diseño

## Navbar UI

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

## Modals UI

-Se decidio que el modal de editar y crear usuario seran iguales solo que uno apuntara a el endpoint de editar usuario y el otro de agregar usuario.
-Se decidio que el modal de eliminar usuario y salir (logout) debe ser el mismo nada mas que cambian los colores como se explicara a continuacion.
-El boton `Salir` del navbar no debe cerrar sesion de forma directa. Primero debe abrir el modal de confirmacion de logout y solo si el usuario confirma debe ejecutarse el handler de cierre de sesion. Si cancela, el modal solo se cierra.

### Modal update/create usuario:

-referencia visual modal update/create:
`codex/assets/design/admin/modals/modal-create-edit/default/*.png`
`codex/assets/design/admin/modals/modal-create-edit/error/*.png`

Tiene que usar <Modal>
.Modal-overlay.open .Modal {
transform: translateY(0) scale(1);
opacity: 1;
}
.Modal {
background: var(--m-white);
border-radius: var(--m-radius-lg);
width: 100%;
max-width: 480px;
box-shadow: var(--m-shadow-xl);
transform: translateY(16px) scale(.98);
transition: transform .3s cubic-bezier(.22, 1, .36, 1), opacity .3s;
opacity: 0;
}

## Header

.Modal-header {
padding: 22px 26px 18px;
border-bottom: 1px solid var(gray-2);
display: flex;
align-items: flex-start;
justify-content: space-between;
}

<div .modal-header>
<Stack gap-xs>
<Text> 
Modal-title {
    font-size: 17px;
    font-weight: 800;
    color: var(--m-gray-9);
}
<Text fz-sm c-dimmed> subtitle
</Stack>
</div>

## Body

<div> container
padding: 22px 26px;
<div class=form-row-2 mb-md> (Esto solo para input nombre , apellido los otros inputs no deben poseer este container, solo este : <TextInput mb-md>)
.form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--m-md);
}
(<TextInput>
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
<label>
.TextInput label, .PasswordInput label, .Select label {
    font-size: 12px;
    font-weight: 700;
    color: var(--m-gray-7);
    text-transform: uppercase;
    letter-spacing: .3px;
}
<Input type=text require>) x2 (input Nombre, input Apellido )

.Input {
width: 100%;
padding: 10px 14px;
border: 1.5px solid var(--m-gray-3);
border-radius: var(--m-radius-md);
font-family: inherit;
font-size: 13.5px;
color: var(--m-gray-9);
background: var(--m-gray-0);
outline: none;
transition: border-color .15s, box-shadow .15s;
}

.Input-error{
font-size: 11.5px;
color: var(--m-red-5);
font-weight: 500;
margin-top: 3px;
}

- Para los otros inputs debe ser :
  <TextInput> (Todos menos el Select, email tipo email y el de contraseña tipo password pero con un toggle para ocultarla, por defecto en true para que se oculte)
  <label>
  <Input>
- debe usar los mismos estilos de los otros inputs, la diferencia es que como no los envuelve el <div form-row-2 mb-md > estos son al 100% del width
  -uno debe ser del email con campo email
- otro de cargo con el selector actual del modal actual (eso esta bien actualmente, mantener)
- otro con contraseña. este ultimo ademas de tener su input error respectivo debe tener un verificador de fortaleza de contraseña. Esto debe ser una barrita que marca
  el nivel de dureza de la contraseña, yendo de rojo, a naranja, amarillo, verde y verde oscuro con la paleta actual de colores

Debe ser en este orden:
nombre, apellido
email
cargo (select)
contraseña
verificador de dureza
los buttons pueden quedar como estan en cuanto a colores y forma lo unico que :
<Button variant-default size-sm> cancelar
<Button variant-default size-sm> crear/modificar usuario
y quitale los hovers esos que tienen actualmente no van:
cancelar button:
.Button.variant-default:hover {
border-color: var(--m-blue-5);
color: var(--m-blue-5);
}
crear/modificar button:
.Button.variant-filled.bg-blue-5:hover {
background: var(--m-blue-6);
box-shadow: var(--m-shadow-md);
transform: translateY(-1px);
}

</div>

## Footer

.Modal-footer {
padding: 16px 26px;
border-top: 1px solid var(--m-gray-2);
display: flex;
justify-content: flex-end;
gap: 10px;
}

### Modal logout/delete usuario:

Modal-overlay open
<Modal> size-sm
padding:32px 28px 24px;text-align:center

<div>
ThemeIcon size-lg
    width: 52px;
    height: 52px;
    background: var(--m-blue-0);
    color: var(--m-blue-5);
    border-radius: 50%;
    margin: 0 auto var(--m-md);
<Icon name=logout> //tabler icons
ese icon tambien debe estar en el boton de salir
title:
<Title order-3 mb-sm>
description:
<Text fz-sm c-dimmed>

## footer

{
justify-content: center;
}
.Modal-footer {
padding: 16px 26px;
border-top: 1px solid var(--m-gray-2);
display: flex;
gap: 10px;
}

<Button variant-default size-sm> (cancelar)
background: var(--m-white);
color: var(--m-gray-7);
border: 1.5px solid var(--m-gray-3);

// todos los colores con la paleta de colores nuestra obvio esos colores no existen pero tienen el equivalente con un nombre similar en theme.

<Button variant-filled bg-blue-5 size-sm> ([icon] si, salir )
{
background: var(--m-blue-5);
color: var(--m-white);
}

para el modal de delete user es lo mismo nada mas que debes cambiarle los colores y el icon.

osea lo que esta en azul deberia ir :

element.style {
background: var(--m-red-5);
color: var(--m-white);
border-color: var(--m-red-5);
}
.Button.variant-light.bg-red {
background: #fff0f0;
color: var(--m-red-6);
border: 1.5px solid #fca5a5;
}
En fin lo otro es el icon:
IconTrash

// dejo referencia de los errores de los modales de logout y delete referencias visuales en:

`codex/assets/design/admin/modals/modal-delete-logout/default/*.png`
`codex/assets/design/admin/modals/modal-delete-logout/error/*.png`
