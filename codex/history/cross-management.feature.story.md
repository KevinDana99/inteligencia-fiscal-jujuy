# Cross Management Feature Story

## 2026-06-18 Preview solo con resultados y resumen

- La carga inicial de `/gestion-de-cruces/vista-previa-cruce/[crossId]` ahora consulta solo `resultados-cruces` y `resumen`.
- Se elimino el uso de `/planilla` y del listado `/ejecuciones` como fallback dentro de `getCrossPreviewAction`.
- La tabla `Planilla` se construye desde `resultados-cruces`, conservando columnas visuales, CUIT, razon social, `taxpayerId` y metricas principales.
- La recarga/paginacion de `Planilla` ahora usa `getCrossResultsAction`; la busqueda de la tabla queda local sobre los resultados cargados.
- Se removio el helper de enriquecimiento de planilla con resultados, porque `resultados-cruces` paso a ser fuente principal y no refuerzo.

### Validation

- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/eslint src/modules/cross-management/data/actions/queries/getCrossPreviewAction.ts src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.ts src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts src/modules/cross-management/data/sources/mock/MockCrossManagementSource.ts src/modules/cross-management/presentation/hooks/cross-preview/useCrossPreviewPlanillaQuery.ts`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node ./node_modules/jest/bin/jest.js src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts --runInBand`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/tsc --noEmit --incremental false`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node ./node_modules/next/dist/bin/next build` finaliza con `EXIT:0`.

## 2026-06-18 Sidebar activo en preview de cruce

- `/gestion-de-cruces/vista-previa-cruce/<id>` ahora resuelve la seccion activa del dashboard como `Gestión de Cruces`.
- El matcher de seccion contempla subrutas bajo `/gestion-de-cruces`, conservando el item activo del sidebar y el titulo de seccion.
- Se agrego cobertura unitaria para la ruta dinamica de preview de cruce.

### Validation

- `/Users/gastonmorales/.bun/bin/bun x tsc --noEmit --incremental false`
- `/Users/gastonmorales/.bun/bin/bun x eslint src/modules/dashboard-layout/data/models/DashboardLayout.ts src/modules/dashboard-layout/data/models/DashboardLayout.test.ts`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/jest/bin/jest.js src/modules/dashboard-layout/data/models/DashboardLayout.test.ts --runInBand`

## 2026-06-18 Drag and drop de columnas de intimacion

- `Planilla adjunta — Columnas` ahora permite reordenar las columnas seleccionadas con drag and drop desde el icono de agarre.
- Las columnas seleccionadas de `Planilla adjunta — Columnas` se muestran como texto, no como inputs, conservando las acciones de reordenar y quitar.
- El texto de las columnas seleccionadas usa `font-weight: 500`.
- El modal `Elegir columnas de la planilla` tambien permite reordenar la lista de `Columnas visibles` antes de aceptar.
- El selector de columnas ahora usa seleccion multiple con indicador tipo checkbox para pasar varias columnas disponibles o visibles en una sola accion.
- El reordenamiento actualiza `columnas_seleccionadas` conservando el mismo source of truth de configuracion de intimacion.
- Se agrego cobertura unitaria para el helper de reordenamiento compartido.

### Validation

- `/Users/gastonmorales/.bun/bin/bun x tsc --noEmit --incremental false`
- `/Users/gastonmorales/.bun/bin/bun x eslint src/modules/configuration-module/presentation/hooks/intimation-template/useIntimationTemplate.ts src/modules/configuration-module/presentation/hooks/intimation-template/useIntimationTemplateColumns.ts src/modules/configuration-module/presentation/components/IntimationTemplate/IntimationTemplateColumnsSection/index.tsx`
- `/Users/gastonmorales/.bun/bin/bun x eslint src/modules/configuration-module/presentation/constants/intimationTemplateLabels.ts src/modules/configuration-module/presentation/hooks/intimation-template/useIntimationTemplateColumnPicker.ts src/modules/configuration-module/presentation/components/IntimationTemplate/IntimationTemplateColumnPickerModal/useIntimationTemplateColumnPickerModal.ts src/modules/configuration-module/presentation/components/IntimationTemplate/IntimationTemplateColumnPickerModal/IntimationTemplateColumnPickerList/index.tsx`
- `/Users/gastonmorales/.bun/bin/bun x eslint src/modules/configuration-module/presentation/utils/intimationTemplateColumns.ts src/modules/configuration-module/presentation/utils/intimationTemplateColumns.test.ts src/modules/configuration-module/presentation/hooks/intimation-template/useIntimationTemplateColumns.ts src/modules/configuration-module/presentation/hooks/intimation-template/useIntimationTemplateColumnPicker.ts src/modules/configuration-module/presentation/components/IntimationTemplate/IntimationTemplateColumnsSection/index.tsx src/modules/configuration-module/presentation/components/IntimationTemplate/IntimationTemplateColumnPickerModal/useIntimationTemplateColumnPickerModal.ts src/modules/configuration-module/presentation/components/IntimationTemplate/IntimationTemplateColumnPickerModal/IntimationTemplateColumnPickerList/index.tsx`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/jest/bin/jest.js src/modules/configuration-module/presentation/utils/intimationTemplateColumns.test.ts --runInBand`
- `/Users/gastonmorales/.bun/bin/bun run lint` queda sin errores y conserva 6 warnings existentes fuera de este cambio.
- `curl -I --max-time 5 http://localhost:3000/gestion-de-cruces/vista-previa-cruce/92` responde `307` a `/login` por sesion expirada.

