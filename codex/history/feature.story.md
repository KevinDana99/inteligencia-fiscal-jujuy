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

## 2026-10-21 Normalización del tipo de multa

- Se corrigió el mapper REST del padrón unificado para convertir `tipo` desde el string abierto del DTO al conjunto de valores admitidos por el dominio.
- Los tipos conocidos se normalizan sin distinguir mayúsculas ni espacios; valores vacíos o desconocidos se convierten en `null`.
- Se agregaron pruebas unitarias para los tres tipos admitidos y los casos sin valor o no soportados.
- Validado con Jest focalizado, ESLint y `next build` mediante Bun.

## 2026-10-21 Credenciales visibles para login mock

- El formulario precarga las credenciales del analista cuando `NEXT_PUBLIC_USE_MOCK_AUTH=true`.
- El aviso simple debajo del botón muestra las credenciales mock del analista y del administrador.
- Los valores visibles se leen desde `AUTH_MOCK_USERS`, la misma configuración utilizada por `MockAuthSource`, para evitar divergencias.
- Los avisos de sesión expirada y recuperación de contraseña ahora comparten un único estado y son mutuamente excluyentes.
- La habilitación visual del modo mock ahora se resuelve en el Server Component y se pasa como prop al formulario, evitando divergencias entre variables de build y runtime.
- Se agregó `USE_MOCK_AUTH=true` como bandera server-only prioritaria para que la selección de `MockAuthSource` y la tarjeta del login respondan al entorno runtime de Kubernetes.

## 2026-10-22 Auth mock en despliegues de Vercel

- Se agregó `vercel.json` con `USE_MOCK_AUTH=true` para que los despliegues gestionados por Vercel habiliten la fuente mock y muestren las credenciales de prueba.
- La configuración mantiene la bandera del lado servidor y evita depender de una variable `NEXT_PUBLIC_*` fijada durante el build.
- Se alinearon en Vercel las banderas mock de los módulos de negocio con la configuración demo del repositorio, evitando combinar una sesión mock con fuentes REST que requieren un backend y token reales.
