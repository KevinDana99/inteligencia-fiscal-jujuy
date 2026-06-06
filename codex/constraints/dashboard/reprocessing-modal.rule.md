## Rule Reprocessing Modal

Implementar el modal `Enviar a reproceso` como componente del dominio `reprocessing`, reutilizable desde otros módulos por props, sin convertirlo en un primitive shared genérico.

## Requisitos

1. El modal debe vivir en `src/modules/reprocessing/`.
2. Debe usar Mantine UI como base.
3. CSS Modules solo para estilos puntuales no cubiertos por Mantine.
4. Debe usar Tabler Icons.
5. No debe depender de contratos backend en esta iteración.
6. No debe depender todavía de provider global.
7. No debe implementar sincronización cross-module real en esta iteración.

## Props mínimas

1. `contribuyenteId`
2. `cuit`
3. `razonSocial`

## UI obligatoria

1. Badge `🔴 En Reproceso`
2. Título `Agregar descripción`
3. Subtítulo dinámico `<cuit> — <razonSocial>`
4. Textarea `Motivo / Descripción (opcional)`
5. Hint `Esta descripción aparecerá en la pantalla de Reproceso.`
6. Alert informativa sobre investigación profunda
7. Botón `Cancelar`
8. Botón `Confirmar reproceso`

## Comportamiento en esta iteración

1. `Cancelar` cierra el modal y no hace nada más.
2. `Confirmar reproceso` representa la intención de enviar el caso a reproceso, pero no debe conectarse todavía a backend ni a flujo real entre módulos.
3. El textarea debe ser opcional.
4. El textarea debe permitir multilinea y conservar saltos de línea.
5. El textarea puede quedar vacío.
6. No aplicar validación dura sobre el textarea.

## Arquitectura

1. El owner funcional del modal es `reprocessing`.
2. Otros módulos deben consumirlo desde `reprocessing`, no duplicarlo localmente.
3. Toda lógica futura de provider o server actions debe poder acoplarse a una única implementación.
