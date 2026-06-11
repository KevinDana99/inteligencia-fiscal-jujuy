# Explorer Register Feature Story

## 2026-06-11 - Integracion end-to-end con endpoints de Explorar Padron

- Se agrego la capa de datos modular de `explorer-register`: constantes de endpoints/fallback, modelos de dominio, interfaz de source, source REST, source mock, DTOs, mappers y actions server-side.
- La pantalla `/explorar-padron` ahora carga el catalogo server-side y renderiza columnas, filtros, tabla y paginacion desde el contrato dinamico del backend.
- El hook principal quedo como fachada y delega responsabilidades en hooks desacoplados para catalogo, formulario, busqueda paginada y seleccion de resultados.
- Las funciones puras de payload, validacion temporal y resolucion de valores quedaron en `presentation/utils`; los textos, defaults y opciones en `presentation/constants`.
- REST queda activo por defecto; el mock se conserva con `NEXT_PUBLIC_USE_MOCK_EXPLORER_REGISTER=true`; el fallback de API es `https://localhost:5001`.
- Se agregaron tests unitarios para mappers REST y armado/validacion de payload.
- El rango temporal ahora usa dos `DatePickerInput` independientes de `@mantine/dates`, con estilos importados en el layout raiz y valores `YYYY-MM-DD` compatibles con el contrato del backend.

## 2026-06-11 - Crear lote desde Explorar Padron

- Se reutilizo el modal `BatchManagementCreateModal` de Gestion de Lotes en `/explorar-padron`.
- El boton del navbar abre el modal con los CUITs visibles de la tabla de Explorar Padron ya precargados, conservando razon social y permitiendo quitar, importar o agregar CUITs antes de crear.
- El hook de creacion de lotes ahora acepta filas iniciales opcionales sin cambiar el flujo existente de Gestion de Lotes.
- Se agrego un hook desacoplado `useExplorerRegisterBatchCreation` para orquestar la creacion desde Explorar sin acoplar la seleccion al contexto global.
- Se agrego el mapper puro `buildExplorerRegisterBatchRows` en utils con deduplicacion por CUIT normalizado y test unitario.
- Se ajusto el control `switch` de filtros para usar solo componentes Mantine (`Radio` y `Button`) con estilos minimos.

## Verificacion

- `bun x jest src/modules/explorer-register --runInBand`
- `bun x jest src/modules/explorer-register src/modules/batch-management/presentation/hooks --runInBand`
- `bun x eslint app/layout.tsx app/'(private)'/explorar-padron/page.tsx src/modules/explorer-register`
- `bun x eslint app/layout.tsx app/'(private)'/explorar-padron/page.tsx src/modules/explorer-register src/modules/batch-management/presentation/hooks`
- `bun x tsc --noEmit`
- `curl -I http://127.0.0.1:3000/explorar-padron` respondio `307` hacia `/login`, esperado para la ruta privada sin sesion.
