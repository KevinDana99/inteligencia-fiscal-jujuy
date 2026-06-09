# Toast Prompt

Implementar o refactorizar el sistema global de toast del proyecto respetando la spec `codex/specs/dashboard/toast.spec.md` y las reglas de `codex/constraints/dashboard/toast.rule.md`.

## Objetivo

Consolidar un sistema de toast global reutilizable para `Admin Panel` y `Dashboard`, manteniendo `@mantine/notifications` como base técnica y respetando la arquitectura establecida en `src/components/core/toasts`.

## Requisitos obligatorios

1. Mantener la estructura exacta del sistema de toast:

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

2. Definir en `src/components/core/toasts/constants/types.ts` el tipo base de mensaje con esta estructura:

```ts
type ToastMessageType = {
  id: string
  status: string
  title: string
  description: string
}
```

3. Implementar en cada `ToastMessagesList.ts` los mensajes individuales del módulo.

4. Implementar en cada `ToastMessages.ts` el objeto final agrupado por severidad del módulo, con esta forma:

```ts
export const TOAST_<MODULE_NAME> = {
  success: {},
  error: {},
  info: {}
}
```

5. Exportar todos los catálogos finales desde:
- `src/components/core/toasts/constants/index.ts`
- y exponerlos también desde `src/components/core/toasts/index.ts` si corresponde al diseño actual del sistema.

## Reglas de naming

- Los mensajes individuales deben ser constantes exportadas en mayúsculas.
- Las keys internas del objeto final deben describir la acción de negocio en `snake_case`.
- Los objetos finales por módulo deben nombrarse explícitamente por dominio, por ejemplo:
  - `TOAST_ADMIN_PANEL`
  - `TOAST_DASHBOARD`
  - `TOAST_REPROCESSING` si más adelante se agrega un subcatálogo específico dentro de dashboard.

## Catálogo obligatorio a cargar

### Admin Panel

Cargar estos mensajes:
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

Cargar estos mensajes:
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

## Reglas visuales y de comportamiento

Implementar o preservar estas condiciones:
- fondo blanco
- borde `1px solid #E9ECEF`
- borde izquierdo `4px` del color de la variante
- radio `8px`
- padding `13px 16px`
- gap `11px`
- ancho máximo `320px`
- sombra `0 8px 36px rgba(67,117,238,.14)`
- tipografía heredada de `DM Sans`
- posición fija en esquina inferior derecha
- una sola instancia visible
- reemplazo de contenido si llega una nueva toast
- timer reiniciado al reemplazar contenido
- cierre manual visible
- transición de entrada y salida con desplazamiento vertical de `20px` y fade

## Restricciones

- No agregar una librería distinta a `@mantine/notifications`.
- No cambiar el ownership del sistema fuera de `src/components/core/toasts`.
- No implementar todavía el consumo desde módulos si la tarea actual es solo estructurar spec/rules/prompt.
- No mezclar mensajes individuales con el catálogo final del módulo en el mismo archivo.

## Resultado esperado

Al terminar esta tarea de implementación futura, debe existir:
- un tipo estructural común de mensaje
- una lista de mensajes individuales por módulo
- un objeto final agrupado por severidad por módulo
- un export global de todos los catálogos de toast
- un sistema visual de toast alineado con la spec