## 2026-06-18 Iconos en estados del listado

- La columna `Estado` de `/gestion-de-cruces` ahora muestra iconos en sus labels: `Check` para `Completada`, `Clock` para `En proceso` y `X` para `Fallida`.
- La clasificacion de estados del listado se centralizo en `useCrossManagementTableRow`, reutilizando los mismos grupos para color e icono.
- El badge de estado desactiva el uppercase por defecto de Mantine para conservar labels capitalizadas como `Completada`, `En proceso` y `Fallida`.
- El header de la columna `Fecha` del listado ahora se muestra como `Fecha de ejecución`.

### Validation

- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/eslint src/modules/cross-management/presentation/components/CrossManagementTable/CrossManagementTableRow.tsx src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementTableRow.ts`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/eslint src/modules/cross-management/presentation/constants/crossManagementTable.ts`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/tsc --noEmit --pretty false --incremental false`

## 2026-06-17 Opciones dinamicas para columnas de intimacion

- El modal `Elegir columnas de la planilla` ahora recibe un catalogo dinamico construido desde las columnas y filas visibles de la planilla.
- Las opciones disponibles se limitan a columnas que tengan al menos un valor real en la tabla; se excluyen vacios y `-`, pero se conserva `0` como valor valido.
- Se excluyen columnas identificadoras tecnicas como `ID`, `ID 2` e `ID Periodo` aunque tengan valores.
- La configuracion de intimacion acepta opciones externas para resolver labels y descartar columnas configuradas que no existan en el catalogo actual de la planilla.

### Validation

- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node ./node_modules/.bin/jest src/modules/cross-management/presentation/utils/buildIntimationColumnOptionsFromPlanilla.test.ts src/modules/configuration-module/presentation/utils/intimationTemplateState.test.ts --runInBand`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/tsc --noEmit --pretty false --incremental false`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/eslint src/modules/configuration-module/presentation/constants/intimationTemplateColumns.ts src/modules/configuration-module/presentation/utils/intimationTemplateColumns.ts src/modules/configuration-module/presentation/utils/intimationTemplateState.ts src/modules/configuration-module/presentation/utils/intimationTemplateState.test.ts src/modules/configuration-module/presentation/hooks/intimation-template/useIntimationTemplate.ts src/modules/configuration-module/presentation/hooks/intimation-template/useIntimationTemplateColumnPicker.ts src/modules/cross-management/presentation/utils/buildIntimationColumnOptionsFromPlanilla.ts src/modules/cross-management/presentation/utils/buildIntimationColumnOptionsFromPlanilla.test.ts src/modules/cross-management/presentation/hooks/useCrossPreview.ts src/modules/cross-management/presentation/hooks/cross-preview/useCrossPreviewModals.ts src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewModals.tsx src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewPageContent.tsx`
- `git diff --check`
- `curl -I --max-time 5 http://localhost:3000/gestion-de-cruces/vista-previa-cruce/92` responde `307` a `/login` por sesion expirada.

## 2026-06-16 Normalizacion de importes antes del Server Action

- El hook de descarga de intimaciones ahora normaliza el payload final antes de invocar `generateIntimationDocumentAction`, evitando que la request visible hacia el Server Action conserve importes como `$$ 0`.
- El Server Action vuelve a normalizar el payload recibido antes de loguear y antes de delegar al source REST, por lo que los logs de ambiente muestran la misma version saneada que se envia al backend.
- Se mantiene la normalizacion defensiva del source REST para cubrir llamadas futuras que no pasen por el hook cliente.

### Validation

- `bun x jest src/modules/cross-management/data/utils/normalizeIntimationDocumentPayload.test.ts src/modules/cross-management/presentation/utils/intimationDocumentPayload.test.ts src/modules/cross-management/presentation/utils/resolveIntimationExportColumnValue.test.ts src/modules/cross-management/presentation/utils/groupIntimationExportContributors.test.ts src/modules/configuration-module/presentation/utils/intimationTemplateState.test.ts --runInBand`
- `bun x eslint src/modules/cross-management/presentation/hooks/intimation-export/useIntimationDocumentDownload.ts src/modules/cross-management/data/actions/commands/generateIntimationDocumentAction.ts src/modules/cross-management/data/sources/rest/RestCrossManagementSource.ts src/modules/cross-management/data/utils/normalizeIntimationDocumentPayload.ts src/modules/cross-management/data/utils/normalizeIntimationDocumentPayload.test.ts`
- `bun x tsc --noEmit --pretty false --incremental false`
- `git diff --check`

## 2026-06-16 Payload de intimacion por contribuyente

