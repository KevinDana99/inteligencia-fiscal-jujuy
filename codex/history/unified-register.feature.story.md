# Unified Register Feature Story

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
