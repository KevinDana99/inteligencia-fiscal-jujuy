# Unified Register Feature Story

## Preview Cross Menu Target Fix - 2026-06-19

### Summary

Fixed the `/vista-previa-padron/[cuit]` header action `Cruces a realizar` so it opens the same cross execution menu used by `Gestión de Lotes`.

### Main Changes

- Updated the custom cross menu trigger to forward Mantine `Menu.Target` props and ref to the underlying button.
- Kept the existing individual execution flow, which maps selected crosses to `POST /api/procesos-informacion/cruces/{codigoCruce}/ejecuciones` with `tipoOrigen: "individual"`, `loteId: null`, and `contribuyenteId`.
- Disabled the trigger while the available-cross catalog is hydrating, preserving the existing `Cargando cruces...` feedback.

### Validation

- Reviewed local Swagger `http://localhost:5001/swagger/v1/swagger.json`: the endpoint uses `SolicitudEjecutarCruce` and supports nullable `loteId` and `contribuyenteId`.
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/eslint src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/components/PreviewHeaderActions.tsx`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/tsc --noEmit --incremental false`
- `git diff --check`
- Local private-route check: `http://localhost:3000/vista-previa-padron/20-10000944-8` and `http://localhost:3000/gestion-de-lotes` return `307 /login` with expired auth cookies without a valid session.

## Informe Cross Column Picker - 2026-06-17

### Summary

Added a column picker modal for `3) Inconsistencias detectadas — Cruces` inside the report generation flow.

### Main Changes

- Clicking a report cross row now opens `Columnas del informe`, a two-list picker for available and visible columns.
- The checkbox still controls whether the cross is included in the report, while the row visual state shows selected crosses.
- Column choices are stored per cross and preserved even when the cross is unchecked.
- The report preview and generated payload now respect the selected column keys per cross.

### Validation

- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node ./node_modules/.bin/jest src/modules/unified-register/presentation/utils/informeCrossColumnSelection.test.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts --runInBand`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/tsc --noEmit --pretty false --incremental false`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/eslint src/modules/unified-register/presentation/hooks/informe-generation/useInformeCrosses.ts src/modules/unified-register/presentation/components/InformeGenerationModal/index.tsx src/modules/unified-register/presentation/components/InformeGenerationModal/components/CrossSelectionSection.tsx src/modules/unified-register/presentation/components/InformeGenerationModal/components/CrossColumnsPickerModal.tsx src/modules/unified-register/presentation/components/InformePreviewModal/components/CrossPreviewTable.tsx src/modules/unified-register/presentation/utils/informeCrossColumnSelection.ts src/modules/unified-register/presentation/utils/informeCrossColumnSelection.test.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts`

## Summary

Refactored the main `Padrón Unificado` presentation logic so the listing page delegates search and page state to hooks instead of keeping handler logic inline.

## Main Changes

- Converted the previous generic register hook into a search-focused hook, `useUnifiedRegisterSearch`.
- Added `useUnifiedRegisterPage` to compose the mock data source, search fields, filtered results, change handler, and result state for the page.
- Updated `UnifiedRegisterPage` to consume the page hook and keep the component focused on rendering Mantine UI.
- Added the supplied visual token values to the Mantine theme and wired a custom `Pagination` treatment through component configuration and Mantine variables.
- Configured the selected page item to match the supplied active button weight and shadow, and rendered previous/next controls as textual arrows instead of Mantine's default scaled SVG icon box.
- Rendered the Mantine `Pagination` control below the unified register cards with the requested `‹`, `›`, and `…` controls.

## Rules Followed

- Preserved local reactive filtering over mock data.
- Kept search constrained to `CUIT` and `razón social`.
- Maintained the empty state text required by the feature spec.
- Kept data and presentation responsibilities separated inside `src/modules/unified-register/`.
- Kept the pagination visual work on Mantine `Pagination` instead of custom button markup.

## Validation

- `bun x eslint src/modules/unified-register/presentation/hooks/useUnifiedRegister.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage.ts src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx`
- `bun x eslint src/theme.ts src/modules/unified-register/presentation/hooks/useUnifiedRegister.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage.ts src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx`
- `git diff --check`
- SSR verification on `http://localhost:3001/`: authenticated HTML includes active item `font-weight:700`, `box-shadow:0 1px 4px rgba(0,0,0,.12)`, textual `‹/›`, and no `if-pagination` classes.

## Notes

- `bun run lint` and `bun x tsc --noEmit --pretty false` still fail globally due to existing issues in other modules and in `useUnifiedRegisterPreview`.
- CSS files are ignored by the current ESLint configuration when passed directly.

## Backend Connection Update - 2026-06-04

### Summary

Connected the main `Padrón Unificado` listing flow to the REST data source by default, keeping mock mode available only through the explicit `NEXT_PUBLIC_USE_MOCK_UNIFIED_REGISTER=true` flag.

### Main Changes

