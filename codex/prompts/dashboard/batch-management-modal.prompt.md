## Prompt Batch Management Modal Update

Implementar la iteración de actualización del modal `Crear nuevo lote` dentro de `Gestión de Lotes`, respetando:

- `codex/specs/dashboard/batch-management.spec.md`
- `codex/constraints/dashboard/batch-management.rule.md`
- la sección `## Update Modal Lotes` de la spec

### Objetivo

Reemplazar la estructura visual anterior del modal de creación de lote por la nueva versión definida en `newModal.png`, manteniendo conectadas las funcionalidades y contratos ya implementados para:

- preview de importación Excel
- carga manual de CUITs
- creación de lote

### Alcance

Implementar únicamente el update del modal de creación de lote:

1. Nuevo header del modal
2. Nuevo body del formulario
3. Nuevo bloque de carga de CUITs
4. Nueva tabla interna de CUITs cargados
5. Nuevo footer del modal
6. Adaptación del flujo visual para convivir con:
   - importación Excel con preview
   - carga manual de CUIT
   - creación final de lote

### Reglas obligatorias

1. Mantener la arquitectura actual del módulo `batch-management`.
2. No reabrir ni rehacer la capa de contratos ya integrada.
3. El modal debe conectarse a los handlers, actions y estado actuales del módulo.
4. Priorizar Mantine UI en toda la implementación.
5. Usar CSS Modules solo para detalles de estilo no cubiertos por Mantine.
6. La primera clase del HTML de referencia sigue definiendo el componente base cuando aplique.
7. No introducir `useEffect` para sincronizaciones derivadas del formulario.

### Reglas funcionales

1. El modal debe seguir permitiendo crear un lote manualmente desde `Gestión de Lotes`.
2. El campo `Nombre del lote` debe seguir comportándose como hoy:
   - editable
   - en mayúsculas
3. El campo `Tipo de contribuyente` debe seguir conectado al estado actual del formulario.
4. El campo `Descripción del lote` debe seguir conectado al estado actual del formulario.
5. El botón `Importar Excel` debe seguir usando el flujo contractual ya integrado:
   - selector nativo de archivo
   - preview
   - confirmación
6. Al confirmar la preview de importación, los CUITs válidos deben poblar la nueva tabla interna del modal.
7. El botón `Cargar CUIT` debe mostrar el input manual para agregar CUITs al conjunto cargado.
8. La tabla interna del modal debe reflejar el estado actual de CUITs seleccionados/cargados.
9. El contador `X CUITs cargados` debe leer directamente la cantidad actual del estado.
10. El botón `Cargar lote` debe seguir usando el flujo contractual ya integrado para crear el lote.

### Modo futuro desde Explorar Padrón

1. La spec contempla un modo futuro donde el modal puede venir desde `Explorar Padrón`.
2. En esta iteración no hace falta implementar ese flujo completo.
3. Solo debe preservarse la estructura del modal de modo que luego pueda soportar:
   - bloque informativo de tipo de contribuyente no editable
   - variante de nombre del lote proveniente de ese flujo

### Fuera de alcance

- rediseñar nuevamente el preview modal de importación
- rehacer contratos REST
- cambiar las actions ya integradas
- implementar el flujo completo desde `Explorar Padrón`
- redefinir las rules del módulo

### Archivos esperados

- actualización del componente del modal actual dentro de `src/modules/batch-management/`
- actualización de sus estilos asociados
- ajustes mínimos en hook o wiring solo si hacen falta para soportar la nueva estructura visual

### Validación

1. El modal debe verse alineado con `codex/assets/design/dashboard/batch-management/newModal.png`.
2. Debe seguir funcionando el flujo de importación ya integrado.
3. Debe seguir funcionando el flujo de creación ya integrado.
4. La tabla interna del modal debe reemplazar correctamente al textarea viejo como representación visible de los CUITs cargados.
5. La implementación no debe degradar el resto del módulo `Gestión de Lotes`.
