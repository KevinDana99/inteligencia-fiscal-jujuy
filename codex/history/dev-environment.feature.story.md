# Dev environment API base URL fix

## 2026-06-14

- Removed hardcoded `localhost:5001` API base URL fallbacks from `batch-management` and `explorer-register`.
- Kept REST sources using `createAuthenticatedApiClientConfig()` so the API host is resolved only from `NEXT_PUBLIC_API_BASE_URL` or the deployment environment.
- Cleared the local backend value from `.env.example` to avoid breaking shared dev environments by default.
- Verified with `bun run lint` and targeted Jest tests for `src/modules/batch-management` and `src/modules/explorer-register`.

## Build-time deployment env

- Added Docker build args for `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_USE_MOCK_AUTH`, `NEXT_PUBLIC_USE_MOCK_ADMIN_PANEL`, and `NEXT_PUBLIC_USE_MOCK_CATALOG_SHOWCASE`.
- Set those args as build-stage env vars before `npm run build`, with a fail-fast check for missing `NEXT_PUBLIC_API_BASE_URL`.
- Updated GitLab CI validation and image build jobs to compile with `http://rentas-if-backend.rentas-if.svc.cluster.local`.
- Added `.dockerignore` so local `.env` files cannot contaminate the image build context.

## Disable build mocks

- Changed Docker build defaults so every `NEXT_PUBLIC_USE_MOCK_*` flag is explicitly `false`.
- Updated GitLab CI validation and image build args to pass all mock flags as `false`.
- Updated dev ConfigMap and `.env.example` so runtime/default config also avoids mock data.

## 2026-06-15 local backend login check

- Created local ignored `.env.local` with `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001` and all `NEXT_PUBLIC_USE_MOCK_*` flags set to `false`.
- Verified the local backend responds `200 OK` on `GET /api/iam/salud` and Swagger at `http://localhost:5001/swagger/index.html`.
- Confirmed direct login requests now reach the backend host; invalid sample credentials return backend `401` with `iam.inicio_sesion.invalido`.
- Verified the existing Next dev server reloaded `.env.local`, `/login` responds `200 OK`, and `bun run lint` exits successfully.