- Validated the backend host from `.env`: `http://localhost:5001`.
- Confirmed `GET /api/iam/salud` responds `200 OK`.
- Confirmed `GET /api/contribuyentes?Pagina=1&ItemsPagina=10` exists and responds `401 Unauthorized` without a Bearer token, matching the authenticated backend contract.
- Moved data-source env names and auth error metadata into `data/constants`.
- Split REST route constants, HTTP utilities, pagination params, and DTO mappers into dedicated folders.
- Refactored `RestUnifiedRegisterSource` into a thinner adapter focused on the `IUnifiedRegisterSource` port.
- Split `useUnifiedRegisterPage` into page data, backend pagination, and search orchestration hooks.
- Moved search constants and search matching helpers out of hooks.
- Split the main listing UI into search, list, pagination, and empty-state components.

### Validation

- `bun x eslint src/modules/unified-register/data/data-access.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/constants/unifiedRegisterApiRoutes.ts src/modules/unified-register/data/sources/rest/utils/unifiedRegisterRestClient.ts src/modules/unified-register/data/sources/rest/mappers/unifiedRegisterMappers.ts src/modules/unified-register/presentation/constants/unifiedRegisterPage.ts src/modules/unified-register/presentation/utils/unifiedRegisterSearch.ts src/modules/unified-register/presentation/hooks/useUnifiedRegister.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/index.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/useUnifiedRegisterPageData.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/useUnifiedRegisterPagePagination.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/useUnifiedRegisterPageSearch.ts src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx src/modules/unified-register/presentation/components/UnifiedRegisterSearch/index.tsx src/modules/unified-register/presentation/components/UnifiedRegisterList/index.tsx src/modules/unified-register/presentation/components/UnifiedRegisterEmptyState/index.tsx src/modules/unified-register/presentation/components/UnifiedRegisterPagination/index.tsx`
- `bun x tsc --noEmit --pretty false`
- `git diff --check`
- Existing dev server verified at `http://localhost:3000/`; unauthenticated request redirects to `/login` with expired auth cookies, as expected for the private route.

## List Navigation Fix - 2026-06-04

### Summary

Reviewed and corrected the navigation path from the `Padrón Unificado` card list into the contributor preview route.

### Main Changes

- Made `/vista-previa-padron/*` resolve explicitly as the `Padrón Unificado` dashboard section.
- Updated the dynamic preview route to use the `id` query param from the list as the primary contributor identifier.
- Kept fixture details as a visual fallback template only when the selected contributor is not present in the mock detail universe.

### Validation

- `bun x tsc --noEmit --pretty false`
- `bun x eslint 'app/(private)/vista-previa-padron/[cuit]/page.tsx' src/modules/dashboard-layout/data/models/DashboardLayout.ts`

## Preview Backend Detail Endpoints - 2026-06-04

### Summary

Connected `/vista-previa-padron/[cuit]` to the contributor detail backend endpoints for alternate addresses, contacts, and notes.

### Main Changes

- Reused `GET /api/contribuyentes/{contribuyenteId}/domicilios-alternativos` to hydrate the alternate address block.
- Reused `GET /api/contribuyentes/{contribuyenteId}/contactos` with pagination for the contacts block and wired the contact pager controls.
- Reused `GET /api/contribuyentes/{contribuyenteId}/notas` with pagination for the notes block.
- Preserved the backend contact resource id as `recordId` in the contact view model so edit/delete actions target the real contact record instead of the displayed field key.

### Validation

- Backend login with `example@example.com` / `12345678` returned an authenticated session.
- Direct backend checks returned `200 OK` for domicilios alternativos, contactos, and notas for contributor `06b815b5-b68b-41b9-be4c-10a7cb566c01`.
- Browser verification at `http://localhost:3000/vista-previa-padron/30-12345678-1?id=06b815b5-b68b-41b9-be4c-10a7cb566c01` displayed the backend demo address, contact fields, and note.
- `bun x eslint 'app/(private)/vista-previa-padron/[cuit]/page.tsx' 'src/modules/unified-register/data/models/UnifiedRegister.ts' 'src/modules/unified-register/data/mappers/mapContact.ts' 'src/modules/unified-register/presentation/hooks/useUnifiedRegisterPreview.ts' 'src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/index.tsx' 'src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts' 'src/modules/unified-register/data/sources/rest/constants/unifiedRegisterApiRoutes.ts' 'src/modules/unified-register/data/sources/rest/dtos/ApiUnifiedRegisterDtos.ts' 'src/modules/unified-register/data/sources/rest/mappers/unifiedRegisterMappers.ts'`
- `bun x tsc --noEmit`

## Preview Direct CUIT Lookup Fix - 2026-06-11

### Summary

Reviewed why `/vista-previa-padron/30501685212` could resolve as a 404: the route name exposed a `cuit` param, but the page only had enough data to load detail endpoints when a `contribuyenteId` came in the `id` query param.

### Main Changes

