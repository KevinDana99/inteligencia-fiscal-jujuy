# Metadata Feature Story

## Summary

- Se centralizó la configuración de metadata de la aplicación.
- Se reemplazó la descripción placeholder global por una descripción institucional.
- Se agregaron metadata global, viewport, canonical, Open Graph, Twitter card, icons, manifest y robots.
- Se agregó metadata específica para rutas públicas, privadas, administrativas y vistas dinámicas.
- Se agregó `NEXT_PUBLIC_APP_URL` para configurar `metadataBase` por ambiente.

## Validation

- Validado con ESLint usando el runtime Node bundled de Codex.
- Validado con `next build` usando el runtime Node bundled de Codex.

## 2026-06-25 Preview metrics empty values

- Se agregó fallback visual `-` para las cards de métricas de `/vista-previa-padron/[cuit]` cuando el valor llega vacío.
- El fallback aplica tanto a métricas simples como a los valores partidos de declaraciones juradas.
- Validado con ESLint sobre `PreviewMetrics.tsx` y `next build` usando el runtime Node bundled de Codex.