- La previsualizacion de intimacion ahora agrupa filas de planilla por contribuyente antes de paginar el modal, evitando tratar periodos del mismo contribuyente como intimaciones separadas.
- `filasPlanilla` se genera con todas las filas asociadas al contribuyente activo y conserva las claves exactas de `columnasSeleccionadas`.
- Los valores exportados normalizan `anio` sin separador de miles y las columnas de base imponible como moneda con prefijo `$`.
- La configuracion de columnas acepta `columnasSeleccionadas` y cae al set default (`anio` + bases imponibles) cuando la configuracion llega sin columnas.
- `snapshotIntimacion.fechaCorte` se normaliza al periodo `MM/YYYY` cuando la plantilla trae el texto completo del pie.

### Validation

- `bun x jest src/modules/cross-management/presentation/utils/intimationDocumentPayload.test.ts src/modules/cross-management/presentation/utils/groupIntimationExportContributors.test.ts src/modules/configuration-module/presentation/utils/intimationTemplateState.test.ts --runInBand`
- `bun x eslint src/modules/cross-management/presentation/utils/intimationDocumentPayload.ts src/modules/cross-management/presentation/utils/intimationDocumentPayload.test.ts src/modules/cross-management/presentation/utils/groupIntimationExportContributors.ts src/modules/cross-management/presentation/utils/groupIntimationExportContributors.test.ts src/modules/cross-management/presentation/utils/resolveIntimationExportColumnValue.ts src/modules/cross-management/presentation/hooks/useCrossPreview.ts src/modules/cross-management/presentation/hooks/cross-preview/useCrossPreviewModals.ts src/modules/cross-management/presentation/hooks/intimation-export/useIntimationExportModal.ts src/modules/cross-management/presentation/hooks/intimation-export/useIntimationExportDocument.ts src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewPageContent.tsx src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewModals.tsx src/modules/cross-management/presentation/components/IntimationExportModal/IntimationExportPreviewDocument.tsx src/modules/cross-management/presentation/components/IntimationExportModal/IntimationExportPreviewTable.tsx src/modules/configuration-module/data/sources/rest/RestConfigurationSource.ts src/modules/configuration-module/data/sources/rest/dtos/ApiConfigurationDtos.ts src/modules/configuration-module/presentation/utils/intimationTemplateState.ts src/modules/configuration-module/presentation/utils/intimationTemplateState.test.ts`
- Browser check: `http://localhost:3000/gestion-de-cruces/vista-previa-cruce/92`, login con `example@example.com`, `Ranking` -> `Generar intimacion` confirma columnas `AÑO`, `Base Imponible Ingresos Brutos`, `Base Imponible Informada por Terceros (*)`, `Diferencia de Base Imponible`; la previsualizacion muestra `2025`, `$ 16.866`, `$ 0`, `$ 937.001` y no registra errores de consola.

## 2026-06-16 Icono check en estado relevante

- Se reemplazo el prefijo textual `✓` del estado `Relevante` en la tabla de ranking de `vista-previa-cruce` por `IconCheck` de `@tabler/icons-react`.
- El texto del `select` ahora queda como `Relevante`; el icono se renderiza superpuesto dentro del pill verde solo para el estado relevante.

### Validation

- `bun x eslint src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewAnalysisStatusSelect.tsx src/modules/cross-management/presentation/constants/crossPreviewStatus.ts`
- `bun x tsc --noEmit --pretty false --incremental false`
- `git diff --check`
- `ctx_search` confirma 0 ocurrencias de `✓` en `src/modules/cross-management`.

## 2026-06-16 Contrato de columnas para generar intimacion

- Se alineo el payload de `POST /api/documentos/intimacion/generar` con Swagger local: `columnasSeleccionadas` ahora viaja en la raiz de la solicitud y `snapshotIntimacion` conserva solo asunto, saludo, cuerpo, fuente y fecha de corte.
- `filasPlanilla` sigue construyendose con las mismas claves seleccionadas para cumplir la validacion backend de coincidencia exacta entre columnas y filas.
- Los logs de generacion ahora cuentan columnas desde el campo raiz del payload.
- Se agrego cobertura unitaria para bloquear regresiones en la forma del request.

### Validation

- `bun x jest src/modules/cross-management/presentation/utils/intimationDocumentPayload.test.ts src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts --runInBand`
- `bun x tsc --noEmit --pretty false --incremental false`
- `bun x eslint src/modules/cross-management/data/actions/commands/generateIntimationDocumentAction.ts src/modules/cross-management/data/models/CrossManagement.ts src/modules/cross-management/data/sources/rest/RestCrossManagementSource.ts src/modules/cross-management/data/sources/rest/dtos/ApiIntimationDocumentDtos.ts src/modules/cross-management/presentation/utils/intimationDocumentPayload.ts src/modules/cross-management/presentation/utils/intimationDocumentPayload.test.ts`
- `git diff --check`
- Browser check: `http://localhost:3000/gestion-de-cruces/vista-previa-cruce/91`, login con `example@example.com`, `Ranking` -> `Generar intimacion` -> seleccionar `AÑO` -> `Descargar Word` finaliza sin alerta visible.
- Backend check directo: con `columnasSeleccionadas: ['anio']` en raiz y `filasPlanilla: [{ anio }]`, `POST /api/documentos/intimacion/generar` responde `201` con `documentoId` y `urlDescarga`.