- Normalized CUIT comparisons so direct URLs work with or without hyphens.
- Kept the existing `?id=` path as the primary navigation flow from the unified register card list.
- Added a fallback lookup through the unified register listing to resolve `CUIT -> contribuyenteId` before calling `notFound()`.
- Preserved `notFound()` when the CUIT is absent from the current unified register data source.

### Validation

- `bun x eslint 'app/(private)/vista-previa-padron/[cuit]/page.tsx'`

## REST Source Merge Conflict Repair - 2026-06-11

### Summary

Resolved merge conflicts in the `unified-register` data layer and aligned the active REST adapter with the authenticated API client configuration used by the rest of the frontend modules.

### Main Changes

- Removed conflict markers from `data-access.ts`, `RestUnifiedRegisterSource.ts`, and the unified-register constraint document.
- Kept `createAuthenticatedApiClientConfig()` as the source of backend auth config so access-token refresh remains available.
- Rebuilt `RestUnifiedRegisterSource` around the centralized route constants and REST utility helpers.
- Confirmed the Swagger contract for contacts, alternate addresses, and notes uses `/api/contribuyentes/{contribuyenteId}/...`, `PATCH` for updates, and `Pagina` / `ItemsPagina` query params where pagination exists.
- Updated `unifiedRegisterRestClient` to call `fetchWithAuthRetry` and to safely parse empty JSON responses.
- Regenerated the tracked `tsconfig.tsbuildinfo` during `tsc` validation, removing stale conflict metadata from that generated file.

### Validation

- `bun x eslint src/modules/unified-register/data/data-access.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/utils/unifiedRegisterRestClient.ts`
- `bun x tsc --noEmit --pretty false`
- `bun run lint`

## Home Unified Padron Endpoint - 2026-06-11

### Summary

Applied `GET /api/procesos-informacion/padron/unificado` to the `/` Padrón Unificado screen.

### Main Changes

- Replaced the legacy list route `GET /api/contribuyentes` with the unified padron process endpoint.
- Wired the Padrón Unificado search input to request page `1` with the endpoint `Busqueda` query parameter.
- Kept pagination tied to the active search so page changes continue querying the backend instead of filtering locally.
- Updated the mock source to support the same search parameter for local/mock mode.
- Added a focused Jest test for REST URL construction and response mapping.

### Validation

- `bun x jest src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts --runInBand`
- `bun x eslint src/modules/unified-register/data/actions/queries/getUnifiedRegisterListAction.ts src/modules/unified-register/data/interfaces/UnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/constants/unifiedRegisterApiRoutes.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts src/modules/unified-register/data/sources/mock/MockUnifiedRegisterSource.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/index.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/useUnifiedRegisterPagePagination.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/useUnifiedRegisterPageSearch.ts`
- `bun x tsc --noEmit --pretty false --incremental false`
- `curl -I -sS http://127.0.0.1:3000/` returned `307` to `/login`, expected for the private route without a valid session.
- `curl -I -sS 'http://127.0.0.1:5001/api/procesos-informacion/padron/unificado?Pagina=1&ItemsPagina=10'` returned `401`, confirming the protected backend endpoint exists.
- `git diff --check`

## Unified Padron Detail Endpoints - 2026-06-12

### Summary

Connected the contributor detail preview to the Padron Unificado detail contract for header, Mercurio fines, and intervention orders.

### Main Changes

- Replaced the legacy detail routes with:
  - `GET /api/procesos-informacion/padron/unificado/{contribuyenteId}/encabezado`
  - `GET /api/procesos-informacion/padron/unificado/{contribuyenteId}/mercurio`
  - `GET /api/procesos-informacion/padron/unificado/{contribuyenteId}/ordenes-intervencion`
- Added detail pagination constants and lowercase query parameter support for `pagina` and `itemsPagina`.
- Updated REST DTOs and domain models to preserve nullable fields from the backend contract.
- Corrected `declaracionesJuradas` naming while keeping mapper compatibility with the old misspelled field.
- Added data and presentation utilities for applying header data and mapping paginated detail records.
- Split Mercurio and intervention-order pagination into dedicated hooks so `useUnifiedRegisterPreview` remains an orchestrator.
- Updated detail UI rendering to handle `null` cells and risk level `D` without inventing replacement values.

### Validation

