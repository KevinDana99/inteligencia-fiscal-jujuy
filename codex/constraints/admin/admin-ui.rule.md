# Admin UI Rules

## Objetivo

Estas reglas complementan `codex/constraints/admin/admin-panel.rule.md` para implementar la UI del admin panel por partes. Este documento cubre las secciones definidas en `codex/specs/admin/admin-ui.spec.md`.

## Alcance general

1. Cada iteracion solo puede modificar la seccion puntual que este siendo trabajada.
2. No se debe redisenar ni modificar secciones fuera del alcance inmediato del prompt activo.
3. No se deben crear rutas nuevas.
4. No se debe modificar auth, login, logout, cookies, sesion, proxy ni el flujo de elevacion a admin.
5. El logout puede reutilizar el handler existente, pero no se debe cambiar su contrato funcional.

## Navbar

1. El navbar debe vivir dentro de la pantalla existente `/admin`.
2. El navbar debe construirse con Mantine UI como base.
3. CSS Modules solo debe usarse para resolver medidas, layout o detalles visuales que no convenga expresar con props de Mantine.
4. El navbar debe respetar la estructura visual del spec:
   - seccion izquierda
   - seccion derecha
5. La seccion izquierda debe contener exactamente:
   - logo
   - divider
   - titulo de pagina
6. La seccion derecha debe contener exactamente:
   - user pill
   - boton de logout

## Reglas visuales del header

1. El contenedor del header debe respetar los tokens indicados por el spec:

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

2. Si `var(--m-header-h)` no existe o no esta disponible, se debe revisar el sistema de tokens antes de hardcodear una altura nueva.
3. Si el layout actual depende de una altura anterior del header, solo se pueden ajustar offsets relacionados al header para evitar desalineacion.
4. No se deben introducir cambios visuales no relacionados con el navbar.

## Reglas visuales de la seccion izquierda

1. El logo debe medir aproximadamente:

```css
width: 100.938px;
height: 30px;
```

2. El divider debe medir:

```css
width: 1px;
height: 22px;
background: var(--m-gray-2);
```

3. El titulo debe ser un texto de pagina con:

```css
color: var(--m-gray-5);
font-size: 12.5px;
font-weight: 600;
width: 146.281px;
height: 16px;
```

4. El titulo visible debe ser:

```text
Panel de Administración
```

## Reglas visuales de la seccion derecha

1. La seccion derecha debe comportarse como un `Group` con separacion chica.
2. El contenedor derecho debe medir aproximadamente:

```css
width: 217.797px;
height: 40px;
```

3. El user pill debe respetar:

```css
padding: 5px 14px 5px 5px;
display: flex;
align-items: center;
gap: var(--m-xs);
background: var(--m-blue-0);
border-radius: var(--m-radius-full);
box-sizing: border-box;
```

4. El avatar debe usar Mantine `Avatar` con:
   - size `sm`
   - color azul
   - radio circular
5. El texto del user pill debe usar Mantine `Text` con:
   - size chico
   - peso 600
   - color azul oscuro
6. El boton de logout debe usar Mantine `Button` con:
   - `variant="default"`
   - `size="sm"`

## Validacion

1. La app debe compilar sin errores de TypeScript.
2. El lint debe pasar si existe script disponible.
3. El navbar debe conservar el logout funcional.
4. `/admin` debe seguir protegido por el flujo admin existente.
5. No debe haber cambios funcionales fuera del navbar.

## Modals UI

1. La iteracion de modals solo puede tocar los modales del admin panel y las acciones de tabla estrictamente necesarias para abrirlos.
2. No se debe reintroducir un modal separado de cambio de contraseña.
3. Crear usuario y editar usuario deben compartir la misma base visual y estructural.
4. Logout y eliminar usuario deben compartir la misma base visual y estructural.
5. Las diferencias entre logout y delete user deben resolverse solo con contenido, iconografia y color semantico.

## Reglas funcionales de modals

1. Deben existir solo estos grupos:
   - modal create/update usuario
   - modal logout/delete usuario
2. El modal de editar usuario debe seguir apuntando al flujo de actualizacion existente.
3. El modal de crear usuario debe seguir apuntando al flujo de alta existente.
4. El modal de eliminar usuario debe seguir apuntando al flujo de eliminacion existente.
5. El boton `Salir` del navbar no debe ejecutar logout de forma inmediata.
6. El click en `Salir` debe abrir primero el modal de confirmacion de logout.
7. El modal de logout debe seguir reutilizando el handler de logout existente solo cuando el usuario confirma la accion.
8. Si el usuario cancela, el modal debe cerrarse sin cerrar la sesion.
9. No se deben cambiar contratos de handlers, auth ni navegacion para resolver los modals.

