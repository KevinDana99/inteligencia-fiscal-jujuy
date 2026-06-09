## Toast Spec

## Reglas

- Se deben usar las Toast como ya estan implementadas usando `@mantine/notifications`.
- Para los mensajes de las Toast, crear una carpeta `constants` donde se encuentren todas las Toast Alerts del proyecto, las de `Admin Panel` y `Dashboard`.
- Respetar la estructura pactada en esta spec y la arquitectura dada.

## Estructura de directorios

├── toasts
│ ├── ToastContent
│ │ ├── ToastContent.module.css
│ │ └── ToastContent.tsx
│ ├── ToastShell
│ │ ├── ToastShell.module.css
│ │ └── toast.tsx
│ ├── ToastViewport
│ │ └── ToastViewport.tsx
│ ├── constants
│ │ ├── AdminPanel
│ │ │ ├── ToastMessages.ts
│ │ │ └── ToastMessagesList.ts
│ │ ├── Dashboard
│ │ │ ├── ToastMessages.ts
│ │ │ └── ToastMessagesList.ts
│ │ ├── index.ts
│ │ └── types.ts
│ ├── index.ts
│ └── types.ts

## Diseño UI

Especificaciones del contenedor
Fondo
#FFFFFF (blanco) en las tres variantes
Borde
1px sólido gray-2 #E9ECEF + borde izquierdo 4px del color de la variante
Radio
radius-md 8px
Padding
13px vertical · 16px horizontal
Gap interno
11px entre ícono y bloque de texto
Ancho máximo
320px
Sombra
shadow-xl → 0 8px 36px rgba(67,117,238,.14)
Tipografía
DM Sans (heredada del sistema)

Posición, duración y animación
Reglas de comportamiento comunes a las 9 instancias. No hay excepciones por variante.

Posición
Fija en esquina inferior derecha: bottom: 24px · right: 24px · z-index: 300
Duración
4.500 ms y se cierra solo (auto-dismiss). El timer se reinicia si aparece un toast nuevo.
Cierre manual
Botón X siempre visible. Cierra de inmediato sin esperar el timer.
Entrada
Sube 20px + fade-in: transform .4s cubic-bezier(.22,1,.36,1), opacity .4s
Salida
Misma transición invertida (baja 20px + fade-out)
Apilado
No hay stack: existe una sola instancia. Si llega un toast nuevo mientras otro está visible, el contenido se reemplaza y el timer se reinicia.
Interacción
No bloquea la UI. pointer-events: none oculto, all visible.
Corrección a la documentación funcional: el CU-005 describe el toast de eliminar usuario en la "parte inferior izquierda" y como "toast de éxito". En el prototipo (fuente de verdad de diseño) ese toast aparece en la esquina inferior derecha como todos los demás, y es de variante danger (rojo). Implementar según esta hoja; el documento de CU será corregido.

## Tipos

Tipos de toast
Tres variantes según la naturaleza del feedback. El tipo se pasa como primer parámetro de showToast(type, title, msg).

Usuario creado
Juan Pérez fue agregado al sistema.

Success — Éxito
Confirma que una acción constructiva se completó correctamente: crear, actualizar, agregar, validar.

Borde e ícono:
--m-green-6 #2F9E44
Ícono: check en círculo · Tipo:
'success'
Usuario eliminado
Carlos Gómez fue eliminado del sistema.

Danger — Destructivo / Rechazo
Comunica acciones destructivas confirmadas (eliminar usuario) o rechazos de validación (dominio duplicado, email no permitido).

Borde e ícono:
--m-red-5 #FA5252
Ícono: tacho de basura · Tipo:
'danger'
Dominio eliminado
"@ejemplo.gob.ar" fue removido de los dominios permitidos.

Info — Informativo
Confirma cambios de configuración neutros que no son ni constructivos ni destructivos para cuentas de usuario.

Borde e ícono:
--m-cyan-6 #0891B2
Ícono: info en círculo · Tipo:
'info'

## Toast Messages