- `bun x jest src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts --runInBand`
- `bun x tsc --noEmit --pretty false --incremental false`
- `bun x eslint 'app/(private)/vista-previa-padron/[cuit]/page.tsx' src/modules/unified-register/data/models/UnifiedRegister.ts src/modules/unified-register/data/utils/unifiedRegisterDetail.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/constants/unifiedRegisterApiRoutes.ts src/modules/unified-register/data/sources/rest/constants/unifiedRegisterPagination.ts src/modules/unified-register/data/sources/rest/dtos/ApiUnifiedRegisterDtos.ts src/modules/unified-register/data/sources/rest/mappers/unifiedRegisterMappers.ts src/modules/unified-register/data/sources/rest/utils/unifiedRegisterRestClient.ts src/modules/unified-register/data/sources/mock/MockUnifiedRegisterSource.ts src/modules/unified-register/presentation/constants/unifiedRegisterDetail.ts src/modules/unified-register/presentation/utils/unifiedRegisterDetailRecords.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPreview.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterMercurio.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterInterventionOrders.ts src/modules/unified-register/presentation/components/UnifiedRegisterCard/index.tsx src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/index.tsx`
- `git diff --check`
- Dev server started at `http://localhost:3000`; unauthenticated `/vista-previa-padron/30-12345678-1?id=06b815b5-b68b-41b9-be4c-10a7cb566c01` redirects to `/login`, and `/login` responds `200 OK`.

## Unified Padron Header Swagger Alignment - 2026-06-13

### Summary

Reviewed the local Swagger contract and a live authenticated response for `GET /api/procesos-informacion/padron/unificado/{contribuyenteId}/encabezado`.

### Main Changes

- Confirmed Swagger exposes the header route under `ControladorProcesosInformacion`.
- Confirmed the live backend response can return `tipoContribuyente: "LOCAL"` and `actividadSecundaria: null`.
- Updated contributor type mapping so backend code `LOCAL` maps to the frontend domain label `Regimen Local`.
- Added REST adapter coverage for `LOCAL` in the unified padron list mapping.

### Validation

- `bun x jest src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts --runInBand`
- `bun x tsc --noEmit --pretty false --incremental false`
- `bun x eslint src/modules/unified-register/data/sources/rest/mappers/unifiedRegisterMappers.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts`

## Unified Padron Mercurio Swagger Alignment - 2026-06-13

### Summary

Reviewed the local Swagger contract and a live authenticated response for `GET /api/procesos-informacion/padron/unificado/{contribuyenteId}/mercurio`.

### Main Changes

- Confirmed Swagger exposes Mercurio under `ControladorProcesosInformacion`.
- Confirmed the live backend response shape is `{ pagina, itemsPagina, totalItems, totalPaginas, multas }`.
- Aligned detail pagination query params with Swagger: `Pagina` and `ItemsPagina`.
- Updated REST adapter tests so Mercurio asserts the exact Swagger URL format.

### Validation

- `bun x jest src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts --runInBand`
- `bun x tsc --noEmit --pretty false --incremental false`
- `bun x eslint src/modules/unified-register/data/sources/rest/constants/unifiedRegisterPagination.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts`

## Unified Padron Intervention Orders Swagger Alignment - 2026-06-13

### Summary

Reviewed the local Swagger contract and live authenticated responses for `GET /api/procesos-informacion/padron/unificado/{contribuyenteId}/ordenes-intervencion`.

### Main Changes

- Confirmed Swagger exposes intervention orders under `ControladorProcesosInformacion`.
- Confirmed the live backend response shape is `{ pagina, itemsPagina, totalItems, totalPaginas, ordenes }`.
- Confirmed the endpoint accepts `Pagina` and `ItemsPagina`, matching the shared detail pagination constants.
- Added REST adapter coverage for the empty orders response using default pagination.

### Validation

- `bun x jest src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts --runInBand`
- `bun x tsc --noEmit --pretty false --incremental false`
- `bun x eslint src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterInterventionOrders.ts`

## Unified Padron Reprocessing Contributor Resolution - 2026-06-15

### Summary

Fixed `/vista-previa-padron/[cuit]` so the visible CUIT is the source of truth when resolving the contributor used by `POST /api/reprocesos`.

### Main Changes

- Added a shared preview contributor resolver that normalizes CUIT values and prefers the contributor matched by the visible CUIT over a stale `id` query param.
- Updated the preview route to resolve fixture/list matches by CUIT first and validate any route-id fallback against the backend header CUIT.
- Added a filtered `GET /api/reprocesos` call from the preview route to initialize the `Marcar reproceso` switch with the active backend state.
- Updated the reproceso confirmation to build the POST payload from the currently rendered `item.contribuyenteId`.
- Updated the active switch path to call `DELETE /api/reprocesos/{contribuyenteId}` and show `CUIT quitado de reproceso`.
- Added the requested pre-POST log with `{ cuitMostrado, contribuyenteIdEnviado }`.

### Validation

- `bun x jest src/modules/unified-register/data/utils/resolveUnifiedRegisterPreviewContributor.test.ts --runInBand`
- `bun x tsc --noEmit --incremental false`
- `bun run lint`

## Unified Padron Add To Batch Backend Wiring - 2026-06-15

### Summary

Connected the `/vista-previa-padron/[cuit]` header `Agregar a lote` flow to the batch backend contracts.

### Main Changes

