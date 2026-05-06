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

## Config Section

Requerimiento de caso de uso:

- Se informo sobre una configuracion a realizar para los dominios que usen el contrato establecido. Por ende esta configuracion debe afectar al panel de administrador en la parte de creacion de usuarios. Cuando se cree un usuario se debe validar que en la white list que vamos a armar a continuacion esten los dominios de correo electronico permitidos en esa whitelist.

### Requisitos

1. Validacion de dominios con whitelist en el formulario de creacion o update de usuario
2. En la config se debe crear un panel como el proporcionado en la siguiente referencia:

- panel de configuracion de whitelist para todos los usuarios de la plataforma:
  referencia visual: `codex/assets/design/admin/config/whitelist.png`.

3. Se deben poder agregar y eliminar los dominios configurables.
4. El estado de la config debe ser un estado global en un provider que use localstorage para persistir los datos de la config de los dominios permitidos.
5. La forma del estado global de configuracion debe ser escalable y debe comenzar con esta estructura:

```ts
adminConfig: {
  whitelist: ['@rentas.gob.ar', '@jujuy.gob.ar', '_dpr@jujuy.gob.ar']
}
```

6. La clave `whitelist` debe ser la fuente de verdad para validar emails permitidos.
7. La estructura debe permitir agregar mas claves de configuracion en el futuro sin romper el shape base del objeto.
8. Si no existe configuracion persistida, si el objeto fue borrado o si el valor de localstorage no es valido, el provider debe usar un fallback seguro sin romper la UI.
9. El fallback minimo debe ser:

```ts
adminConfig: {
  whitelist: []
}
```

10. La validacion de los formularios debe ser realizada en el front a la hora de crear un usuario o modificarlo.

### Diseño

- El container general de esta seccion debe tener la siguiente estructura:
  <Stack gap-xl>

white-list container:
<Stack gap-xs>MNB

<Title order-2>title: `Configuración`
<p Text fz-sm c-dimmed>subtitle: `Administrá los parámetros generales del sistema`
</Stack>

- El Whitelist component debe contener el siguiente diseño:

  <Card p-lg>max-width:640px
  <Stack gap-md>
  <Stack gap-xs>
  <Group gap-sm> align-items: center;

<IconMail class="icon"> (<i class="ti ti-mail"></i> ese icono)
.icon{ width: 32px;
height: 32px;
background: var(--m-blue-0);
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;}

  <Title order-5>Dominios de email permitidos
  <Text fz-xs c-dimmed>
  Solo los emails con estos dominios podrán registrarse en el sistema
   </Stack>
  </Stack>
  </Group>
  <hr style="border:none;border-top:1px solid var(--m-gray-2);margin:0">
<Stack gap-sm>
<div class="item">(x2 en el mock)
.item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--m-gray-0);
    border: 1px solid var(--m-gray-2);
    border-radius: 8px;
}
<Group gap-sm>
<div class="point">
.point{width:8px;height:8px;border-radius:50%;background:#2F9E44;flex-shrink:0}
</div>
<Text fz-sm fw-700>@jujuy.gob.ar
</Group>

<IconTrash class="btn-delete-domain"/>(<i class="ti ti-trash"></i>)
.btn-delete-domain{
background: none;
border: none;
cursor: pointer;
padding: 4px;
border-radius: 6px;
color: var(--m-red-5);
display: flex;
align-items: center;
}

</div>
<Stack gap-xs>
<Text fz-xs fw-700 tt-uppercase c-dimmed style="letter-spacing:.5px;">(Label) Agregar nuevo dominio
<Group gap-sm> 
<Input-wrapper style="flex:1;">
<Input placeholder="@ejemplo.gob.ar">
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
    padding-left: 36px;
}
</Input>
<IconMail class="input-icon">
.input-icon{
      left: 10px;
    right: auto;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
}
</Input-wrapper>
<Button variant-filled bg-blue-5 size-sm radius-full><IconPlus w="15px" h="15px"/>Agregar</Button>
</Group>
</Stack>

<Card p-md style="max-width:640px;background:#f0f4ff;border:1px solid var(--m-blue-2)">
<Group gap-sm style=align-items:flex-start>
<IconInfoCircle class="info-icon"/>
.info-icon{
  width: 18px;
    height: 18px;
    color: var(--m-blue-5);
    flex-shrink: 0;
    margin-top: 1px;
}

<Stack gap-xs>
<Text fz-sm fw-700 style="color:var(--m-blue-7)">
¿Cómo funciona la validación?
</Text>
<Text fz-xs style="color:var(--m-blue-6);line-height:1.6">
Al crear un nuevo usuario, el sistema verificará que el email ingresado termine con alguno de los dominios listados arriba. Si el email no coincide, se mostrará un error y no se podrá guardar el usuario.
</Text>
</Group>
</Card>
</Stack>
