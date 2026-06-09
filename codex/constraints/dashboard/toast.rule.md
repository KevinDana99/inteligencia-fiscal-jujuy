# Toast Rules

## Alcance

- Estas reglas aplican al sistema global de toast del proyecto.
- El sistema debe cubrir las toast de `Admin Panel` y `Dashboard`.
- No se debe avanzar a implementación sin respetar esta estructura y estos contratos.

## Base técnica

- Las toast deben seguir usando `@mantine/notifications` como base.
- El viewport global, el shell y el contenido visual deben mantenerse dentro de `src/components/core/toasts`.
- No se deben introducir librerías nuevas para resolver el mismo problema.

## Estructura obligatoria

La estructura de directorios del sistema de toast debe ser exactamente esta:

```text
src/components/core/toasts/
├── ToastContent/
│   ├── ToastContent.module.css
│   └── ToastContent.tsx
├── ToastShell/
│   ├── ToastShell.module.css
│   └── toast.tsx
├── ToastViewport/
│   └── ToastViewport.tsx
├── constants/
│   ├── AdminPanel/
│   │   ├── ToastMessages.ts
│   │   └── ToastMessagesList.ts
│   ├── Dashboard/
│   │   ├── ToastMessages.ts
│   │   └── ToastMessagesList.ts
│   ├── index.ts
│   └── types.ts
├── index.ts
└── types.ts
```

## Reglas de constants

- La carpeta `constants` debe contener todas las toast alerts del proyecto para `Admin Panel` y `Dashboard`.
- `constants/types.ts` debe definir la estructura de cada mensaje individual.
- Cada mensaje individual debe tener esta forma:

```ts
type ToastMessageType = {
  id: string
  status: string
  title: string
  description: string
}
```

- `ToastMessagesList.ts` de cada módulo debe contener la lista de mensajes individuales exportables del módulo.
- `ToastMessages.ts` de cada módulo debe contener el objeto final agrupado por severidad.
- `constants/index.ts` debe exportar todos los objetos finales de toast para que puedan consumirse desde cualquier parte del proyecto.

## Forma del objeto final por módulo

Cada módulo debe exportar su catálogo final con esta forma:

```ts
export const TOAST_<MODULE_NAME> = {
  success: {},
  error: {},
  info: {}
}
```

- Las keys internas deben representar la acción de negocio.
- Los mensajes individuales deben agruparse bajo la severidad que corresponda.
- El ejemplo funcional de referencia es:

```ts
export const TOAST_REPROCESSING = {
  success: {},
  error: {
    send_reprocessing: SEND_REPROCESSING_ERROR
  },
  info: {}
}
```

## Catálogo obligatorio

### Admin Panel

Se deben contemplar los siguientes mensajes:

- `T-19` Bienvenido / Tu validación fue verificada exitosamente. / `Success`
- `T-20` Usuario creado / `[Nombre Apellido]` fue agregado al sistema. / `Success`
- `T-21` Usuario actualizado / `[Nombre Apellido]` fue modificado correctamente. / `Success`
- `T-22` Contraseña actualizada / La contraseña fue cambiada correctamente. / `Success`
- `T-23` Dominio agregado / `"[dominio]"` fue agregado a los dominios permitidos. / `Success`
- `T-24` Usuario eliminado / `[Nombre Apellido]` fue eliminado del sistema. / `Danger`
- `T-25` Dominio duplicado / Este dominio ya está en la lista. / `Danger`
- `T-26` Email no permitido / Solo se aceptan emails con los dominios institucionales configurados. / `Danger`
- `T-27` Dominio eliminado / `"[dominio]"` fue removido de los dominios permitidos. / `Info`

### Dashboard

Se deben contemplar los siguientes mensajes:

- `T-01` Bienvenida, `{nombre}` / Tu validación fue verificada exitosamente. / `Success`
- `T-02` CUIT marcado en reproceso / El contribuyente fue enviado a reproceso. / `Error`
- `T-03` Agregado al lote / El CUIT fue marcado para el lote `{nombre}`. / `Success`
- `T-04` Cargando perfil... / Estamos abriendo el perfil del contribuyente. / `Info`
- `T-05` Buscando... / Estamos buscando el contribuyente ingresado. / `Info`
- `T-06` Marcado como relevante / El contribuyente fue destacado correctamente. / `Success`
- `T-07` Enviado a reproceso / El contribuyente fue enviado a reproceso. / `Error`
- `T-08` CUIT quitado de reproceso / El contribuyente fue removido del reproceso. / `Success`
- `T-09` Generando cruces... / Los cruces seleccionados están siendo procesados. / `Info`
- `T-10` Domicilio agregado / El nuevo domicilio fue guardado correctamente. / `Success`
- `T-11` Domicilio actualizado / Los cambios fueron guardados correctamente. / `Success`
- `T-12` Domicilio eliminado / El registro fue removido. / `Error`
- `T-13` Contacto agregado / El contacto fue guardado correctamente. / `Success`
- `T-14` Contacto actualizado / Los cambios fueron guardados correctamente. / `Success`
- `T-15` Contacto eliminado / El registro fue removido. / `Error`
- `T-16` Nota agregada / La nota fue guardada correctamente. / `Success`
- `T-17` Nota actualizada / Los cambios fueron guardados correctamente. / `Success`
- `T-18` Nota eliminada / El registro fue removido. / `Error`

## Reglas visuales

- Fondo blanco en las tres variantes.
- Borde de `1px` sólido `#E9ECEF`.
- Borde izquierdo de `4px` del color de la variante.
- Radio `8px`.
- Padding `13px 16px`.
- Gap interno de `11px` entre ícono y texto.
- Ancho máximo `320px`.
- Sombra `0 8px 36px rgba(67,117,238,.14)`.
- Tipografía heredada de `DM Sans`.

## Reglas de comportamiento

- Posición fija en esquina inferior derecha: `bottom: 24px`, `right: 24px`, `z-index: 300`.
- Duración `4500ms` con cierre automático.
- Si entra una toast nueva, el contenido visible debe reemplazarse y el timer reiniciarse.
- Debe existir una sola instancia visible; no hay stack.
- El botón de cierre manual debe estar siempre visible.
- La entrada debe animar con subida de `20px` y fade-in.
- La salida debe ser la transición inversa.
- La toast no debe bloquear la UI.

## Tipos de severidad

- `success`: acciones constructivas confirmadas.
- `danger`: acciones destructivas o rechazos de validación.
- `info`: cambios neutros o feedback informativo.

## Regla de fuente de verdad

- Si existe contradicción entre documentación funcional y prototipo visual, para este sistema de toast manda esta spec.
- En particular, el caso de eliminar usuario debe implementarse como toast `danger` en esquina inferior derecha.