- Reused `GET /api/lotes` through `getBatchManagementAction` to populate the preview batch selector with real batch data and debounced search.
- Added `PATCH /api/lotes/contribuyentes` to the batch-management data port, REST adapter, mock adapter, DTO mapper, and server action.
- Mapped the frontend domain payload to Swagger shape `{ loteId, contribuyente: { cuit, razonSocial, regimen } }`.
- Updated the shared API client with `patchJson` and empty-body response handling for `200 OK` commands without a response schema.
- Updated the preview modal to show loading/error states and disable cancel while the add-to-batch command is pending.
- Added REST adapter coverage for the `PATCH /api/lotes/contribuyentes` request body.

### Validation

- `npx jest src/modules/batch-management/data/sources/rest/RestBatchManagementSource.test.ts --runInBand`
- `bun run lint`
- `npx tsc --noEmit`

## Informe Generation Contributor Crosses - 2026-06-15

### Summary

Connected the `Generar Informe` modal to `GET /api/contribuyentes/{contribuyenteId}/cruces` so the selectable crosses come from the contributor backend contract.

### Main Changes

- Added contributor-cross models, DTOs, REST route, mapper, source method, mock method, and server action under `unified-register`.
- Mapped backend enum names to the existing report labels used by the modal.
- Updated `useInformeGeneration` to load crosses for the active contributor, retain real backend cross ids, handle loading/error/empty states, and prevent generation when a listed cross has no local report table data.
- Updated `InformeGenerationModal` to render loading, error, and empty states for contributor crosses.
- Kept known report table payloads for `ControlDesvioBiRegimenCm`, `ControlDesvioBiRegimenGral`, and `ControlBiDeclaradaPorActividad` so the document generation validator still receives valid `claves` and `filas`.

### Decisions

- The backend contributor-cross endpoint currently returns only `{ id, nombre }`, so table data for generated reports remains sourced from the existing local informe templates for known cross codes.
- Unknown cross codes are displayed as executed but disabled for generation until a detail contract provides the required selected columns and rows.

### Validation

- `bun x tsc --noEmit --incremental false`
- `bun x jest src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts --runInBand`
- `bun x eslint src/modules/unified-register/data/actions/index.ts src/modules/unified-register/data/actions/queries/getContributorCrossesAction.ts src/modules/unified-register/data/interfaces/UnifiedRegisterSource.ts src/modules/unified-register/data/models/UnifiedRegister.ts src/modules/unified-register/data/sources/mock/MockUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts src/modules/unified-register/data/sources/rest/constants/unifiedRegisterApiRoutes.ts src/modules/unified-register/data/sources/rest/dtos/ApiUnifiedRegisterDtos.ts src/modules/unified-register/data/sources/rest/mappers/unifiedRegisterMappers.ts src/modules/unified-register/presentation/components/InformeGenerationModal/index.tsx src/modules/unified-register/presentation/hooks/useInformeGeneration.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts src/modules/unified-register/presentation/constants/informeGeneration.ts`
- `git diff --check`
- Existing dev server responded at `http://localhost:3000`; private routes redirect to `/login` without a valid session.

## Unified Padron Preview Server Module Split - 2026-06-16

### Summary

Split `/vista-previa-padron/[cuit]` into a lightweight route plus independent Server Component modules for each preview data section.

### Main Changes

- Added `src/modules/unified-register/preview.tsx` as the preview server entry.
- Moved header/core lookup into `UnifiedRegisterPreviewHeaderModule`.
- Added independent Server Component calls for available crosses, reprocessing state, alternate addresses, contacts, notes, Mercurio fines, and intervention orders.
- Added a client hydration bridge/context so each server module can hydrate only its own state slice without reintroducing a route-level `Promise.all`.
- Updated the preview UI to show per-section loading states while server modules stream in.

### Validation

- `bun x eslint 'app/(private)/vista-previa-padron/[cuit]/page.tsx' 'src/modules/unified-register/preview.tsx' 'src/modules/unified-register/presentation/contexts/UnifiedRegisterPreviewHydrationContext.tsx' 'src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge.tsx' 'src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/index.tsx' 'src/modules/unified-register/presentation/hooks/useUnifiedRegisterPreview.ts' 'src/modules/unified-register/presentation/hooks/useUnifiedRegisterMercurio.ts' 'src/modules/unified-register/presentation/hooks/useUnifiedRegisterInterventionOrders.ts'`
- `bun x tsc --noEmit --incremental false`
- `git diff --check`

## Unified Padron Preview SOLID Refactor - 2026-06-16

### Summary

Refactored `/vista-previa-padron/[cuit]` so route resolution, preview orchestration, report generation, modal rendering, constants, and utilities live in focused modules with files kept under the 150-line limit for the touched preview flow.

### Main Changes

