## Rules Batch Management

## Objetivo

Implementar la vista de `Gestión de Lotes` dentro del dashboard general, respetando la referencia visual provista y manteniendo consistencia con la arquitectura actual del proyecto.

## Reglas de arquitectura

1. La implementación debe seguir la arquitectura modular del proyecto.
2. La vista de `Gestión de Lotes` debe vivir en su propio módulo funcional dentro de `src/modules/`.
3. La página de Next debe limitarse a montar el módulo; la lógica, presentación y mocks deben vivir dentro del módulo.
4. La implementación debe reutilizar el `dashboard-layout` ya existente y no debe duplicar navbar ni sidebar.

## Reglas de componentes UI

1. Se debe priorizar el uso de componentes de Mantine UI en toda la implementación.
2. Solo se permite usar CSS Modules para estilos o detalles que Mantine no resuelva de forma suficiente.
3. En el HTML de referencia, la primera clase de cada elemento define el componente base que debe usarse en React.
4. El mapeo debe respetarse de esta forma:
   - `Stack` -> `Stack` de Mantine
   - `Group` -> `Group` de Mantine
   - `Title` -> `Title` de Mantine
   - `Text` -> `Text` de Mantine
   - `Button` -> `Button` de Mantine
   - `Input` / `Input-wrapper` -> `TextInput` o componente de input de Mantine correspondiente
   - `Table` / `Table-wrapper` -> `Table` de Mantine
   - `Badge` -> `Badge` de Mantine
   - `ActionIcon` -> `ActionIcon` de Mantine
   - `Menu` / `Dropdown-menu` -> `Menu` de Mantine
5. No se deben reemplazar estos componentes por `div` genéricos si Mantine ya cubre el caso.

## Reglas de layout

1. El contenedor general del módulo debe ser un `Stack` con `gap="xl"`.
2. El header del módulo debe componerse con un `Group` con `justify="space-between"`.
3. El bloque de título y subtítulo debe ser un `Stack` con `gap="xs"`.
4. El botón `Nuevo Lote` debe renderizarse visualmente en el header del módulo.
5. En esta iteración, el botón `Nuevo Lote` puede quedar sin funcionalidad real o con un stub controlado, pero no debe abrir todavía un flujo final de creación.

## Reglas de buscador

1. El bloque del buscador debe usar un `Group` con separación equivalente a `gap="md"`.
2. El input de búsqueda debe usar un componente Mantine con icono a la izquierda.
3. El placeholder debe ser `Buscar por número de lote...`.
4. El buscador debe filtrar en local sobre datos mock.
5. Debe mostrarse al lado del input un contador de lotes visibles.
6. Si la búsqueda no devuelve resultados, debe renderizarse un fallback explícito dentro de la tabla.

## Reglas de tabla

1. La estructura principal del listado debe ser una tabla.
2. No debe reemplazarse la tabla por un `Accordion` de Mantine como contenedor principal.
3. Cada lote debe renderizarse como una fila principal dentro de la tabla.
4. Cada fila principal debe poder expandirse y contraerse para mostrar una fila de detalle debajo, con comportamiento tipo accordion.
5. El estado expandido debe manejarse por lote.
6. La fila expandida puede usar contenido mock en esta iteración.

## Reglas de item de lote

1. Cada fila principal debe incluir:
   - chevron de expansión
   - número de lote
   - nombre
   - descripción
   - cantidad de CUITs
   - fecha
   - action icon final
2. La cantidad de CUITs debe renderizarse con `Badge`.
3. La action final debe renderizarse con `ActionIcon`.
4. Si existe menú contextual de acciones, debe resolverse con `Menu` de Mantine.
5. El contenido de períodos, cruces o acciones avanzadas todavía no debe considerarse cerrado funcionalmente; en esta iteración puede quedar mockeado o fuera de alcance según necesidad de implementación.

## Reglas de datos

1. En esta iteración se deben usar datos mock.
2. La búsqueda debe operar sobre esos mocks en cliente.
3. La estructura mock debe permitir:
   - identificación única de lote
   - nombre
   - descripción
   - fecha
   - cantidad de CUITs
   - contenido expandible

## Reglas de alcance

1. El foco de esta iteración es:
   - header
   - buscador
   - contador
   - tabla
   - filas expandibles
2. Queda fuera de alcance por ahora:
   - modal final de creación de lote
   - contrato backend real
   - persistencia real
   - flujos definitivos de cruces

## Validación

1. La vista debe respetar la referencia visual general del spec.
2. Debe mantenerse consistente con la paleta y componentes Mantine ya usados en dashboard.
3. La interacción expandir/contraer debe funcionar sin romper la estructura de tabla.
4. La implementación debe evitar HTML ad hoc cuando ya exista un componente Mantine equivalente.
