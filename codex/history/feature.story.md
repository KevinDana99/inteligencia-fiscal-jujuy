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

## 2026-06-26 Orden de intimaciones por ranking

- Se corrigió la agrupación de contribuyentes de `Generar intimación` para ordenar por el ranking aunque la grilla venga identificada por CUIT y la planilla por `taxpayerId`.
- La resolución de contributors ahora registra aliases por `taxpayerId`, CUIT normalizado e `id`, evitando que el PDF/preview caiga al orden de planilla.
- Validado con Jest sobre `groupIntimationExportContributors`, `intimationDocumentPayload` e `intimationDocumentGeneration`, más ESLint focalizado.

## 2026-10-21 Fuentes mock por configuración

- Se activaron todas las banderas `NEXT_PUBLIC_USE_MOCK_*` disponibles en el entorno local, el archivo de ejemplo, Docker, GitLab CI y Kubernetes.
- Se agregaron al entorno local las banderas de documentos y exploración de padrón que no estaban declaradas.
- Se actualizó el README para reflejar que la configuración vigente utiliza las fuentes mock disponibles.
- `configuration-module` conserva su fuente REST porque actualmente no implementa un adaptador mock ni una bandera de selección.
- Validado con búsqueda cruzada de banderas y `git diff --check`.