## Reglas visuales del modal create/update usuario

1. Debe usar `Modal` de Mantine como base.
2. Debe respetar esta caja visual:

```css
background: var(--m-white);
border-radius: var(--m-radius-lg);
width: 100%;
max-width: 480px;
box-shadow: var(--m-shadow-xl);
transform: translateY(16px) scale(.98);
transition: transform .3s cubic-bezier(.22, 1, .36, 1), opacity .3s;
opacity: 0;
```

3. El header debe respetar:

```css
padding: 22px 26px 18px;
border-bottom: 1px solid var(--m-gray-2);
display: flex;
align-items: flex-start;
justify-content: space-between;
```

4. El titulo del modal debe usar aproximadamente:

```css
font-size: 17px;
font-weight: 800;
color: var(--m-gray-9);
```

5. El subtitulo debe comportarse como texto chico secundario.
6. El body debe respetar:

```css
padding: 22px 26px;
```

7. Solo nombre y apellido deben compartir una grilla de dos columnas:

```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: var(--m-md);
```

8. Email, cargo, contraseña y verificador de fortaleza deben ocupar ancho completo.
9. El orden obligatorio del formulario es:
   - nombre
   - apellido
   - email
   - cargo
   - contraseña
   - verificador de dureza
10. El select de cargo debe reutilizar el control actual si ya coincide visualmente.
11. El campo contraseña debe tener toggle de visibilidad y por defecto debe quedar oculto.
12. Debe existir un verificador visual de fortaleza de contraseña con progresion de color:
   - rojo
   - naranja
   - amarillo
   - verde
   - verde oscuro
13. Todos los labels de inputs deben respetar:

```css
font-size: 12px;
font-weight: 700;
color: var(--m-gray-7);
text-transform: uppercase;
letter-spacing: .3px;
```

14. Los inputs de texto, email y password deben compartir esta base:

```css
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
```

15. Los errores de input deben respetar:

```css
font-size: 11.5px;
color: var(--m-red-5);
font-weight: 500;
margin-top: 3px;
```

16. El footer debe respetar:

```css
padding: 16px 26px;
border-top: 1px solid var(--m-gray-2);
display: flex;
justify-content: flex-end;
gap: 10px;
```

17. Los botones de create/update pueden mantener su forma general actual, pero se deben quitar los hovers custom indicados por el spec anterior.

## Reglas visuales del modal logout/delete usuario

1. Debe usar `Modal` de Mantine como base.
2. Debe ser un modal mas chico, centrado y con contenido alineado al centro.
3. El contenedor principal debe respetar aproximadamente:

```css
padding: 32px 28px 24px;
text-align: center;
```

4. Debe mostrar `ThemeIcon` grande con:

```css
width: 52px;
height: 52px;
border-radius: 50%;
margin: 0 auto var(--m-md);
```

5. El modal de logout debe usar semantica azul:
   - fondo del icon container en azul suave
   - icono en azul
   - boton principal azul
6. El modal de delete user debe usar semantica roja:
   - icon container en rojo suave
   - icono rojo
   - boton principal rojo
7. El footer debe respetar:

```css
padding: 16px 26px;
border-top: 1px solid var(--m-gray-2);
display: flex;
justify-content: center;
gap: 10px;
```

8. El boton secundario debe respetar visualmente:

```css
background: var(--m-white);
color: var(--m-gray-7);
border: 1.5px solid var(--m-gray-3);
```

9. El boton primario debe usar el color semantico correspondiente de la accion.
10. El icono de logout tambien debe estar disponible en el boton de salir del navbar.

## Validacion de modals

1. Deben seguir abriendo y cerrando sin errores.
2. No debe existir modal separado de cambio de contraseña.
3. El usuario admin no debe ganar acciones nuevas por este refactor.
4. El modal de logout y el de delete user deben compartir estructura base sin duplicar patrones innecesarios.
5. El build y el lint deben seguir pasando.

## Config Section

1. La iteracion de configuracion solo puede tocar:
   - la vista `Configuración` del admin panel
   - la validacion frontend de email en create/update user
   - el estado global estrictamente necesario para compartir la config
