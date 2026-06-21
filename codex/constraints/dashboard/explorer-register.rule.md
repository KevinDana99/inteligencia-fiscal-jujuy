## Rules Explorer Register

1. La implementación debe seguir la arquitectura modular por feature ya establecida en el proyecto.
2. `Explorar Padrón` debe implementarse como un módulo propio e independiente del shell de navegación:
   - `src/modules/explorer-register/`
3. El módulo debe montarse en la ruta visible:
   - `/explorar-padron`
4. El sidebar debe incorporar un nuevo item:
   - `Explorar Padrón`
5. El item de `Explorar Padrón` debe ubicarse en la sección `analisis`, inmediatamente debajo de `Padrón Unificado`.
6. El navbar debe reflejar la nueva ruta como el resto de los módulos del dashboard.
7. El módulo debe mantener la separación entre:
   - `data`
   - `presentation`
8. En esta iteración, la fuente de datos debe ser mock local.
9. La implementación debe priorizar Mantine UI como base de componentes.
10. Los estilos específicos no cubiertos por Mantine deben resolverse con JSX y CSS Modules, sin incorporar otras librerías de UI.

## Estado inicial

11. La pantalla debe iniciar sin opciones de columnas/filtros seleccionadas.
12. Ninguna pill debe venir activa por defecto.
13. No deben mostrarse filtros dinamicos por defecto; solo aparecen al seleccionar una pill.
14. Antes de ejecutar una búsqueda, la tabla debe mostrar el fallback inicial:
    - `Seleccioná columnas/filtros arriba y presioná Buscar para poblar el cuadro.`

## Pills y filtros

15. La pantalla debe contener tres bloques:
    - sección pills
    - sección filtros
    - sección tabla resultados
16. Las pills controlan qué filtros se muestran y qué columnas se renderizan.
17. Al activar una pill, deben mostrarse el filtro y la columna asociados.
18. Al desactivar una pill:
    - debe ocultarse la columna asociada
    - debe ocultarse el filtro asociado
    - debe limpiarse el valor del filtro asociado
19. El botón `Limpiar filtros` debe restablecer el estado default sin columnas, pills ni filtros seleccionados.
20. `Limpiar filtros` también debe limpiar el estado de resultados de tabla y volver al fallback inicial.
21. Estos cambios deben actualizar el render inmediatamente a partir de estado derivado y render reactivo normal.
22. No debe resolverse esta lógica con `useEffect`.

## Búsqueda y resultados

23. La búsqueda y el filtrado deben operar sobre data mock local en esta iteración.
24. Los resultados deben poblarse únicamente al ejecutar la acción `Buscar`.
25. Si una búsqueda no devuelve coincidencias, la tabla debe mostrar:
    - `No se encontro coincidencias para la busqueda realizada`
26. Cada resultado encontrado debe ingresar por default al estado de `seleccionado` para la futura creación de lote.
27. El click sobre una fila no debe ejecutar ninguna acción.
28. La `X` de cada fila debe deseleccionar ese resultado del estado final de seleccionados.
29. Al deseleccionar un resultado con la `X`, ese cambio debe reflejarse de inmediato en la UI y en el conjunto final que alimentará la acción de crear lote.

## Crear lote

30. El navbar del módulo debe renderizar un botón:
    - `Crear lote con X resultados`
31. El valor `X` debe leer la cantidad actual de resultados seleccionados.
32. En esta iteración, el botón solo debe quedar preparado para abrir un modal.
33. El flujo del modal de creación de lote no debe implementarse todavía en esta iteración.
