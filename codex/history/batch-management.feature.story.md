# Batch Management Feature Story

## 2026-06-11 Fix apertura de Nuevo Lote

- Se corrigio la apertura del modal desde el boton `Nuevo Lote` para que el `MouseEvent` de React no llegue como `initialLoadedCuits`.
- `useBatchManagement` expone ahora un handler sin argumentos para el header, y `BatchManagementNavbarAction` invoca explicitamente el callback.
- Se agrego una defensa runtime en el estado/filtro de CUITs cargados para que `filteredLoadedCuits` siempre resuelva como array.
- Se agrego cobertura de regresion para `filterLoadedBatchCuits` cuando recibe una entrada no array.

### Validation

- `bun run test -- src/modules/batch-management/presentation/utils/batchManagementLoadedCuits.test.ts`
- `bun x eslint src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/hooks/batch-management/useBatchManagementLoadedCuits.ts src/modules/batch-management/presentation/utils/batchManagementLoadedCuits.ts src/modules/batch-management/presentation/utils/batchManagementLoadedCuits.test.ts src/modules/batch-management/presentation/components/BatchManagementPage/BatchManagementNavbarAction/index.tsx`
- `bun run test -- src/modules/batch-management`

## 2026-06-11 Paginador de lotes

- Se agrego un footer de paginacion a la tabla de `Gestion de Lotes` con rango visible, selector de filas por pagina y `Pagination` de Mantine.
- `useBatchManagementBatches` conserva ahora `page`, `itemsPerPage`, `totalBatches` y `totalPages` del contrato de `/api/lotes`.
- `useBatchManagementSearch` reutiliza la busqueda activa al cambiar de pagina o de cantidad de filas, reiniciando a pagina 1 cuando cambia el page size.
- El mock de `BatchManagementSource` respeta `page` e `itemsPerPage` para mantener comportamiento equivalente en desarrollo local.

### Validation

- `bun x eslint src/modules/batch-management/presentation/constants/batchManagementPage.ts src/modules/batch-management/presentation/utils/batchManagementBatches.ts src/modules/batch-management/presentation/hooks/batch-management/useBatchManagementBatches.ts src/modules/batch-management/presentation/hooks/batch-management/useBatchManagementSearch.ts src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/components/BatchManagementTable/index.tsx src/modules/batch-management/data/sources/mock/MockBatchManagementSource.ts`
- `bun x tsc --noEmit`
- `bun x jest src/modules/batch-management/presentation/hooks/batch-management/useBatchManagementBatches.test.ts --runInBand`
- `curl -I -s --max-time 2 http://localhost:3000/gestion-de-lotes` respondio `307 /login`, esperado para la ruta privada sin sesion.

## 2026-06-11 Loader al seleccionar lote

- Se agrego `loadingBatchId` al hook `useBatchManagementBatches` para representar la hidratacion del detalle del lote seleccionado.
- La tabla de Gestion de Lotes muestra un `Loader` en la celda del chevron y en el panel expandido mientras se consulta el detalle con `getBatchDetailAction`.
- Se agrego cobertura para validar que el lote seleccionado queda en loading durante la consulta y vuelve a `null` al resolver.

### Validation

- `bun x tsc --noEmit`
- `bun x eslint src/modules/batch-management/presentation/components/BatchManagementTable src/modules/batch-management/presentation/hooks`
- `bun x jest src/modules/batch-management/presentation/hooks --runInBand`

## 2026-06-06 Refactor de BatchManagementPage

- `app/(private)/gestion-de-lotes/page.tsx` ahora delega la carga inicial a `BatchManagementModule`, dejando la ruta reducida a composición y manteniendo el layout de datos dentro del módulo.
- `useBatchManagement` pasó a ser una fachada chica que orquesta hooks dedicados para lotes, búsqueda, creación y cruces; la lógica pesada quedó segmentada siguiendo responsabilidad única.
- La CTA de `DashboardNavbarActionPortal` salió de `BatchManagementPage` a `BatchManagementNavbarAction`, y la barra de búsqueda quedó aislada en `BatchManagementSearchBar`.
- `BatchManagementTable` se partió en fila, detalle, estado vacío, menú de cruces y secciones internas; el hook de cruces también se desacopló entre filtros y ejecución.
- `BatchManagementCreateModal` se dividió en formulario, toolbar, tabla de CUITs, preview de importación y hooks auxiliares; el `ref` del input oculto quedó separado del resto del view-model para evitar acoplamiento con render.
- Las funciones puras del módulo se movieron a `presentation/utils` y los datos estáticos a `presentation/constants`, evitando mezclar lógica, valores fijos y componentes.
- La preview de importación ahora resetea su estado por remount controlado del modal en lugar de `setState` dentro de un `effect`, alineando el flujo con React y eliminando warnings del lint.

