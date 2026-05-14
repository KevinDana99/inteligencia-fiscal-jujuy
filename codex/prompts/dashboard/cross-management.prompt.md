## Prompt Cross Management

Implementá el módulo de `Gestión de Cruces` dentro del dashboard privado siguiendo la spec `codex/specs/dashboard/cross-management.spec.md` y las reglas de `codex/constraints/dashboard/cross-management.rule.md`.

### Objetivo

Construir la pantalla de listado de cruces con:

1. título y subtítulo
2. buscador por texto
3. filtro por período
4. filtro por rango de días
5. contador de resultados
6. tabla de cruces
7. navegación desde cada fila a una subruta dinámica de preview
8. estado vacío cuando no existan resultados

### Requisitos de implementación

1. Crear un módulo propio para el feature:
   - `src/modules/cross-management/`
2. Seguir la arquitectura del proyecto:
   - `data`
   - `presentation`
3. Resolver la iteración actual sobre data mock local.
4. Usar Mantine UI como base para layout, inputs, selects, tabla, badges y textos.
5. Usar CSS Modules solo para estilos específicos no cubiertos correctamente por Mantine.

### Routing

1. La pantalla principal debe vivir en la ruta actual de `Gestión de Cruces`.
2. Todas las filas de la tabla deben ser clickeables.
3. Al hacer click en una fila, debe navegar a una subruta dinámica de Next con esta estructura:
   - `/gestion-de-cruces/vista-previa-cruce/[crossId]`
4. La carpeta de ruta debe mantenerse en español.
5. El módulo puede mantenerse en inglés.
6. En esta iteración, la subruta dinámica debe quedar creada y preparada para recibir params, aunque la vista final del detalle todavía no esté completamente definida.

### Comportamiento esperado

1. El buscador debe filtrar localmente por nombre del cruce, lote o CUIT.
2. Los filtros de período y rango de días deben combinarse con el texto de búsqueda.
3. Cualquier cambio en cualquiera de esos controles debe actualizar inmediatamente la tabla.
4. No debe existir distinción entre filas clickeables y no clickeables.
5. Si no hay resultados, debe mostrarse:
   - `No se encontraron cruces asociados`

### Resultado esperado

Entregar una primera implementación funcional de `Gestión de Cruces`, visualmente alineada a la referencia `cross-management.png`, con filtrado local reactivo, tabla navegable y estructura de subruta dinámica preparada para la futura pantalla preview del cruce.
