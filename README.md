# Catalog Showcase

Proyecto base con Next.js 16 y App Router, generado siguiendo la skill `create-frontend-architecture`.

## Ejecutar

```bash
npm install
npm run dev
```

## Variables

Copiá `.env.example` a `.env.local`.

- `NEXT_PUBLIC_USE_MOCK_CATALOG_SHOWCASE=false`: usa `RestCatalogShowcaseSource`
- Las builds de despliegue deben mantener todos los `NEXT_PUBLIC_USE_MOCK_*` en `false`
- `NEXT_PUBLIC_API_BASE_URL`: base URL para la fuente REST

## Estructura

El módulo principal vive en `src/modules/catalog-showcase/` y contiene:

- `data/`: puertos, modelos, acciones, fuentes mock y REST
- `presentation/`: contextos, hooks y componentes
- `index.tsx`: entry point server component con `withSuspense`

## Cache Components

El proyecto usa `cacheComponents: true` en `next.config.ts`.

- Usar `use cache` en páginas, componentes o funciones server que deban cachearse
- Aplicar la convención compartida con `applyServerCache(...)` desde `src/lib/server-cache.ts`
- Invalidar con `revalidateServerCache(...)`
- Tratar `data-access.ts` como frontera dinámica: no agregar `use cache` ahí si depende de cookies, headers o sesión

## Plantilla Reutilizable

La plantilla base para nuevos módulos quedó en `templates/create-frontend-architecture/module-template/`.