## 2026-06-16 Busqueda por CUIT formateado en preview

- Se agrego `crossSearch` como utilidad compartida para normalizar busquedas de `cross-management`.
- La busqueda local mock ahora compara texto sin acentos y tambien compara CUITs por sus digitos, permitiendo escribir `20-10000944-8` aunque el contrato guarde `20100009448`.
- El source REST normaliza busquedas tipo CUIT antes de enviarlas como `Busqueda`/`busqueda`, sin alterar terminos textuales como razon social o lote.
- Los headers con filtros activos en el ranking ahora muestran un dot verde junto al nombre de la columna para identificar rapidamente que filtros estan aplicados.
- Los inputs numericos del modal de filtros usan formato visual local con separador de miles `.` y decimal `,`, por ejemplo `900.000,42`, conservando el valor canonico para aplicar el filtro.
- Se cubrio la regresion con tests unitarios para CUIT formateado, texto y payload enviado al API.

### Validation

- `bun x jest src/modules/cross-management/data/utils/crossSearch.test.ts src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts --runInBand`
- `bun x jest src/modules/cross-management/presentation/utils/crossFilterNumber.test.ts --runInBand`
- `bun x eslint src/modules/cross-management/data/utils/crossSearch.ts src/modules/cross-management/data/utils/crossSearch.test.ts src/modules/cross-management/data/sources/mock/MockCrossManagementSource.ts src/modules/cross-management/data/sources/rest/RestCrossManagementSource.ts`
- `bun x eslint src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewAnalysisHeaderCell.tsx`
- `bun x eslint src/modules/cross-management/presentation/components/CrossFilterModal/index.tsx src/modules/cross-management/presentation/utils/crossFilterNumber.ts src/modules/cross-management/presentation/utils/crossFilterNumber.test.ts`
- `bun x tsc --noEmit --pretty false --incremental false`
- `bun run lint` sin errores; persisten 3 warnings existentes fuera de este cambio en `src/modules/cross-management/preview.tsx` y `src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/index.tsx`.
- Browser check: `http://localhost:3000/gestion-de-cruces/vista-previa-cruce/91`, login con `example@example.com`, busqueda `20-10000944-8` devuelve 1 resultado en `Planilla` y 1 resultado en `Ranking`; filtro `B.I. JURISDICCION > 900000` reduce `Ranking` de 8 a 3 filas y muestra 1 dot verde en el header filtrado; el modal muestra `900000.42` como `900.000,42` y `650000` como `650.000`.

## 2026-06-15 Polling del listado de ejecuciones

- Se agrego polling cliente para refrescar cada 5 segundos el listado principal de `Gestion de Cruces`.
- El polling reutiliza `getCrossManagementAction` y mantiene la consulta base de `GET /api/procesos-informacion/ejecuciones` con `Pagina=1` e `ItemsPagina=20`.
- La tabla conserva la carga inicial server-side y los filtros locales existentes, pero ahora filtra sobre la ultima data refrescada por polling.
- El refresco evita requests solapadas, descarta respuestas viejas al desmontar y conserva la ultima data valida ante errores transitorios.

### Validation

- `bun x eslint src/modules/cross-management/constants/crossManagementRequest.ts src/modules/cross-management/presentation/hooks/useCrossManagement.ts src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementPolling.ts`
- `bun x tsc --noEmit --incremental false`

## 2026-06-15 Estado de ejecucion en gestion de cruces

- `Gestion de Cruces` ahora conserva `estado` desde `GET /api/procesos-informacion/ejecuciones` en el modelo interno como `status`.
- La tabla principal agrega la columna `Estado` y renderiza una pill Mantine para estados como `completada`, `en_proceso`, `fallida` y `pendiente`, con fallback neutral para estados no mapeados.
- La tabla permite scroll horizontal en pantallas angostas para evitar cortes al sumar la nueva columna.
- Los mocks del listado incorporan `status` para mantener consistente el contrato interno y permitir ver variantes visuales en modo mock.
- La preview mantiene compatibilidad con `ICrossPreviewData` usando el estado de la ejecucion cuando esta disponible.

### Validation

- `bun x tsc --noEmit --pretty false --incremental false`
- `bun x eslint src/modules/cross-management/data/models/CrossManagement.ts src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.ts src/modules/cross-management/data/sources/rest/mappers/mapCrossManagementDto.ts src/modules/cross-management/data/sources/mock/fixtures/crossItems.ts src/modules/cross-management/presentation/constants/crossManagementTable.ts src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementTableRow.ts src/modules/cross-management/presentation/components/CrossManagementTable/CrossManagementTableRow.tsx`
- `bun run test -- src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts --runInBand`
- `git diff --check`
- Browser check: `http://localhost:3000/gestion-de-cruces` redirige a `/login` por sesion expirada y no registra errores de consola.

