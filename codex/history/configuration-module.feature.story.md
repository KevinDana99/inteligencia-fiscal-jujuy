# Configuration Module Feature Story

## 2026-06-09 Swagger configuration endpoint alignment

- Se reviso Swagger local `http://localhost:5001/swagger/index.html`: configuracion solo expone `GET /api/configuracion/intimacion` y no publica `/api/configuracion/informe`.
- `RestConfigurationSource` dejo de llamar `/api/configuracion/informe`; el informe usa fallback local hasta que exista contrato backend.
- Los DTOs de plantilla de intimacion aceptan campos nullable/ausentes segun Swagger y la action dejo de imprimir logs con endpoints obsoletos.

### Validation

- `bun x tsc --noEmit --pretty false --incremental false`
- `bun run lint` sin errores; persisten 4 warnings existentes en `unified-register`.
- `git diff --check`

## 2026-06-06 Configuration page refactor

- `ConfigurationPage` quedó como composición de header, tabs, contenido y modal; la orquestación vive en `useConfigurationPage`.
- `useDashboardConfiguration` quedó como fachada y delega tabs, edición de informe y modal de éxito en hooks SOLID.
- `useIntimationTemplate` se movió a `presentation/hooks/intimation-template` y conserva un re-export desde la ruta anterior para compatibilidad.
- El estado del template, el mapeo desde `ConfigProvider`, las columnas disponibles y el merge de configuración quedaron en `presentation/utils`.
- Las opciones de columnas y tabs pasaron a `presentation/constants`, separando datos estáticos de funciones.
- `IntimationTemplateColumnPickerModal` se separó en lista, acciones y footer; su CSS también quedó particionado por bloque visual.
- Se ajustó `IntimationExportModal` para consumir los types del template desde `configuration-module`, evitando imports a una ruta inexistente.

### Validation

- `npx tsc --noEmit`
- `npx eslint src/modules/configuration-module src/modules/cross-management/presentation/components/IntimationExportModal/IntimationExportPreviewDocument.tsx src/modules/cross-management/presentation/components/IntimationExportModal/IntimationExportPreviewTable.tsx src/modules/cross-management/presentation/hooks/intimation-export/useIntimationExportDocument.ts`
- `npx eslint .` queda sin errores; persisten 4 warnings existentes en `unified-register`.
- `git diff --check`