- Moved route contributor resolution into `src/modules/unified-register/preview/resolvePreviewRouteData.ts`, leaving the Next route focused on param decoding, `notFound()`, and module rendering.
- Split the preview client controller into SOLID-style hooks and operation helpers for hydration, record actions, contacts, notes, crosses, batches, remote tables, and reprocessing.
- Split `UnifiedRegisterPreviewPage` into small cards, table sections, modal parts, shared table/pager primitives, and preview constants/utils.
- Split `useInformeGeneration` into form, cross-loading, and document-generation hooks, then extracted contributor-cross mapping and payload building into separate utilities.
- Split the informe generation and preview modals into section components, moved fiscal-action field definitions and report templates into dedicated constants, and compacted CSS modules without changing their selectors.

### Validation

- `bun x eslint 'app/(private)/vista-previa-padron/[cuit]/page.tsx' 'src/modules/unified-register/preview/**/*.tsx' 'src/modules/unified-register/preview/*.tsx' 'src/modules/unified-register/preview/*.ts' 'src/modules/unified-register/presentation/hooks/useUnifiedRegisterPreview.ts' 'src/modules/unified-register/presentation/hooks/unified-register-preview/*.ts' 'src/modules/unified-register/presentation/hooks/useInformeGeneration.ts' 'src/modules/unified-register/presentation/hooks/informe-generation/*.ts' 'src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/**/*.tsx' 'src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/*.tsx' 'src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/*.ts' 'src/modules/unified-register/presentation/components/InformeGenerationModal/**/*.tsx' 'src/modules/unified-register/presentation/components/InformeGenerationModal/*.tsx' 'src/modules/unified-register/presentation/components/InformeGenerationModal/*.ts' 'src/modules/unified-register/presentation/components/InformePreviewModal/**/*.tsx' 'src/modules/unified-register/presentation/components/InformePreviewModal/*.tsx' 'src/modules/unified-register/presentation/components/InformePreviewModal/*.ts' 'src/modules/unified-register/presentation/constants/informeGeneration*.ts' 'src/modules/unified-register/presentation/constants/unifiedRegisterPreview*.ts' 'src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.ts' 'src/modules/unified-register/presentation/utils/mapContributorCrossesToInformeOptions.ts' 'src/modules/unified-register/presentation/utils/unifiedRegisterPreview*.ts'`
- `bun x tsc --noEmit`
- `bun run build`
- File-size check over the touched preview/report modules: largest file is 149 lines.
- Browser verification against the existing `http://localhost:3000` dev server: `/vista-previa-padron/20123456789` redirects to `/login`, the login page renders content, and no Next overlay or console errors were detected.

## Unified Padron Preview Hydration Loop Fix - 2026-06-16

### Summary

Fixed a `Maximum update depth exceeded` loop triggered by the preview hydration bridge when streamed hydration modules called state setters through unstable `hydrate*` function references.

### Main Changes

- Wrapped preview hydration callbacks in `useCallback` for available crosses, reprocessing, addresses, contacts, notes, Mercurio, and intervention orders.
- Added a per-bridge `moduleKey` guard so each streamed hydration module applies its payload only once after it mounts.
- Kept the hydration context memoized through stable function references instead of weakening the bridge effect dependencies.

### Validation

- `bun x eslint 'src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/UnifiedRegisterPreviewHydrationBridge.tsx' 'src/modules/unified-register/presentation/hooks/useUnifiedRegisterPreview.ts' 'src/modules/unified-register/presentation/hooks/unified-register-preview/*.ts'`
- `bun x tsc --noEmit`
- `bun run build`
- File-size check on the touched preview hydration hooks: largest file is 149 lines.
- Browser verification against `http://localhost:3000/vista-previa-padron/20123456789`: unauthenticated flow redirects to `/login`, renders content, and shows no Next overlay or console errors.

## Informe Preview Modal Scroll Fix - 2026-06-17

### Summary

Restored vertical scrolling in the `Informe de Investigación — Previsualización` modal without changing report generation, payloads, or download behavior.

### Main Changes

- Constrained the modal content height to the viewport and changed the modal body to a flex column.
- Kept the top bar and footer from shrinking while the document stage becomes the scrollable area.
- Updated the document stage from horizontal-only overflow to full overflow so long report previews can scroll vertically.

### Validation

- `git diff --check`
- `bun x eslint 'src/modules/unified-register/presentation/components/InformePreviewModal/**/*.tsx' 'src/modules/unified-register/presentation/components/InformePreviewModal/*.tsx'`
- `bun x tsc --noEmit --incremental false`
- Browser verification against `http://localhost:3000/vista-previa-padron/20123456789`: unauthenticated flow redirects to `/login`, renders content, and shows no console errors.
- `bun run build` remains blocked by existing prerender `cookies()` errors on `/reproceso` and `/admin`.

## Informe Generation Payload Total Row Fix - 2026-06-17

### Summary

Stopped sending and previewing the `TOTAL` row from selected taxable-base crosses, leaving total calculation to the backend.

### Main Changes

- Filtered selected cross rows with `periodo: 'TOTAL'` from the shared selected-cross builder used by both the preview and the informe generation payload.
- Added regression coverage so generated document payloads and preview selected crosses include only period rows and no total row.

### Validation

