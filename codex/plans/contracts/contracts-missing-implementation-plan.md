# Plan de implementación de contratos faltantes

## Objetivo

Completar la integración backend de los módulos que hoy siguen mock-only o parcialmente conectados, manteniendo el patrón actual del repo:

- `data/models`
- `data/interfaces`
- `data/sources/mock`
- `data/sources/rest`
- `data/data-access`
- `data/actions`
- integración en `presentation`

---

## Módulos faltantes

1. `dashboard configuration` (`/configuracion`)
2. `explorer-register`
3. `cross-management`
4. `unified-register`

---

## Orden recomendado

### 1. Dashboard Configuration

Primero este, porque:

- ya existe UI funcional
- hoy parece local-only
- el impacto arquitectónico es acotado
- destraba persistencia real de configuración

### 2. Explorer Register

Después este, porque:

- conceptualmente es listado + filtros
- sirve como base para `unified-register`
- probablemente alimente o comparta contratos con padrón

### 3. Cross Management

Después este, porque:

- también es listado + detalle
- puede depender de datos ya presentes en explorer/lotes
- el preview hoy está totalmente mock

### 4. Unified Register

Último, porque:

- es el módulo más grande
- tiene detalle complejo
- usa muchas secciones internas
- puede depender de decisiones previas de explorer y cruces

---

## Implementación por módulo

### 1. Dashboard Configuration

#### Estado actual

- UI implementada
- lógica local
- preview PDF funcional
- no se ve contrato backend real para persistencia

#### Objetivo

Implementar contratos para:

- obtener configuración actual
- guardar configuración de documentos
- eventualmente versionar o distinguir tipos de documento

#### Tareas

1. definir modelos de request/response
2. crear `IDashboardConfigurationSource`
3. crear `RestDashboardConfigurationSource`
4. mantener mock source equivalente
5. crear `data-access`
6. crear actions:
   - `getDashboardConfigurationAction`
   - `updateDashboardConfigurationAction`
7. conectar página `/configuracion` a datos reales
8. hacer que preview use estado persistido o estado del form según flujo definido

#### Riesgos

- decidir qué parte del preview depende de datos persistidos vs datos en edición local
- no romper la UX actual del editor

---

### 2. Explorer Register

#### Estado actual

- solo mock
- no tiene `actions`
- no tiene `data-access`
- no tiene `rest source`

#### Objetivo

Conectar:

- listado
- filtros
- búsqueda
- selección o acciones disponibles desde exploración

#### Tareas

1. definir contrato HTTP del listado
2. modelar:
   - request params
   - response items
   - filtros disponibles si vienen del backend
3. crear `IExplorerRegisterSource`
4. crear `RestExplorerRegisterSource`
5. crear `MockExplorerRegisterSource`
6. crear `data-access`
7. crear actions:
   - `getExplorerRegisterAction`
8. refactor de la page para consumir datos server-side
9. mover filtrado al backend si corresponde

#### Riesgos

- hoy parte del filtrado puede estar solo en cliente
- hay que definir si el backend devuelve filtros o solo data

---

### 3. Cross Management

#### Estado actual

- solo mock
- listado y preview local
- `CrossPreviewPage` usa fixture directo

#### Objetivo

Conectar:

- listado de cruces
- filtros
- detalle de cruce

#### Tareas

1. definir contrato de listado de cruces
2. definir contrato de detalle de cruce
3. modelar:
   - `ICrossManagementSource`
   - DTOs
   - mappers
4. crear `RestCrossManagementSource`
5. mantener mock source espejo
6. crear `data-access`
7. crear actions:
   - `getCrossManagementAction`
   - `getCrossDetailAction`
8. sacar dependencia directa del fixture en preview
9. conectar navegación de listado a detalle real

#### Riesgos

- decidir si preview es solo lectura o si ya requiere acciones
- evitar dejar el detalle medio mock y medio real

---

### 4. Unified Register

#### Estado actual

- parcialmente estructurado
- sigue mock-only
- detalle complejo
- preview consume fixtures y lógica local

#### Objetivo

Conectar:

- listado de padrón
- detalle por CUIT
- acciones disponibles del detalle según contratos reales

#### Tareas

1. definir contrato de listado
2. definir contrato de detalle
3. separar claramente:
   - item liviano
   - detail
4. crear `IUnifiedRegisterSource`
5. crear `RestUnifiedRegisterSource`
6. mantener `MockUnifiedRegisterSource`
7. crear `data-access`
8. crear actions:
   - `getUnifiedRegisterAction`
   - `getUnifiedRegisterItemByCuitAction`
   - otras acciones si el detalle ya tiene contratos
9. revisar qué acciones del preview son reales y cuáles siguen mock:
   - agregar a lote
   - generar informe
   - cruces
   - reproceso
10. dejar las que no tengan contrato explícitamente mockeadas pero aisladas

#### Riesgos

- es el módulo con más superficie
- tiene mucha UI ya montada
- fácil mezclar datos reales con mocks sin un boundary claro

---

## Reglas de implementación

### 1. Un módulo por vez

No mezclar dos módulos en la misma iteración.

### 2. Contrato primero

Antes de tocar UI:

- request
- response
- errores
- shape de modelos

### 3. Mock espejo del backend

El mock debe replicar:

- shape
- códigos de error
- comportamiento esencial

### 4. Build por iteración

Después de cada módulo:

- `npm run build`

### 5. Validación manual

Después de cada integración:

- smoke manual
- comparar mock vs rest
- verificar estados vacíos, error, success

---

## Prioridad operativa

### Fase 1

- `dashboard configuration`

### Fase 2

- `explorer-register`

### Fase 3

- `cross-management`

### Fase 4

- `unified-register`

---

## Criterio de cierre por módulo

Un módulo se considera cerrado cuando:

- tiene `rest source`
- tiene `mock source`
- tiene `data-access`
- tiene `actions`
- no consume fixtures directos desde presentation
- pasa `npm run build`
- el flujo principal funciona manualmente