## 2026-06-10 Ranking en preview de cruces

- La pestaña secundaria de `/gestion-de-cruces/vista-previa-cruce/[crossId]` ahora se presenta como `Ranking`, con icono de barras y CTA de intimacion preservado.
- `CrossPreviewHeaderCard` muestra `Lote` o `CUIT` segun el origen y agrega el separador visual de metadata del mockup.
- `CrossPreviewSummarySection` formatea importes con `$`, destaca deuda/impuesto/diferencia y soporta filas descriptivas de resumen.
- `CrossPreviewAnalysisSection` agrega columna de ranking, contador `Mostrando...`, footer alineado y valores monetarios destacados segun la referencia visual.
- El mock `cross-1` se actualizo al caso Lote 623 / Regimen General / periodo 2022-2025 con tres contribuyentes relevantes.
- El modal de filtros ahora recibe el tipo de columna para usar entrada de texto en CUIT/razon social y numerica en importes.
- `CrossPreviewPlanSection` ahora usa el titulo `Planilla - {cruce}`, buscador junto al titulo, badge `CUITs · periodo`, footer con contador y oculta la fila de indicadores para coincidir con la referencia de planilla.
- La planilla mock del Lote 623 queda reducida a las 15 columnas visibles y una fila 2023 de TARIFA NIEVES DOMINGA.

### Validation

- `bun x eslint src/modules/cross-management/data/sources/mock/MockCrossManagementSource.ts src/modules/cross-management/data/sources/mock/fixtures/crossItems.ts src/modules/cross-management/presentation/components/CrossFilterModal/index.tsx src/modules/cross-management/presentation/components/CrossFilterModal/useCrossFilterModal.ts src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewAnalysisHeaderCell.tsx src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewAnalysisRow.tsx src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewAnalysisSection.tsx src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewHeaderCard.tsx src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewPageContent.tsx src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewSummarySection.tsx src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewTopBar.tsx src/modules/cross-management/presentation/constants/crossPreviewLabels.ts src/modules/cross-management/presentation/hooks/cross-preview/useCrossPreviewResumenQuery.ts`
- `bun x eslint src/modules/cross-management/data/sources/mock/fixtures/crossItems.ts src/modules/cross-management/presentation/components/CrossPreviewPage/CrossPreviewPlanSection.tsx src/modules/cross-management/presentation/hooks/cross-preview/useCrossPreviewPlanTableClassNames.ts src/modules/cross-management/presentation/constants/crossPreviewLabels.ts`
- `bun x tsc --noEmit --pretty false`
- `bun run test -- src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts --runInBand`
- Browser visual check: bloqueado por `net::ERR_BLOCKED_BY_CLIENT` al abrir `localhost`/`127.0.0.1` en el navegador embebido; el server activo de `3000` recompilo los cambios.

## 2026-06-09 Ajuste responsive del modal de previsualizacion de intimacion

- `IntimationExportModal` ahora limita su alto a `100dvh` con margen seguro y usa layout flex para mantener visibles encabezado, navegacion y footer.
- El alto del modal se estira a toda la pantalla disponible con un espaciado minimo de `10px` contra el viewport.
- El header usa fuentes de `12px`, reduce su alto y fuerza el ancho del modal para evitar cortes visuales.
- Las acciones de descarga corrigen estados hover, disabled y loading para mantener contraste y loaders visibles.
- La descarga de documentos usa `formato=pdf/docx` segun contrato GET, valida `documentoId` y acepta alias de respuesta al generar el documento.
- Se agregaron logs de diagnostico en generacion, proxy de descarga y fetch del cliente para distinguir errores de frontend, proxy o backend sin imprimir token.
- Las filas de planilla se enriquecen con `contribuyenteId` desde `resultados-cruces` por CUIT para generar intimaciones cuando `/planilla` no devuelve UUID.
- El documento mantiene su visualizacion previa: sin cambios de contenido, logo, fecha, tipografia, tabla ni dimensiones internas.

### Validation

- `bun x tsc --noEmit --pretty false --incremental false`
- `bun run test -- src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts --runInBand`
- `bun run lint` sin errores; persisten 4 warnings existentes en `unified-register`.
- `git diff --check`

## 2026-06-09 Contratos de documentos de intimacion en preview

- `CrossPreviewModals` dejó de usar handlers `noop` para PDF/DOCX y ahora coordina la generación/descarga mediante hooks desacoplados.
- Se agregó el comando `generateIntimationDocumentAction` para `POST /api/documentos/intimacion/generar`, con DTOs, modelos, source REST y source mock.
- Se agregó el proxy local `GET /api/documentos/{documentoId}/descargar?formato=...` para descargar binarios con el Bearer token de la sesión server-side.
- El payload de generación se arma en `presentation/utils`: `snapshotIntimacion` usa `asunto`, `saludo`, `cuerpo`, `fuenteInformacion`, `fechaCorte` y `columnasSeleccionadas`; `filasPlanilla` se construye con claves exactas de columnas.
- Las constantes de endpoints, formatos, MIME types y mensajes quedaron separadas en carpetas `constants`.
- Se compatibilizó la lectura de configuración de intimación con el contrato nuevo (`fechaCorte`, `fuenteInformacion`) y se preservó el modelo interno actual.
- Las filas de planilla conservan `contribuyenteId` como `taxpayerId` para cumplir el requisito de UUID del backend al generar intimaciones.