- `bun x jest src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts --runInBand`
- `bun x eslint src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts`
- `bun x tsc --noEmit --incremental false`
- `git diff --check`

## Vista Previa Por CUIT Sin Exponer ID - 2026-06-17

### Summary

Changed unified register preview navigation so new URLs expose only the CUIT while the real `contribuyenteId` is resolved internally from backend lookup.

### Main Changes

- Removed the `?id=` query param from unified-register cards and reprocessing preview row navigation.
- Reworked preview route resolution so backend CUIT lookup wins over fixture data and stale legacy route IDs.
- Added a shared mock-mode helper for unified-register data access and preview resolution.
- Added resolver regression tests for backend precedence, fixture fallback, legacy URL compatibility, mock mode, and backend lookup errors.

### Validation

- `npm test -- resolvePreviewRouteData.test.ts`
- `npm test` runs the new resolver tests successfully but remains failing in unrelated `src/modules/batch-management/presentation/utils/batchManagementCross.test.ts`, where the current implementation includes `parameters` and the existing expectation does not.
- `npm run lint` passes with existing warnings in admin/cross-management files.
- `npm run build`

## Vista Previa Source Tables Commented Out - 2026-06-17

### Summary

Commented out the source tables block rendered below `Órdenes de Intervención` in the unified register preview, preserving the code for future reactivation.

### Main Changes

- Commented the `SourceTablesCard` import and render call in the preview right column.
- Left `SourceTablesCard.tsx` untouched so the complete block implementation remains in the repository.

### Validation

- `PATH='/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin':$PATH node_modules/.bin/eslint 'src/modules/unified-register/presentation/components/UnifiedRegisterPreviewPage/components/PreviewRightColumn.tsx'`

## Home Add To Batch Modal Close Fix - 2026-06-18

### Summary

Fixed the `/` add-to-batch modal so the lot list remains visible during close transitions and the selector content is capped at 600px.

### Main Changes

- Kept loaded lot options intact when closing the selector modal, leaving state cleanup to the next open cycle.
- Added selector-specific modal classes so only the add-to-batch list gets a 600px responsive cap and internal vertical scrolling.

### Validation

- `PATH='/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin':$PATH node_modules/.bin/eslint src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/useUnifiedRegisterPageActions.ts`
- `PATH='/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin':$PATH node_modules/.bin/tsc --noEmit --pretty false --incremental false`
- `git diff --check`
- `curl -I -sS http://127.0.0.1:3000/` responded with the expected private-route redirect to `/login` without a valid terminal session.

## Informe Generation Dynamic Cross Columns - 2026-06-18

### Summary

Connected the report-generation cross column picker to `GET /api/contribuyentes/cruces/columnas`, using backend-provided `datos.columnas` and `datos.filas` as the source for the modal, preview, and generation payload.

### Main Changes

- Added contributor cross column models, DTOs, mapper, REST route, source method, mock implementation, and server action under `unified-register`.
- Updated `useInformeCrosses` to load column/row detail for each listed contributor cross before enabling report generation.
- Reworked informe cross mapping so dynamic backend columns get readable labels, while the generated document payload derives required `periodo` values from backend `anio` rows.
- Updated the preview table to keep legacy `periodo` rendering only for old local templates while rendering backend `anio` as a normal selected column.
- Removed the old local informe cross templates as the initial UI state and versioned the dynamic column load so Fast Refresh cannot keep stale template columns visible after the endpoint integration changes.
- Normalized dynamic cross row values so nested objects or arrays are stringified before reaching the document generation API, preventing non-scalar row validation errors.
- Kept backend `datos.columnas` as the available column catalog only; generated informe payloads now include only the user-selected visible column keys, plus the required derived `periodo` row value.
- Removed the default selected cross behavior so the report flow opens clean: no cross is selected and no columns are visible until the user explicitly chooses them.
- Aligned the informe cross column picker with the `Planilla adjunta — Columnas` picker from `Generar intimación`: two card lists, checkbox selection, circular move actions, multi-select movement, and drag-and-drop ordering for visible columns.

### Validation

