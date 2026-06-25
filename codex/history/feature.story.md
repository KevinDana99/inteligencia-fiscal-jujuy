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
