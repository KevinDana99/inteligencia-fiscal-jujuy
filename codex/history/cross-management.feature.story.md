# Cross Management Feature Story

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

## 2026-06-04 Preview de resultados de cruces

- `app/(private)/gestion-de-cruces/vista-previa-cruce/[crossId]/page.tsx` usa el `crossId` de la ruta como `ejecucionId` y carga `GET /api/procesos-informacion/ejecuciones/{ejecucionId}/resultados-cruces`.
- Se agrego `mapCrossResultsToPreview` para adaptar `resultadosCruces` al modelo visual de `CrossPreviewPage`.
- `CrossPreviewPage` dejo de consultar `crossPreviewMockById`, por lo que `/gestion-de-cruces/vista-previa-cruce/1` ya no depende de IDs mock como `cross-1`.
- Los filtros de columnas de la preview se aplican localmente sobre filas reales para evitar volver a la action mock de filtrado.

### Validation

- `bun x tsc --noEmit --incremental false`
- `bun x eslint 'app/(private)/gestion-de-cruces/vista-previa-cruce/[crossId]/page.tsx' src/modules/cross-management/data/mappers/mapCrossResultsToPreview.ts src/modules/cross-management/presentation/components/CrossPreviewPage/index.tsx src/modules/cross-management/presentation/hooks/useCrossPreview.ts`
