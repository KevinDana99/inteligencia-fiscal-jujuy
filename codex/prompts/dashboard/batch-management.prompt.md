## Prompt Batch Management

Implementar la primera iteración de `Gestión de Lotes` dentro del dashboard general, respetando:

- `codex/specs/dashboard/batch-management.spec.md`
- `codex/constraints/dashboard/batch-management.rule.md`

### Objetivo

Construir la vista inicial del módulo de gestión de lotes con:

- header de sección
- botón `Nuevo Lote`
- buscador local
- contador de resultados
- tabla de lotes
- filas expandibles tipo accordion dentro de la tabla

### Alcance

Implementar únicamente:

1. Contenedor general del módulo
2. Header con:
   - título `Gestión de Lotes`
   - subtítulo `Administrá los lotes de CUITs para análisis fiscal`
   - botón `Nuevo Lote`
3. Bloque de búsqueda con:
   - input con icono
   - placeholder `Buscar por número de lote...`
   - contador de lotes visibles
4. Tabla de lotes con datos mock
5. Fila expandible por lote
6. Fallback cuando no haya resultados

### Reglas obligatorias

1. Priorizar Mantine UI en toda la implementación.
2. Usar CSS Modules solo para estilos puntuales no cubiertos por Mantine.
3. La primera clase del HTML de referencia define el componente base que debe mapearse.
4. La estructura principal debe seguir siendo una tabla.
5. No reemplazar la tabla por un `Accordion` de Mantine.
6. La expansión debe resolverse como:
   - fila principal
   - fila de detalle debajo
   - comportamiento tipo accordion

### Datos

Usar mocks locales para esta iteración.

Cada lote debe incluir al menos:

- `id`
- `batchNumber`
- `name`
- `description`
- `cuitCount`
- `createdAt`
- `details`

### Comportamiento

1. El buscador debe filtrar en cliente.
2. El contador debe actualizarse según resultados visibles.
3. Si no hay coincidencias, renderizar un estado vacío dentro de la tabla.
4. Cada lote debe poder expandirse y contraerse.
5. El botón `Nuevo Lote` puede quedar con stub visual en esta iteración; no hace falta implementar todavía el modal final.

### Fuera de alcance

- modal final de creación
- integración backend real
- contrato REST
- persistencia
- lógica definitiva de cruces
- menú funcional final para acciones avanzadas

### Archivos esperados

- módulo funcional de gestión de lotes dentro de `src/modules/`
- componentes de presentación separados por responsabilidad
- hooks de presentación si hace falta manejar búsqueda o expansión
- mocks locales dentro del módulo

### Validación

1. La vista debe montarse dentro del dashboard existente.
2. Debe respetar la referencia visual general.
3. Debe usar Mantine UI como base real de implementación.
4. Debe haber scroll, tabla, expansión y búsqueda funcionando sin romper el layout existente.