### Validation

- `bunx tsc --noEmit --pretty false --incremental false`
- `bun run test -- src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts --runInBand`
- `bun run lint` sin errores; persisten 4 warnings existentes en `unified-register`.

## 2026-06-05 Integracion Planilla/Resumen en preview

- `/gestion-de-cruces/vista-previa-cruce/[crossId]` ahora carga la vista desde `POST /planilla` y `POST /resumen`, dejando `resultados-cruces` fuera de la preview.
- Se agregaron DTOs, modelos, source methods, actions y mappers para esquemas dinamicos con `textos`, `fechas`, `metricas`, bloques de resumen y analisis sistemico.
- Planilla y Resumen renderizan columnas desde los esquemas del backend; pagina 2+ reutiliza los esquemas recibidos en pagina 1 cuando el backend devuelve `null`.
- Busqueda, filtros por columna y paginacion se ejecutan contra backend con loaders de tabla; se eliminaron hooks/utils de filtrado local y columnas fijas.
- Los filtros del modal se construyen solo desde columnas `esFiltrable` y `operadoresPermitidos`.

### Validation

- `npx tsc --noEmit`
- `npx eslint 'app/(private)/gestion-de-cruces/vista-previa-cruce/[crossId]/page.tsx' src/modules/cross-management`
- `npm test -- src/modules/cross-management/data/mappers/mapCrossPreviewContractToView.test.ts`
- `npm run build`
- `npm run lint -- 'app/(private)/gestion-de-cruces/vista-previa-cruce/[crossId]/page.tsx' src/modules/cross-management` queda bloqueado por deuda existente fuera del modulo: `src/modules/reprocessing/presentation/components/SendToReprocessingModal/useSendToReprocessingModal.ts` y warnings en `unified-register`.

## Cambio

- Se conecto `Gestion de Cruces` con `GET /api/procesos-informacion/ejecuciones` desde la ruta server-side.
- Se agrego soporte de datos para `GET /api/procesos-informacion/ejecuciones/{ejecucionId}/resultados-cruces`.
- Se crearon DTOs, mappers, source REST, source mock, data-access y server actions del modulo `cross-management`.
- Se adapto `CrossManagementPage` para recibir datos iniciales reales y conservar filtros locales de busqueda/rango.
- Se agrego `NEXT_PUBLIC_USE_MOCK_CROSS_MANAGEMENT=false` a `.env.example`.

## Decisiones

- La carga inicial se resuelve en `app/(private)/gestion-de-cruces/page.tsx` usando server actions y sesion Bearer.
- La fuente REST usa los parametros publicados en Swagger: `Busqueda`, `Pagina`, `ItemsPagina`.
- El listado principal usa ejecuciones; la action de resultados queda disponible para la preview/detalle.
- Se mantiene mock explicito por variable de entorno, no como fallback silencioso.

## Validacion

- `bun x tsc --noEmit --incremental false`
- `bun x eslint app/'(private)'/gestion-de-cruces/page.tsx src/modules/cross-management/data/actions/index.ts src/modules/cross-management/data/actions/queries/getCrossManagementAction.ts src/modules/cross-management/data/actions/queries/getCrossResultsAction.ts src/modules/cross-management/data/data-access.ts src/modules/cross-management/data/interfaces/CrossManagementSource.ts src/modules/cross-management/data/models/CrossManagement.ts src/modules/cross-management/data/sources/mock/MockCrossManagementSource.ts src/modules/cross-management/data/sources/rest/RestCrossManagementSource.ts src/modules/cross-management/data/sources/rest/dtos/ApiCrossManagementDtos.ts src/modules/cross-management/data/sources/rest/mappers/mapCrossManagementDto.ts src/modules/cross-management/presentation/components/CrossManagementPage/index.tsx src/modules/cross-management/presentation/hooks/useCrossManagement.ts`

## 2026-06-04 Gestion de Cruces module refactor

- `app/(private)/gestion-de-cruces/page.tsx` dejó de ejecutar la carga inicial y ahora delega en `CrossManagementModule`.
- `CrossManagementModule` monta un `Suspense` propio con `CrossManagementPageLoader`; la server action de listado queda debajo de esa boundary.
- `useCrossManagement` quedó como hook fachada y delega filtros, navegación, handlers de controles y tabla en hooks separados.
- Se movieron constantes de request, filtros, labels, rutas y columnas a carpetas `constants`, y el filtrado local pasó a `presentation/utils`.
- `CrossManagementPage` se dividió en header, filters bar y tabla, con CSS Modules separados por componente.
- Se agregó el select de período del listado principal para cumplir la spec de combinación de texto, período y rango de días.
- Se corrigieron dos problemas acotados de hooks en `cross-management` preview/modal que impedían que ESLint global avanzara sobre este dominio.