- La ruta donde debemos listar los mensajes de las toast es esta:

Admin-Panel: `src/components/core/toasts/constants/AdminPanel/ToastMessages.ts`
Dashboard: `src/components/core/toasts/constants/Dasboard/ToastMessages.ts`

- Cada objeto de mensaje debe tener la siguiente estructura:

EXAMPLE:

```ts
// Debe estar impleemntado en src/components/core/toasts/constants/types.ts
type ToastMessageType = {
  id: string
  status: string
  title: string
  description: string
}

// Objeto de mensajes en lista
// debe estar implementado en src/components/core/toasts/constants/Dashboard/ToastMessagesList.ts

const SEND_REPROCESSING_ERROR: ToastMessageType = {
  id: 'T-02',
  status: 'Error'
  title: "CUIT marcado en reproceso",
  description: "El contribuyente fue enviado a reproceso."
}

// Objeto de mensajes exportables final
// debe estar exportado en este directorio src/components/core/toasts/constants/index.ts
// Este objeto debe estar implementado en : src/components/core/toasts/constants/Dashboard/ToastMessages.ts
export const TOAST_REPROCESSING {
  success: {}
  error: {
    send_reprocessing: SEND_REPROCESSING_ERROR
  }
  info: {}
}
```

- Admin-Panel:
  | ID | Title | Description | Status |
  |:---|:---|:---|:---|
  | T-19 | Bienvenido | Tu validación fue verificada exitosamente. | Success |
  | T-20 | Usuario creado | [Nombre Apellido] fue agregado al sistema. | Success |
  | T-21 | Usuario actualizado | [Nombre Apellido] fue modificado correctamente. | Success |
  | T-22 | Contraseña actualizada | La contraseña fue cambiada correctamente. | Success |
  | T-23 | Dominio agregado | "[dominio]" fue agregado a los dominios permitidos. | Success |
  | T-24 | Usuario eliminado | [Nombre Apellido] fue eliminado del sistema. | Danger |
  | T-25 | Dominio duplicado | Este dominio ya está en la lista. | Danger |
  | T-26 | Email no permitido | Solo se aceptan emails con los dominios institucionales configurados. | Danger |
  | T-27 | Dominio eliminado | "[dominio]" fue removido de los dominios permitidos. | Info |
- Dashboard:
  | ID | Title | Description | Status |
  |:---|:---|:---|:---|
  | T-01 | Bienvenida, {nombre} | Tu validación fue verificada exitosamente. | Success |
  | T-02 | CUIT marcado en reproceso | El contribuyente fue enviado a reproceso. | Error |
  | T-03 | Agregado al lote | El CUIT fue marcado para el lote {nombre}. | Success |
  | T-04 | Cargando perfil... | Estamos abriendo el perfil del contribuyente. | Info |
  | T-05 | Buscando... | Estamos buscando el contribuyente ingresado. | Info |
  | T-06 | Marcado como relevante | El contribuyente fue destacado correctamente. | Success |
  | T-07 | Enviado a reproceso | El contribuyente fue enviado a reproceso. | Error |
  | T-08 | CUIT quitado de reproceso | El contribuyente fue removido del reproceso. | Success |
  | T-09 | Generando cruces... | Los cruces seleccionados están siendo procesados. | Info |
  | T-10 | Domicilio agregado | El nuevo domicilio fue guardado correctamente. | Success |
  | T-11 | Domicilio actualizado | Los cambios fueron guardados correctamente. | Success |
  | T-12 | Domicilio eliminado | El registro fue removido. | Error |
  | T-13 | Contacto agregado | El contacto fue guardado correctamente. | Success |
  | T-14 | Contacto actualizado | Los cambios fueron guardados correctamente. | Success |
  | T-15 | Contacto eliminado | El registro fue removido. | Error |
  | T-16 | Nota agregada | La nota fue guardada correctamente. | Success |
  | T-17 | Nota actualizada | Los cambios fueron guardados correctamente. | Success |
  | T-18 | Nota eliminada | El registro fue removido. | Error |
