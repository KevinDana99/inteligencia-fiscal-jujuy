# Explorer Register Feature Story

## 2026-06-28 - Busqueda global backend en Explorar Padron

- El payload interno de exploracion ahora acepta `search` y el mapper REST lo envia al backend como `busqueda`, normalizado con `trim()` y omitido cuando queda vacio.
- El buscador general de la tabla dejo de filtrar las filas cargadas localmente: ahora actualiza el payload de exploracion, reinicia a pagina 1 y reconsulta el endpoint con debounce corto.
- La paginacion y el cambio de cantidad por pagina reutilizan `lastPayload`, preservando `busqueda`, filtros, columnas y rango temporal activos.
- El mock de exploracion aplica la busqueda global por CUIT o razon social antes de paginar para sostener el mismo flujo funcional en modo mock.
- Se retiro el hook/utilidad de filtro local de filas para evitar una ruta alternativa al contrato de busqueda global del backend.

## 2026-06-24 - Seleccion por checkbox y filtro local de CUITs

- La tabla de resultados de `/explorar-padron` reemplaza la accion `X` por checkboxes Mantine, con seleccion individual y checkbox de encabezado para seleccionar o deseleccionar los resultados visibles.
- Las filas deseleccionadas permanecen visibles y el contador del boton de creacion de lote se alimenta de las filas seleccionadas cargadas.
- Se agrego un buscador local sobre la lista cargada que filtra por CUIT con o sin separadores y por razon social, ignorando mayusculas y acentos.
- La tabla conserva el estado de resultados base y muestra un vacio local cuando el buscador interno no encuentra coincidencias.
- Se agrego cobertura unitaria para la utilidad `filterExplorerRegisterRowsByLocalSearch`.

## 2026-06-20 - Estado inicial sin opciones seleccionadas

- La pantalla `/explorar-padron` ahora inicia sin pills/columnas seleccionadas por defecto.
- `Limpiar filtros` vuelve al mismo estado inicial vacio, sin filtros dinamicos visibles y con el fallback inicial de tabla.
- Se alinearon spec, reglas y prompt historico para reflejar que ya no hay set default activo.
- Se agrego cobertura unitaria para validar que el default vacio no preselecciona columnas.

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

## 2026-06-20 - Locale español para calendarios

- Se agrego `DatesProvider` en el provider raiz de la app con `locale: 'es'` para que los calendarios de Mantine rendericen meses y dias en español.
- Se importo `dayjs/locale/es` en el provider client-side para que `@mantine/dates` pueda resolver correctamente el locale configurado.
- El rango temporal de `/explorar-padron` conserva el formato de valor `YYYY-MM-DD` esperado por el backend, cambiando solo el idioma visible del calendario.

## 2026-06-22 - Periodo explicito para exploraciones

- El bloque `Periodo de busqueda` ahora se muestra siempre en `/explorar-padron`, incluso cuando los filtros seleccionados no son temporales.
- El formulario inicia y reinicia el rango temporal con un periodo default explicito de hasta 36 meses, desde el primer dia del mes inicial hasta la fecha actual.
- El payload de exploracion siempre envia `startDate` y `endDate`; si por estado previo llegan vacios, el builder completa el mismo rango default antes de llamar al backend.
- La validacion de fechas pasa a aplicar para cualquier busqueda, evitando depender de la resolucion de periodo default del backend en prod.

## Verificacion

- `bun x jest src/modules/explorer-register --runInBand`
- `bun x eslint src/modules/explorer-register`
- `bun x tsc --noEmit` queda bloqueado por un fixture ajeno en `src/modules/unified-register/presentation/hooks/useUnifiedRegisterPage/useUnifiedRegisterPageSearch.test.ts`: falta `totalItems` en un objeto `IUnifiedRegisterListData`.
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node node_modules/jest/bin/jest.js src/modules/explorer-register`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node node_modules/typescript/bin/tsc --noEmit`
- `PATH=/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node node_modules/eslint/bin/eslint.js src/modules/explorer-register/presentation/utils/dateExplorerRegisterRange.ts src/modules/explorer-register/presentation/utils/buildExplorerRegisterPayload.ts src/modules/explorer-register/presentation/utils/buildExplorerRegisterPayload.test.ts src/modules/explorer-register/presentation/hooks/explorer-register/useExplorerRegisterForm.ts src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterTemporalFilters.tsx src/modules/explorer-register/presentation/constants/explorerRegisterPresentation.ts`
- `PATH="/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node ./node_modules/jest/bin/jest.js src/modules/explorer-register/presentation/utils/buildExplorerRegisterPayload.test.ts --runInBand`
- `PATH="/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node ./node_modules/eslint/bin/eslint.js src/modules/explorer-register/presentation/constants/explorerRegisterPresentation.ts src/modules/explorer-register/presentation/utils/buildExplorerRegisterPayload.test.ts`
- `PATH="/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ./node_modules/.bin/eslint src/components/core/providers.tsx src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterTemporalFilters.tsx`
- `PATH="/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ./node_modules/.bin/tsc --noEmit --pretty false`
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
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterResultsSection.tsx src/modules/explorer-register/presentation/components/ExplorerRegisterPage/components/ExplorerRegisterResultsTable.tsx src/modules/explorer-register/presentation/hooks/useExplorerRegister.ts src/modules/explorer-register/presentation/hooks/explorer-register/useExplorerRegisterSelection.ts src/modules/explorer-register/presentation/hooks/explorer-register/useExplorerRegisterLocalFilter.ts src/modules/explorer-register/presentation/utils/filterExplorerRegisterRowsByLocalSearch.ts src/modules/explorer-register/presentation/utils/filterExplorerRegisterRowsByLocalSearch.test.ts src/modules/explorer-register/presentation/utils/index.ts src/modules/explorer-register/presentation/hooks/explorer-register/index.ts src/modules/explorer-register/presentation/constants/explorerRegisterPresentation.ts`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/jest/bin/jest.js src/modules/explorer-register/presentation/utils/filterExplorerRegisterRowsByLocalSearch.test.ts --runInBand`
- `/Users/gastonmorales/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/typescript/bin/tsc --noEmit --pretty false`
- `curl -I -sS http://127.0.0.1:3001/explorar-padron` respondio `307` hacia `/login`, esperado para la ruta privada sin sesion.
- `curl -I http://127.0.0.1:3000/explorar-padron` respondio `307` hacia `/login`, esperado para la ruta privada sin sesion.
- Browser interno: `/explorar-padron` redirige a `/login`, sin errores de consola ni overlay real de Next.