### Validation

- `bun x tsc --noEmit --incremental false`
- `bun x eslint app/'(private)'/gestion-de-cruces/page.tsx src/modules/cross-management/index.tsx src/modules/cross-management/constants/crossManagementRequest.ts src/modules/cross-management/presentation/constants/crossManagementFilters.ts src/modules/cross-management/presentation/constants/crossManagementLabels.ts src/modules/cross-management/presentation/constants/crossManagementRoutes.ts src/modules/cross-management/presentation/constants/crossManagementTable.ts src/modules/cross-management/presentation/utils/parseCrossManagementDate.ts src/modules/cross-management/presentation/utils/matchesCrossManagementDayRange.ts src/modules/cross-management/presentation/utils/matchesCrossManagementPeriod.ts src/modules/cross-management/presentation/utils/filterCrossManagementItems.ts src/modules/cross-management/presentation/hooks/useCrossManagement.ts src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementFilters.ts src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementNavigation.ts src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementFiltersBar.ts src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementTable.ts src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementTableRow.ts src/modules/cross-management/presentation/components/CrossManagementPage/index.tsx src/modules/cross-management/presentation/components/CrossManagementPage/CrossManagementPageLoader.tsx src/modules/cross-management/presentation/components/CrossManagementHeader/index.tsx src/modules/cross-management/presentation/components/CrossManagementFiltersBar/index.tsx src/modules/cross-management/presentation/components/CrossManagementTable/index.tsx src/modules/cross-management/presentation/components/CrossManagementTable/CrossManagementTableRow.tsx src/modules/cross-management/presentation/components/CrossFilterModal/useCrossFilterModal.ts src/modules/cross-management/presentation/components/CrossPreviewPage/index.tsx`
- `bun run lint` ya no falla por `cross-management`; queda bloqueado por un error existente en `reprocessing` y 4 warnings existentes en `unified-register`.

## 2026-06-05 Cross preview route refactor

- `app/(private)/gestion-de-cruces/vista-previa-cruce/[crossId]/page.tsx` dejó de parsear params y ejecutar server actions; ahora delega en `CrossPreviewModule`.
- Se creó `src/modules/cross-management/preview.tsx` con `Suspense` propio y `CrossPreviewPageLoader` para aislar la carga de la vista previa.
- Se agregó `getCrossPreviewAction`, que centraliza la validación del `crossId`, la consulta de resultados/ejecución y el mapeo a `ICrossPreviewData`.
- `useCrossPreview` quedó como hook fachada y delega tabs, búsquedas, filtros de análisis, estados de filas y modales en hooks SOLID.
- Se movieron constantes de filtros, labels, rutas, estados y grupos de planilla a `presentation/constants`; la búsqueda y filtros numéricos pasaron a `presentation/utils`.
- `CrossPreviewPage` se dividió en componentes chicos para estado vacío, top bar, header, planilla, resumen, análisis, pager y modales.

### Validation

- `bun x tsc --noEmit`
- `bun x eslint app/'(private)'/gestion-de-cruces/vista-previa-cruce/'[crossId]'/page.tsx src/modules/cross-management/preview.tsx src/modules/cross-management/constants/crossPreviewRequest.ts src/modules/cross-management/data/actions/queries/getCrossPreviewAction.ts src/modules/cross-management/data/actions/index.ts src/modules/cross-management/presentation/constants/crossPreviewFilters.ts src/modules/cross-management/presentation/constants/crossPreviewLabels.ts src/modules/cross-management/presentation/constants/crossPreviewRoutes.ts src/modules/cross-management/presentation/constants/crossPreviewStatus.ts src/modules/cross-management/presentation/constants/crossPreviewPlanTable.ts src/modules/cross-management/presentation/utils/normalizeCrossPreviewSearch.ts src/modules/cross-management/presentation/utils/matchesCrossPreviewSearch.ts src/modules/cross-management/presentation/utils/filterCrossPreviewRowsBySearch.ts src/modules/cross-management/presentation/utils/parseCrossPreviewFilterNumber.ts src/modules/cross-management/presentation/utils/matchesCrossPreviewFilterCondition.ts src/modules/cross-management/presentation/utils/filterCrossPreviewAnalysisRows.ts src/modules/cross-management/presentation/hooks/useCrossPreview.ts src/modules/cross-management/presentation/hooks/cross-preview/*.ts src/modules/cross-management/presentation/components/CrossPreviewPage/*.tsx`
- `bun run lint` sigue bloqueado por un error existente en `reprocessing` y 4 warnings existentes en `unified-register`; la subruta de preview queda limpia en lint acotado.

## 2026-06-05 Intimation export modal refactor

- `IntimationExportModal` dejó de concentrar el preview completo y quedó como composición de header, paginación, barra de contribuyente, documento y footer.
- Se movió el mapa de columnas de la planilla adjunta a `presentation/constants` y la resolución de valores a `presentation/utils`.
- Se agregaron hooks para estado del modal, paginación y documento, manteniendo el componente sin cálculo de contribuyente activo ni split de párrafos.
- El CSS del modal se separó por bloque visual para evitar un módulo de estilos de más de 300 líneas.

