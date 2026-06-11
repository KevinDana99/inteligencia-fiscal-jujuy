## Prompt Cross Filter Modal

Implementar el modal de filtros numéricos para `Gestión de Cruces` siguiendo:

- `codex/specs/dashboard/cross-filter-modal.spec.md`
- `codex/constraints/dashboard/cross-filter-modal.rule.md`

## Objetivo

Construir el modal de filtros por columna dentro de la tabla `Análisis sistémico por CUIT`, con persistencia de estado por columna y resolución real a través de server actions hacia backend.

## Alcance

Implementar únicamente el modal para estas columnas:

- `B.I. 910 ▾`
- `B.I. PRETENDIDA ▾`
- `DIFERENCIA ▾`
- `IMPUESTO ESTIMADO ▾`
- `NETO A PAGAR ▾`

No implementar apertura desde:

- `CUIT`
- `RAZÓN SOCIAL`
- `ESTADO`

## UI obligatoria

1. Header con:
   - título dinámico `Filtrar <Nombre de columna>`
   - subtítulo `Mostrar filas donde:`
   - botón cerrar
2. Sección `Condición 1`
3. Sección `Conector lógico`
4. Sección `Condición 2 (opcional)`
5. Footer con:
   - `Limpiar`
   - `Cancelar`
   - `Aplicar`

## Comportamiento

1. `Aplicar` debe disparar una server action.
2. La action debe enviar al backend los filtros de la columna correspondiente.
3. La respuesta backend debe actualizar la tabla con los resultados filtrados.
4. `Limpiar` debe:
   - limpiar el formulario
   - eliminar el filtro activo de esa columna
   - actualizar la tabla removiendo ese filtro
5. `Cancelar` solo debe cerrar el modal sin alterar el último estado aplicado.

## Persistencia por columna

1. Cada columna filtrable debe conservar su propio estado de filtro.
2. Al reabrir el modal de una columna, el formulario debe reflejar el último estado aplicado de esa columna.
3. El estado solo se resetea si el usuario usa `Limpiar`.
4. El estado del filtro debe mantenerse sincronizado con la respuesta backend.

## Tipos de valor

1. El input numérico debe aceptar:
   - enteros
   - decimales
   - negativos
2. Ejemplos válidos:
   - `1000`
   - `25.5`
   - `-10`

## Arquitectura

1. Usar Mantine UI como base.
2. Complementar con CSS Modules para el detalle visual.
3. No resolver este modal con filtrado local aislado de la respuesta backend.
4. Mantener la implementación dentro del módulo `cross-management`.
5. Dejar la pieza lista para futuros contratos backend de catálogo de operadores por columna.

## Criterios de entrega

1. Modal alineado visualmente con la referencia.
2. Integración desde los triggers permitidos en el header de columnas.
3. Estado persistente por columna.
4. Wiring a server actions preparado para consumir backend real.
