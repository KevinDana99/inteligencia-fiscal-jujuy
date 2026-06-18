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

## 2026-06-17 - Refactor de ExplorerRegisterPage

- `ExplorerRegisterPage` quedo como componente orquestador y delega navbar, columnas, filtros, errores, tabla, paginacion y estados vacios en componentes especificos.
- Las opciones globales del filtro de agente se movieron a `presentation/constants/explorerRegisterPage.ts`.
- La resolucion del error visible se movio a `presentation/utils/getExplorerRegisterDisplayedError.ts`.
- Los componentes nuevos comparten el contrato del hook mediante `ExplorerRegisterController`, evitando duplicar tipos derivados de `useExplorerRegister`.
- La carpeta `ExplorerRegisterPage` quedo con archivos por debajo de 150 lineas; el archivo mas grande es `ExplorerRegisterMultiValueField.tsx` con 121 lineas.
- Los estilos se separaron por responsabilidad en modulos CSS especificos de navbar, columnas, filtros, inputs, multivalor, switch y resultados.

## 2026-06-18 - Icono de calendario en filtros temporales

- Los `DatePickerInput` de fecha inicio y fecha fin en `/explorar-padron` ahora muestran `IconCalendar` como seccion izquierda del input.
- Las pills de `Columnas y filtros disponibles` relacionadas con filtros temporales ahora muestran `IconCalendar` a la izquierda del texto.
- El rango temporal ahora se renderiza como un unico bloque `Periodo de busqueda` compartido por todos los filtros temporales activos, con dos `DatePickerInput` y `IconArrowRight` entre fecha inicio y fecha fin.
- El selector de fecha fin usa `minDate` a partir de fecha inicio, y el selector de fecha inicio usa `maxDate` cuando existe fecha fin para impedir rangos invertidos.
- Se mantuvo Mantine como base del control y `@tabler/icons-react` como fuente de iconos, consistente con el resto del modulo.

## Verificacion

- `bun x jest src/modules/explorer-register --runInBand`
- `bun x jest src/modules/explorer-register src/modules/batch-management/presentation/hooks --runInBand`
- `bun x eslint app/layout.tsx app/'(private)'/explorar-padron/page.tsx src/modules/explorer-register`
- `bun x eslint app/layout.tsx app/'(private)'/explorar-padron/page.tsx src/modules/explorer-register src/modules/batch-management/presentation/hooks`
- `bun x eslint src/modules/explorer-register/presentation/components/ExplorerRegisterPage src/modules/explorer-register/presentation/constants src/modules/explorer-register/presentation/utils`
- `bun x eslint src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterTemporalFilters.tsx`
- `bun x eslint src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterColumnPills.tsx src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterTemporalFilters.tsx`
- `bun x eslint src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterColumnPills.tsx src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterFiltersCard.tsx src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterTemporalFilters.tsx src/modules/explorer-register/presentation/constants/explorerRegisterPresentation.ts`
- `bun x tsc --noEmit`
- `bun x jest src/modules/explorer-register --runInBand`
- `bun run build`
- `curl -I http://127.0.0.1:3000/explorar-padron` respondio `307` hacia `/login`, esperado para la ruta privada sin sesion.
- Browser interno: `/explorar-padron` redirige a `/login`, sin errores de consola ni overlay real de Next.