2. No se debe modificar auth, sesion, routing ni contratos del backend para resolver esta feature.
3. No se debe mover la configuracion fuera del modulo `admin-panel`.

## Reglas funcionales de configuracion

1. Debe existir una configuracion global del modulo admin accesible tanto desde:
   - la seccion `Configuración`
   - los formularios de crear usuario y editar usuario
2. Esa configuracion debe vivir en un provider del modulo.
3. El provider debe persistir el estado en `localStorage`.
4. El provider debe:
   - leer configuracion persistida
   - agregar dominios a la whitelist
   - eliminar dominios de la whitelist
   - exponer el estado a los consumidores del modulo
5. No se debe implementar edicion inline ni edicion modal de dominios existentes.
6. Solo se deben permitir estas operaciones sobre dominios:
   - agregar
   - eliminar
7. La whitelist debe ser la fuente de verdad para validar emails permitidos en create/update user.
8. La validacion del email debe ocurrir en frontend al guardar create/update user.
9. Si el dominio del email no pertenece a la whitelist activa, se debe mostrar error y no se debe permitir guardar.

## Reglas del estado global

1. La forma base del estado debe ser:

```ts
adminConfig: {
  whitelist: ['@rentas.gob.ar', '@jujuy.gob.ar', '_dpr@jujuy.gob.ar']
}
```

2. La estructura debe quedar preparada para crecer con nuevas claves en el futuro.
3. `whitelist` debe mantenerse como array de strings.
4. Si no existe configuracion persistida, si fue borrada o si el valor de `localStorage` es invalido, el provider debe usar este fallback seguro:

```ts
adminConfig: {
  whitelist: []
}
```

5. La UI no debe romperse si el fallback entra en uso.

## Reglas visuales de la seccion Configuración

1. La pagina de configuracion debe mantener el title y subtitle ya definidos por el spec:
   - `Configuración`
   - `Administrá los parámetros generales del sistema`
2. El contenedor general de esta seccion debe comportarse como `Stack gap="xl"`.
3. El panel principal de whitelist debe usar `Card` de Mantine como base y no debe superar aproximadamente `640px` de ancho.
4. El bloque superior del card debe contener:
   - icono mail
   - titulo `Dominios de email permitidos`
   - subtitulo explicativo
5. El icono mail del bloque superior debe respetar aproximadamente:

```css
width: 32px;
height: 32px;
background: var(--m-blue-0);
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
flex-shrink: 0;
```

6. Debe existir una separacion visual con borde superior gris entre el header del card y la lista.
7. Cada dominio listado debe renderizarse dentro de un item visual con:

```css
display: flex;
align-items: center;
justify-content: space-between;
padding: 10px 14px;
background: var(--m-gray-0);
border: 1px solid var(--m-gray-2);
border-radius: 8px;
```

8. Cada item debe mostrar:
   - punto verde de estado
   - texto del dominio
   - accion de eliminar con `IconTrash`
9. La accion de eliminar debe usar semantica roja y no debe renderizarse como boton primario.
10. Debe existir una seccion inferior `Agregar nuevo dominio` con:
   - label uppercase chico
   - input con icono mail
   - boton `Agregar`
11. El input de agregar dominio debe usar la misma base visual de inputs del resto del admin panel cuando sea posible.
12. El boton `Agregar` debe usar semantica azul y mantenerse consistente con la paleta actual.

## Reglas visuales del bloque informativo

1. Debe existir un card informativo separado debajo del panel principal.
2. Ese card debe usar semantica azul suave:
   - fondo azul muy claro
   - borde azul claro
   - icono informativo azul
3. El titulo visible debe ser:

```text
¿Cómo funciona la validación?
```

4. El texto debe explicar que al crear o modificar un usuario, el email debe terminar con uno de los dominios listados o no se podra guardar.

## Validacion de configuracion

1. La seccion `Configuración` debe seguir cargando dentro de `/admin/configuracion`.
2. Debe ser posible agregar dominios a la whitelist.
3. Debe ser posible eliminar dominios de la whitelist.
4. La configuracion debe persistir entre recargas via `localStorage`.
5. Si `localStorage` no tiene configuracion valida, la UI debe caer en `whitelist: []` sin errores.
6. Los formularios de create/update user deben leer la whitelist desde el provider.
7. Si el email no coincide con la whitelist, create/update user no debe poder guardarse.
8. El build y el lint deben seguir pasando.
