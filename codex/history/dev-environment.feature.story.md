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
