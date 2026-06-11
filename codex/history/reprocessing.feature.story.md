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
