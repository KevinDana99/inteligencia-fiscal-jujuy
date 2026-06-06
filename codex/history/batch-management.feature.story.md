# Batch Management Feature Story

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