### Validation

- `bun x tsc --noEmit`
- `bun x eslint src/modules/cross-management/presentation/components/IntimationExportModal/*.tsx src/modules/cross-management/presentation/hooks/intimation-export/*.ts src/modules/cross-management/presentation/constants/intimationExportColumns.ts src/modules/cross-management/presentation/constants/intimationExportLabels.ts src/modules/cross-management/presentation/utils/resolveIntimationExportColumnValue.ts`
- `bun run lint` sigue bloqueado por un error existente en `reprocessing` y 4 warnings existentes en `unified-register`; `IntimationExportModal` queda limpio en lint acotado.

## 2026-06-04 Preview de resultados de cruces

- `app/(private)/gestion-de-cruces/vista-previa-cruce/[crossId]/page.tsx` usa el `crossId` de la ruta como `ejecucionId` y carga `GET /api/procesos-informacion/ejecuciones/{ejecucionId}/resultados-cruces`.
- Se agrego `mapCrossResultsToPreview` para adaptar `resultadosCruces` al modelo visual de `CrossPreviewPage`.
- `CrossPreviewPage` dejo de consultar `crossPreviewMockById`, por lo que `/gestion-de-cruces/vista-previa-cruce/1` ya no depende de IDs mock como `cross-1`.
- Los filtros de columnas de la preview se aplican localmente sobre filas reales para evitar volver a la action mock de filtrado.

### Validation

- `bun x tsc --noEmit --incremental false`
- `bun x eslint 'app/(private)/gestion-de-cruces/vista-previa-cruce/[crossId]/page.tsx' src/modules/cross-management/data/mappers/mapCrossResultsToPreview.ts src/modules/cross-management/presentation/components/CrossPreviewPage/index.tsx src/modules/cross-management/presentation/hooks/useCrossPreview.ts`

## 2026-06-16 Intimation document generation BFF route

- `useIntimationDocumentDownload` dejó de invocar `generateIntimationDocumentAction` desde el cliente para evitar requests atadas al hash de Server Actions entre deployments.
- Se agregó `POST /api/documentos/intimacion/generar` como ruta BFF del frontend: parsea el payload, normaliza `filasPlanilla`, valida sesión, reenvía al backend real y propaga errores de API.
- Se reutilizó un mapper compartido para adaptar respuestas de backend con `documentoId`, `documentId`, `id`, `urlDescarga`, `downloadUrl` o `url` al modelo interno.
- Se agregó `generateIntimationDocument` en `presentation/utils` para que el browser envíe JSON directo al BFF y reciba `{ documentId, downloadUrl }`.
- Se cubrió el helper client-side con tests de request exitoso y error backend.

### Validation

- `bun x jest src/modules/cross-management/presentation/utils/intimationDocumentGeneration.test.ts src/modules/cross-management/data/utils/normalizeIntimationDocumentPayload.test.ts src/modules/cross-management/presentation/utils/intimationDocumentPayload.test.ts --runInBand`
- `bun x eslint app/api/documentos/intimacion/generar/route.ts src/modules/cross-management/data/sources/rest/RestCrossManagementSource.ts src/modules/cross-management/data/sources/rest/mappers/mapIntimationDocumentDto.ts src/modules/cross-management/presentation/hooks/intimation-export/useIntimationDocumentDownload.ts src/modules/cross-management/presentation/utils/intimationDocumentGeneration.ts src/modules/cross-management/presentation/utils/intimationDocumentGeneration.test.ts`
- `bun x tsc --noEmit`
- `git diff --check`

## 2026-06-20 Busqueda en listado de cruces

- `filterCrossManagementItems` ahora aplica `searchValue` junto con los filtros de periodo y rango de dias, usando `matchesCrossSearch` para normalizar texto, acentos y CUITs con o sin formato.
- La busqueda del listado de `/gestion-de-cruces` contempla nombre de cruce, origen y referencia de origen, por lo que funciona para nombres, numeros de lote y CUITs.
- Se agrego una prueba de regresion para validar coincidencias por nombre, lote y CUIT normalizado.

### Validation

- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/jest/bin/jest.js --runTestsByPath src/modules/cross-management/presentation/utils/filterCrossManagementItems.test.ts src/modules/cross-management/data/utils/crossSearch.test.ts src/modules/batch-management/data/sources/rest/RestBatchManagementSource.test.ts`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/typescript/bin/tsc --noEmit --pretty false`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/eslint/bin/eslint.js src/modules/cross-management/presentation/utils/filterCrossManagementItems.ts src/modules/cross-management/presentation/utils/filterCrossManagementItems.test.ts src/modules/cross-management/presentation/hooks/cross-management/useCrossManagementFilters.ts src/modules/batch-management/data/sources/rest/RestBatchManagementSource.ts src/modules/batch-management/data/sources/rest/RestBatchManagementSource.test.ts`
