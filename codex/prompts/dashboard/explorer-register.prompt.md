## Prompt Explorer Register

Implementá el módulo `Explorar Padrón` siguiendo la arquitectura modular del proyecto y las definiciones de:

- `codex/specs/dashboard/explorer-register.spec.md`
- `codex/constraints/dashboard/explorer-register.rule.md`

### Objetivo

Construir la pantalla base de `Explorar Padrón` como un módulo independiente, con pills, filtros configurables, tabla de resultados sobre data mock y estado reactivo de seleccionados para la futura creación de lotes.

### Alcance de esta iteración

1. Crear el módulo:
   - `src/modules/explorer-register/`
2. Montar la pantalla en la ruta:
   - `/explorar-padron`
3. Agregar el item `Explorar Padrón` al sidebar del dashboard en la sección `analisis`, inmediatamente debajo de `Padrón Unificado`.
4. Asegurar que el navbar refleje correctamente esta nueva ruta.
5. Implementar la pantalla con tres bloques:
   - sección pills
   - sección filtros
   - sección tabla resultados
6. Dejar activos por defecto:
   - `CUIT`
   - `Nombre / Razón Social`
   - `Rubro`
   - `Actividad`
7. Hacer que las pills controlen:
   - qué filtros se muestran
   - qué columnas se renderizan
8. Al apagar una pill:
   - ocultar columna asociada
   - ocultar filtro asociado
   - limpiar su valor
   - actualizar resultados inmediatamente
9. Implementar botón `Limpiar filtros` para restaurar el estado default y volver al fallback inicial de tabla.
10. Implementar botón `Buscar` para poblar la tabla de resultados sobre data mock local.
11. Antes de buscar, la tabla debe mostrar:
    - `Seleccioná columnas/filtros arriba y presioná Buscar para poblar el cuadro.`
12. Si la búsqueda no encuentra coincidencias, mostrar:
    - `No se encontro coincidencias para la busqueda realizada`
13. Todos los resultados encontrados deben pasar por default a estado `seleccionado`.
14. El click sobre una fila no debe hacer nada.
15. La `X` de cada fila debe deseleccionar ese resultado del conjunto final.
16. El navbar del módulo debe renderizar un botón:
    - `Crear lote con X resultados`
17. `X` debe leer la cantidad actual de resultados seleccionados.

### Restricciones

1. Priorizar Mantine UI como base de componentes.
2. Mantener la separación entre `data` y `presentation`.
3. Resolver la reactividad con estado derivado y render normal de React 19.
4. No usar `useEffect` para sincronizar pills, filtros, columnas o seleccionados.
5. No implementar todavía el modal final de `Crear lote con X resultados`.

### Resultado esperado

Al finalizar, debe existir:

- un módulo funcional de `Explorar Padrón`
- nueva entrada en sidebar y navbar consistente
- pills y filtros reactivos
- tabla con fallback inicial, no resultados y resultados mock
- estado de seleccionados preparado para la futura creación de lotes
