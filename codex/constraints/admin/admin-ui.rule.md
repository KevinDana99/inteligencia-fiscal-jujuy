# Admin UI Rules

## Objetivo

Estas reglas complementan `codex/constraints/admin/admin-panel.rule.md` para implementar la UI del admin panel por partes. La primera parte cubierta por este documento es el navbar definido en `codex/specs/admin/admin-ui.spec.md`.

## Alcance de esta iteracion

1. Esta iteracion solo puede modificar el navbar/header superior del admin panel.
2. No se debe implementar ni redisenar sidebar, contenido principal, widgets, tabla, buscador ni modales.
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
