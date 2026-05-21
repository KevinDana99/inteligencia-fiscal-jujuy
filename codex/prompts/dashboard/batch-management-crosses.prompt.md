## Prompt Batch Management Crosses Update

Implementar la iteración de actualización del menú de cruces por lote dentro de `Gestión de Lotes`, respetando:

- `codex/specs/dashboard/batch-management.spec.md`
- `codex/constraints/dashboard/batch-management.rule.md`
- la sección `## Update Menu Cruces` de la spec

### Objetivo

Reemplazar el menú actual de cruces del item de lote por la nueva versión con secciones `Mensual` y `Anual`, manteniendo el flujo dentro del módulo `batch-management` y preparando el estado para redirigir a `Gestión de Cruces`.

### Alcance

Implementar únicamente:

1. Nuevo layout del menú de cruces
2. Sección `Mensual`
3. Sección `Anual`
4. Rango de período por bloque
5. Selección independiente de tipos de cruce por bloque
6. Validación de rango
7. Confirmación y redirección a `Gestión de Cruces`

### Reglas obligatorias

1. Mantener la arquitectura actual del módulo `batch-management`.
2. No crear un módulo nuevo para este flujo.
3. Priorizar Mantine UI en toda la implementación.
4. Usar CSS Modules solo para los detalles de estilo no cubiertos por Mantine.
5. No reabrir la capa de contratos en esta iteración.
6. No usar `useEffect` para sincronización derivada del estado.

### Reglas funcionales

1. El menú debe abrir desde el item de lote existente.
2. Las secciones `Mensual` y `Anual` deben arrancar cerradas por defecto.
3. El usuario debe poder desplegar una, la otra o ambas al mismo tiempo.
4. `Mensual` debe exponer:
   - mes `Desde`
   - año `Desde`
   - mes `Hasta`
   - año `Hasta`
   - checks solo de cruces mensuales
5. `Anual` debe exponer:
   - año `Desde`
   - año `Hasta`
   - checks solo de cruces anuales
6. Los valores iniciales deben ser:
   - `Mensual`: mes actual + año actual en `Desde` y `Hasta`
   - `Anual`: año actual en `Desde` y `Hasta`
7. Ambos bloques deben mantener estado independiente, pero compartiendo una estructura de datos uniforme.
8. No deben renderizarse opciones fuera de la ventana permitida:
   - máximo 5 años hacia atrás
   - máximo el año actual
9. Si el usuario arma un rango inválido donde `Desde > Hasta`, debe mostrarse:
   - `Debes especificar un rango válido para realizar el cruce`
10. `Confirmar` debe permanecer bloqueado hasta que exista al menos un cruce seleccionado en el estado.
11. `Mensual` y `Anual` pueden configurarse al mismo tiempo.
13. En esta iteración, `Confirmar` debe:
   - redirigir al usuario a `Gestión de Cruces`

### Integración esperada

1. No implementar todavía la consulta real al backend desde este flujo.
2. No persistir configuración temporal del cruce en `sessionStorage`, `localStorage` ni mecanismos equivalentes desde `Gestión de Lotes`.
3. La integración backend real se hará cuando esta branch se combine con la branch de `Gestión de Cruces`.

### Fuera de alcance

- backend real de cruces desde este menú
- persistencia definitiva del estado en servidor
- rediseñar el resto del módulo `Gestión de Lotes`
- crear nuevas rules o nueva spec

### Archivos esperados

- actualización del componente de tabla/menú del item de lote
- actualización de estilos asociados
- ajustes mínimos en hook o estado del módulo para soportar la nueva estructura del menú

### Validación

1. El menú debe verse alineado con `codex/assets/design/dashboard/batch-management/crossing-modal.png`.
2. Los checks de `Mensual` y `Anual` deben ser independientes.
3. El botón `Confirmar` no debe habilitarse sin selección.
4. La validación de rango debe impedir configuraciones inválidas.
5. La confirmación debe redirigir a `Gestión de Cruces` sin romper el flujo del lote.
