## Prompt Reprocessing Modal

Implementar el modal `Enviar a reproceso` siguiendo:

- `codex/specs/dashboard/reprocessing-modal.spec.md`
- `codex/constraints/dashboard/reprocessing-modal.rule.md`

## Objetivo

Construir un modal del dominio `reprocessing`, reutilizable desde otros módulos por props, sin convertirlo en un componente shared genérico y sin conectar todavía backend, provider ni flujo cross-module real.

## Alcance de esta iteración

Implementar únicamente:

1. la estructura visual completa del modal
2. el estado local del textarea opcional
3. apertura/cierre por props o handlers externos
4. callback desacoplado para `Confirmar reproceso`

No implementar todavía:

- contratos backend
- provider global
- sincronización real entre módulos
- persistencia de la descripción

## Props mínimas esperadas

- `contribuyenteId`
- `cuit`
- `razonSocial`
- `opened`
- `onClose`
- `onConfirm`

## UI obligatoria

1. Badge visual `🔴 En Reproceso`
2. Título `Agregar descripción`
3. Subtítulo dinámico con formato:
   - `<cuit> — <razonSocial>`
4. Label:
   - `Motivo / Descripción (opcional)`
5. Textarea multilinea con placeholder:
   - `Ej: Pendiente revisión de coeficientes, desvío detectado en período 2024...`
6. Hint:
   - `Esta descripción aparecerá en la pantalla de Reproceso.`
7. Alert:
   - `El CUIT quedará marcado como pendiente de investigación profunda.`
8. Footer con:
   - `Cancelar`
   - `Confirmar reproceso`

## Comportamiento

1. `Cancelar` debe cerrar el modal y no ejecutar ninguna acción adicional.
2. `Confirmar reproceso` debe ejecutar `onConfirm` con los datos necesarios, pero sin acoplarse todavía a contratos reales.
3. El textarea:
   - es opcional
   - es multilinea
   - conserva saltos de línea
   - puede quedar vacío
   - no requiere validación dura en esta iteración

## Arquitectura

1. El modal debe vivir dentro de `src/modules/reprocessing/`.
2. La lógica funcional debe extraerse a un hook del propio componente cuando corresponda.
3. No duplicar la implementación dentro de `cross-management` ni `unified-register`.
4. La pieza debe quedar lista para que más adelante se conecte a provider o server action sin reestructurar la UI.

## Criterios de entrega

1. Implementación visual alineada al spec.
2. Componente reutilizable por props.
3. Sin introducir capa `shared` para esta feature.
4. Mantine UI como base.
5. CSS Modules para el detalle visual.
