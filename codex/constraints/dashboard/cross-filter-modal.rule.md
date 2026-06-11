## Rule Cross Filter Modal

Implementar el modal de filtros numéricos para `Gestión de Cruces`, disparado desde columnas específicas de la tabla `Análisis sistémico por CUIT`, con estado persistente por columna y resolución real vía server action hacia backend.

## Alcance

1. El modal se abre solo desde el icono/flecha de estas columnas:
   - `B.I. 910 ▾`
   - `B.I. PRETENDIDA ▾`
   - `DIFERENCIA ▾`
   - `IMPUESTO ESTIMADO ▾`
   - `NETO A PAGAR ▾`
2. No debe abrirse desde:
   - `CUIT`
   - `RAZÓN SOCIAL`
   - `ESTADO`

## UI obligatoria

1. Header con:
   - título dinámico `Filtrar <Nombre de columna>`
   - subtítulo `Mostrar filas donde:`
   - botón cerrar
2. Bloque `Condición 1`
3. Bloque `Conector lógico`
4. Bloque `Condición 2 (opcional)`
5. Footer con:
   - `Limpiar`
   - `Cancelar`
   - `Aplicar`

## Comportamiento

1. `Aplicar` debe disparar una server action.
2. La server action debe realizar request al backend con los filtros de la columna correspondiente.
3. La respuesta backend debe actualizar la tabla con los resultados filtrados.
4. `Limpiar` debe:
   - limpiar el formulario
   - eliminar los filtros activos de esa columna
   - actualizar la tabla removiendo ese filtro
5. `Cancelar` debe cerrar el modal sin modificar el estado aplicado.

## Persistencia del estado

1. Cada columna filtrable debe tener su propia instancia lógica de filtro.
2. Al reabrir el modal de una columna, debe mostrarse el último estado aplicado de esa columna.
3. Ese estado solo debe resetearse si el usuario usa `Limpiar`.
4. El estado del modal debe mantenerse sincronizado con lo que devuelva el backend en cada request.

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
3. El estado del filtro no debe resolverse con lógica local aislada del resultado backend.
4. La implementación debe quedar preparada para escalar a contratos reales de filtros por columna.
