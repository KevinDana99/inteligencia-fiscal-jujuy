# Cross Management Feature Story

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

- `bun x tsc --noEmit`
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
