# Reprocessing Feature Story

## 2026-06-11 Marcar reproceso desde Padron Unificado

### Summary

Connected the `Marcar reproceso` action in the contributor preview header to the reusable reprocessing modal and the existing `POST /api/reprocesos` server action.

### Main Changes

- Replaced the mock placeholder modal in `Padrón Unificado` with `SendToReprocessingModal` from the `reprocessing` module.
- Wired the modal confirmation to `markReprocessingAction`, sending `contribuyenteId` and optional `description` as required by the reprocessing HTTP contract.
- Kept the modal open when the backend returns an error and renders the backend message inline.
- Normalized empty or whitespace-only descriptions to `null` before calling the server action.
- Reused the existing dashboard reproceso toast on successful confirmation.

### Validation

- `npx tsc --noEmit --incremental false`
- `npm run lint`
- Existing dev server at `http://localhost:3000` compiles the app; unauthenticated `curl -I http://localhost:3000/vista-previa-padron/30501685212` returns `307 /login`, expected for the private route without a valid session.
- Visual browser verification was not completed because the in-app browser blocked direct localhost navigation and the route requires an authenticated session.

## 2026-06-15 Navegacion desde Reproceso a vista previa padron

### Summary

Connected row selection in `/reproceso` to the contributor preview route `/vista-previa-padron/<CUIT>`.

### Main Changes

- Added `useReprocessingPreviewNavigation` to centralize navigation from reprocessing rows.
- Wired each `ReprocessingTable` row to navigate to `/vista-previa-padron/${CUIT}` using `encodeURIComponent`.
- Kept the destructive `X` action isolated with `stopPropagation()` so removing an item does not trigger row navigation.
- Added keyboard activation and focus styling for the clickable rows.

### Validation

- `bun x eslint src/modules/reprocessing/presentation/components/ReprocessingPage/ReprocessingTable/index.tsx src/modules/reprocessing/presentation/hooks/useReprocessingPreviewNavigation.ts`
- `bun x tsc --noEmit --incremental false`

## 2026-06-15 Paginacion Mantine en Reproceso

### Summary

Added Mantine `Pagination` to `/reproceso` and connected it to the existing paginated `GET /api/reprocesos` contract.

### Main Changes

- Added `ReprocessingPagination` under the `/reproceso` page component tree.
- Centralized reprocessing page state so search and pagination share `pagina`, `itemsPagina`, `totalPaginas`, and active search text.
- Updated search to reset results to page 1 and preserve the active search when changing pages.
- Updated the mock source to slice results by `page` and `itemsPerPage`.
- Centered the pagination below the table with a compact pill treatment and the helper caption from the visual reference.

### Validation

- `bun x tsc --noEmit --incremental false`
- `bun run lint`
- `bun x jest src/modules/unified-register/data/utils/resolveUnifiedRegisterPreviewContributor.test.ts --runInBand`

## 2026-06-20 Espaciado en modal quitar reproceso

### Summary

Added vertical spacing below the remove-from-reprocessing modal header.

### Main Changes

- Updated `ReprocessingRemoveModal.module.css` so the modal body starts 20px below the header divider.
- Kept the modal structure, labels, Mantine usage, and destructive action behavior unchanged.

### Validation

- Verification with Bun was not run because `bun` is not available in the environment (`command not found`).
