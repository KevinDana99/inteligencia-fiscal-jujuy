## Prompt Unified Register Dashboard

Implementá la iteración de dashboard detalle de `Padrón Unificado` siguiendo:

- `codex/specs/dashboard/unified-register-dashboard.spec.md`
- `codex/constraints/dashboard/unified-register.rule.md`

### Objetivo

Sobrescribir la pantalla actual de:

- `/vista-previa-padron/[cuit]`

para convertirla en el dashboard detalle de `Padrón Unificado`, manteniendo la navegación actual desde el click en la card del listado.

### Alcance de esta iteración

1. Mantener la navegación existente:
   - click en card del listado
   - ruta `/vista-previa-padron/[cuit]`
2. Resolver el detalle usando el mismo mock actual del listado de `Padrón Unificado`.
3. Si el `CUIT` no existe en ese mock:
   - resolver con `notFound()`
4. Implementar la estructura del dashboard detalle según la spec visual.
5. Implementar los controles del header:
   - `Marcar reproceso`
   - `Cruces a realizar`
   - `Generar informe`
   - `Agregar lote`
6. En esta iteración, esos controles deben abrir sus modales o paneles correspondientes, pero sin conectar todavía la acción final de negocio.
7. Todos esos modales o paneles deben trabajar con mock local.
8. Implementar `AddressCard`, `ContactCard` y `NotesCard` con comportamiento mock local:
   - agregar
   - editar
   - eliminar
   - actualización reactiva del estado de pantalla
9. `Agregar lote` debe abrir un selector o modal mock:
   - con listado de lotes mock
   - con buscador mock
10. `Marcar reproceso` no debe manejar todavía un toggle funcional local:
   - solo abre su modal mock

### Restricciones

1. No cambiar el trigger de navegación desde el listado.
2. No recrear la acción `Ver análisis completo` en el menú del listado.
3. No conectar todavía estos flujos a contratos reales.
4. Usar mock local para el detalle y para los modales/paneles de esta iteración.
5. Mantener la arquitectura modular del proyecto.
6. Mantener la separación entre:
   - `data`
   - `presentation`
7. Priorizar Mantine UI.
8. Usar `Tabler Icons`.
9. Si se necesita mapping o reutilización de iconos, centralizar en:
   - `src/global/icons`

### Fuente de datos de esta iteración

1. El detalle debe partir del mismo contribuyente mock que hoy existe en el listado principal.
2. Si hace falta más información para widgets, tablas o cards:
   - enriquecer ese mismo mock base
   - siempre asociado al mismo `CUIT`
3. No crear una fuente desconectada del listado si el detalle puede colgar del mismo universo mock.

### Resultado esperado

Al finalizar debe existir:

- la pantalla `/vista-previa-padron/[cuit]` implementada como dashboard detalle
- resolución por `CUIT` desde el mock actual del listado
- `notFound()` para `CUIT` inexistente
- modales/paneles mock del header
- `AddressCard`, `ContactCard` y `NotesCard` con CRUD mock local
- selector mock de lotes con buscador mock

### No hacer

- No cambiar la navegación del listado.
- No dejar la pantalla actual placeholder en `/vista-previa-padron/[cuit]`.
- No conectar `Marcar reproceso`, `Cruces a realizar`, `Generar informe` o `Agregar lote` a contratos reales todavía.
- No duplicar una acción `Ver análisis completo`.
