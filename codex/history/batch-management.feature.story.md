# Batch Management Feature Story

## Cambio

- Se conecto la pagina `Gestion de Lotes` con la action server-side del modulo para cargar la primera pagina de `/api/lotes`.
- Se dejo `batch-management` usando fuente REST por defecto; el mock queda disponible solo con `NEXT_PUBLIC_USE_MOCK_BATCH_MANAGEMENT=true`.
- Se alineo la serializacion REST con Swagger: query params `Busqueda`, `Pagina`, `ItemsPagina` y form-data `Nombre`, `Descripcion`, `Regimen`, `Archivo`, `Cuits`.
- Se actualizo `.env.example` para apuntar el backend local a `http://localhost:5001`.

## Decisiones

- La ruta privada no expone token al cliente: la obtencion de lotes sigue pasando por server actions y `getServerAuthSession`.
- Se mantiene la UI existente de `BatchManagementPage`; solo cambia la fuente de datos.
- Se conserva fallback local a `http://localhost:5001` para evitar que la feature vuelva a mocks por falta de env local.

## Validacion

- `bun x tsc --noEmit --incremental false`
- `bun x eslint app/'(private)'/gestion-de-lotes/page.tsx src/modules/batch-management/data/data-access.ts src/modules/batch-management/data/sources/rest/RestBatchManagementSource.ts`