### Validation

- `bun x tsc --noEmit`
- `bun x eslint app/'(private)'/gestion-de-lotes/page.tsx src/modules/batch-management`
- `git diff --check`
- `curl -I -s http://localhost:3000/gestion-de-lotes` responde `307 /login` con `x-auth-session-expired: true`, así que no hubo validación visual autenticada en esta pasada.

## Cambio

- Se conecto la pagina `Gestion de Lotes` con la action server-side del modulo para cargar la primera pagina de `/api/lotes`.
- Se dejo `batch-management` usando fuente REST por defecto; el mock queda disponible solo con `NEXT_PUBLIC_USE_MOCK_BATCH_MANAGEMENT=true`.
- Se alineo la serializacion REST con Swagger: query params `Busqueda`, `Pagina`, `ItemsPagina` y form-data `Nombre`, `Descripcion`, `Regimen`, `Archivo`, `Cuits`.
- Se actualizo `.env.example` para apuntar el backend local a `http://localhost:5001`.

## Decisiones

- La ruta privada no expone token al cliente: la obtencion de lotes sigue pasando por server actions y `getServerAuthSession`.
- Se mantiene la UI existente de `BatchManagementPage`; solo cambia la fuente de datos.
- Se conserva fallback local a `http://localhost:5001` para evitar que la feature vuelva a mocks por falta de env local.

## Validacion

- `bun x tsc --noEmit --incremental false`
- `bun x eslint app/'(private)'/gestion-de-lotes/page.tsx src/modules/batch-management/data/data-access.ts src/modules/batch-management/data/sources/rest/RestBatchManagementSource.ts`

## 2026-06-05 Previsualizacion de carga de lote

- Se reviso Swagger para `POST /api/lotes/previsualizaciones`: `multipart/form-data` con `Archivo`, `Regimen` y `Cuits`.
- Se ajusto la serializacion de `Cuits` para enviar cada CUIT como entrada form-data independiente, alineado al array publicado por Swagger.
- `BatchManagementCreateModal` ahora muestra el error devuelto por la previsualizacion en el bloque de CUITs en lugar de fallar silenciosamente.
- El flujo se mantiene contractual: seleccionar Excel, procesar con API de previsualizacion, confirmar y poblar la tabla interna con los CUITs validos de la respuesta.
- Si la previsualizacion devuelve un CUIT invalido con `cuitNormalizado`, la preview ofrece esa version como opcion seleccionable antes de confirmar la importacion.
- Se completo `POST /api/lotes` para creacion real: el mapper acepta `numeroLote` o `numeroFormateado`, se muestran errores del backend y se refresca el listado para obtener el `id` real del lote creado.
- Se corrigio el flujo final de creacion para que `POST /api/lotes` use la tabla interna como fuente de verdad: el Excel solo se envia a previsualizacion y no se reenvia en la creacion.
- Se cambio el logging REST a JSON expandido para evitar `formDataEntries: [Object]` y poder auditar cada campo enviado.
- Se endurecio el mapper de lotes para aceptar `razonSocial`, `RazonSocial` o `razon_social` tanto en previsualizacion como en detalle.
- Se corrigio la creacion de lote para que `POST /api/lotes` envie todos los CUITs cargados y no solo los visibles por el filtro de busqueda interno.

### Validation

