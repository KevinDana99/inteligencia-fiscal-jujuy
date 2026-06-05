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