- Bundled Node was used because `bun`, `node`, `npm`, and `npx` were not available on the shell PATH.
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/jest/bin/jest.js src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts --runInBand`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/typescript/bin/tsc --noEmit --incremental false`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js src/modules/unified-register/data/actions/index.ts src/modules/unified-register/data/actions/queries/getContributorCrossColumnsAction.ts src/modules/unified-register/data/interfaces/UnifiedRegisterSource.ts src/modules/unified-register/data/models/UnifiedRegister.ts src/modules/unified-register/data/sources/mock/MockUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts src/modules/unified-register/data/sources/rest/constants/unifiedRegisterApiRoutes.ts src/modules/unified-register/data/sources/rest/dtos/ApiUnifiedRegisterDtos.ts src/modules/unified-register/data/sources/rest/mappers/unifiedRegisterMappers.ts src/modules/unified-register/presentation/components/InformePreviewModal/components/CrossPreviewTable.tsx src/modules/unified-register/presentation/hooks/informe-generation/useInformeCrosses.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts src/modules/unified-register/presentation/utils/mapContributorCrossesToInformeOptions.ts`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js src/modules/unified-register/presentation/hooks/informe-generation/useInformeCrosses.ts src/modules/unified-register/presentation/utils/mapContributorCrossesToInformeOptions.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.ts src/modules/unified-register/presentation/components/InformePreviewModal/components/CrossPreviewTable.tsx`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/jest/bin/jest.js src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts --runInBand`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js src/modules/unified-register/data/sources/rest/dtos/ApiUnifiedRegisterDtos.ts src/modules/unified-register/data/sources/rest/mappers/unifiedRegisterMappers.ts src/modules/unified-register/data/sources/rest/RestUnifiedRegisterSource.test.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js src/modules/unified-register/presentation/utils/mapContributorCrossesToInformeOptions.ts src/modules/unified-register/presentation/hooks/useInformeGeneration.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js src/modules/unified-register/presentation/hooks/informe-generation/useInformeCrosses.ts src/modules/unified-register/presentation/hooks/informe-generation/utils.ts src/modules/unified-register/presentation/constants/informeGenerationCrossOptions.ts src/modules/unified-register/presentation/hooks/useInformeGeneration.ts src/modules/unified-register/presentation/utils/mapContributorCrossesToInformeOptions.ts src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/typescript/bin/tsc --noEmit --incremental false`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js src/modules/unified-register/presentation/hooks/informe-generation/useInformeCrosses.ts src/modules/unified-register/presentation/components/InformeGenerationModal/components/CrossColumnsPickerModal.tsx`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/jest/bin/jest.js src/modules/unified-register/presentation/utils/buildInformeGenerationPayload.test.ts --runInBand`
- `git diff --check`

## Preview Declared Amount Currency Formatting - 2026-06-20

### Summary

Formatted the `/vista-previa-padron/[cuit]` preview KPI values for `BI Declarada`, `Impuestos declarados`, and `Deuda` as ARS currency when header data arrives as numeric strings.

### Main Changes

- Added numeric currency parsing and `es-AR` ARS formatting in `applyUnifiedRegisterHeaderToDetail` before assigning declared BI, declared taxes, and debt widget values.
- Kept non-numeric compact mock labels unchanged so existing fixture-only values are not reinterpreted into unsupported magnitudes.
- Added focused tests for numeric header values and compact mock labels across the amount widgets.

### Validation

- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/jest src/modules/unified-register/data/utils/unifiedRegisterDetail.test.ts --runInBand`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/eslint src/modules/unified-register/data/utils/unifiedRegisterDetail.ts src/modules/unified-register/data/utils/unifiedRegisterDetail.test.ts`

## Unified Register Search On Blur - 2026-06-20

### Summary

Changed the `/` Padrón Unificado search input so typing only updates the local field value, while the list request starts when the input loses focus.

### Main Changes

- Added an `onBlur` handler to `UnifiedRegisterSearch`.
- Split typed search text from the applied search term in `useUnifiedRegisterPageSearch`.
- Kept pagination requests tied to the last applied search value instead of the unconfirmed input value.

### Validation

- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/eslint src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx src/modules/unified-register/presentation/components/UnifiedRegisterSearch/index.tsx src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/index.ts src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/useUnifiedRegisterPageSearch.ts`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/typescript/bin/tsc --noEmit --pretty false --incremental false`

## Unified Register Pagination Scroll Reset - 2026-06-20

### Summary

Updated the `/` Padrón Unificado pagination so changing pages scrolls the dashboard view back to the top.

### Main Changes

- Wrapped the pagination `onChange` handler in `UnifiedRegisterPage` to keep the existing page fetch behavior and call `window.scrollTo({ top: 0, behavior: 'smooth' })`.

### Validation

- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/eslint src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/typescript/bin/tsc --noEmit --pretty false --incremental false`

## Unified Register Search Disabled Loading State - 2026-06-20

### Summary

Disabled the `/` Padrón Unificado search input while a search request is pending.

### Main Changes

- Added a `disabled` prop to `UnifiedRegisterSearch`.
- Connected the input disabled state to `isSearchPending` from `useUnifiedRegisterPage`.

### Validation

- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/eslint src/modules/unified-register/presentation/components/UnifiedRegisterPage/index.tsx src/modules/unified-register/presentation/components/UnifiedRegisterSearch/index.tsx`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/typescript/bin/tsc --noEmit --pretty false --incremental false`

## Preview Activity Pills Vertical Alignment - 2026-06-20

### Summary

Adjusted the `/vista-previa-padron/[cuit]` activity pills so the badge text is vertically centered and aligned with each activity row.

### Main Changes

- Centered activity row items vertically.
- Made activity badge roots and labels use inline flex alignment with a stable line height.

### Validation

- `git diff --check`