- `bun x tsc --noEmit --incremental false`
- `bun x eslint app/'(private)'/gestion-de-lotes/page.tsx src/modules/batch-management/data/sources/rest/RestBatchManagementSource.ts src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/components/BatchManagementPage/index.tsx src/modules/batch-management/presentation/components/BatchManagementCreateModal/index.tsx`
- `bun x eslint src/modules/batch-management/presentation/components/BatchManagementCreateModal/index.tsx src/modules/batch-management/presentation/hooks/useBatchManagement.ts`
- `bun x eslint src/modules/batch-management/data/sources/rest/dtos/BatchManagementDtos.ts src/modules/batch-management/data/sources/rest/mappers/mapBatchDto.ts src/modules/batch-management/data/sources/rest/RestBatchManagementSource.ts src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/components/BatchManagementPage/index.tsx src/modules/batch-management/presentation/components/BatchManagementCreateModal/index.tsx`
- `bun x eslint src/modules/batch-management/data/sources/rest/RestBatchManagementSource.ts src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/components/BatchManagementCreateModal/index.tsx`
- `bun x eslint src/modules/batch-management/data/sources/rest/dtos/BatchManagementDtos.ts src/modules/batch-management/data/sources/rest/mappers/mapBatchDto.ts`
- `bun x eslint src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/components/BatchManagementCreateModal/index.tsx src/modules/batch-management/presentation/components/BatchManagementPage/index.tsx`

## 2026-06-05 Ejecucion de cruces desde lotes

- Se reviso Swagger para `POST /api/procesos-informacion/cruces/{codigoCruce}/ejecuciones`: request JSON con `versionCruce`, `tipoOrigen`, `loteId`, `contribuyenteId`, `periodoInicio`, `periodoFin` y `parametros`.
- Se agrego la operacion `executeBatchCross` al puerto del modulo, source REST, mock source, DTOs, mappers y server action.
- `BatchManagementTable` ahora confirma contra la API antes de redirigir a `Gestion de Cruces`, mostrando loading y errores por lote.
- El flujo envia ejecuciones por lote con `tipoOrigen: "por_lote"`, `loteId`, fechas `YYYY-MM-DD` y sin `contribuyenteId`.
- Se bloqueo con mensaje explicito cualquier cruce no disponible en el catalogo actual del backend; Swagger/backend expone el contrato ejecutable `desvio-bi-convenio-multilateral` version `1.0.0`.
- Se distinguio entre `{codigoCruce}` publico de API (`desvio-bi-convenio-multilateral`) y codigos legacy de `TipoCruce` del catalogo para mantener el mapeo interno sin enviarlo como parametro no declarado.
- El menu de lotes ahora muestra solo cruces con contrato publico ejecutable; se ocultaron las opciones legacy pendientes de API para evitar errores de seleccion no accionables.

### Validation

- `bun x tsc --noEmit --incremental false`
- `bun x eslint src/modules/batch-management/data/models/BatchManagement.ts src/modules/batch-management/data/interfaces/BatchManagementSource.ts src/modules/batch-management/data/actions/commands/executeBatchCrossAction.ts src/modules/batch-management/data/actions/index.ts src/modules/batch-management/data/sources/rest/dtos/BatchManagementDtos.ts src/modules/batch-management/data/sources/rest/mappers/mapBatchDto.ts src/modules/batch-management/data/sources/rest/RestBatchManagementSource.ts src/modules/batch-management/data/sources/mock/MockBatchManagementSource.ts src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/components/BatchManagementPage/index.tsx src/modules/batch-management/presentation/components/BatchManagementTable/index.tsx`
- `bun x eslint src/modules/batch-management/presentation/hooks/useBatchManagement.ts`
- `bun x eslint src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/components/BatchManagementTable/index.tsx`
- `git diff --check`

## 2026-06-05 Ajuste de select y periodos anuales de cruces

- Se configuro el `Select` del menu de cruces para renderizar el dropdown dentro del mismo contenedor visual, evitando que el click en opciones portaleadas sea interpretado como click externo del menu/modal.
- Los selects del menu de cruces abren hacia abajo dentro del mismo arbol del menu, manteniendo el listado dentro del flujo de configuracion.
- Se extrajo la construccion de periodos a `batchCrossPeriods` y se dejo explicito que un rango anual `Desde 2024` / `Hasta 2024` serializa `periodoInicio: 2024-01-01` y `periodoFin: 2024-12-31`.
- Se agregaron pruebas unitarias para rangos anuales de un mismo año y de multiples años.

### Validation

- `bun x jest src/modules/batch-management/presentation/utils/batchCrossPeriods.test.ts --runInBand`
- `bun x eslint src/modules/batch-management/presentation/components/BatchManagementTable/index.tsx src/modules/batch-management/presentation/hooks/useBatchManagement.ts src/modules/batch-management/presentation/utils/batchCrossPeriods.ts src/modules/batch-management/presentation/utils/batchCrossPeriods.test.ts`
- `bun x tsc --noEmit`
