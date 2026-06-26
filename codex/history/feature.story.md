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

## 2026-06-26 Preview header jurisdiction

- Se removió el campo genérico `Jurisdicción` del encabezado de `/vista-previa-padron/[cuit]`.
- Se mantienen visibles `Jurisdicción sede` y `Jurisdicciones extrañas`.
- Validado con ESLint sobre `PreviewHeaderSummary.tsx`.

## 2026-06-26 Reproceso por CUIT

- Se revisó `/gestion-de-cruces/vista-previa-cruce/[crossId]` y se corrigió el marcado de reproceso para enviar el CUIT del contribuyente en el payload del POST.
- `POST /api/reprocesos` ahora serializa `{ cuit, descripcion }` desde la capa REST de reprocesos, manteniendo `contribuyenteId` para respuestas y desmarcado.
- Validado con Jest sobre `RestReprocessingSource.test.ts` y ESLint focalizado sobre los archivos modificados.
