# Explorer Register Feature Story

## 2026-06-11 - Integracion end-to-end con endpoints de Explorar Padron

- Se agrego la capa de datos modular de `explorer-register`: constantes de endpoints/fallback, modelos de dominio, interfaz de source, source REST, source mock, DTOs, mappers y actions server-side.
- La pantalla `/explorar-padron` ahora carga el catalogo server-side y renderiza columnas, filtros, tabla y paginacion desde el contrato dinamico del backend.
- El hook principal quedo como fachada y delega responsabilidades en hooks desacoplados para catalogo, formulario, busqueda paginada y seleccion de resultados.
- Las funciones puras de payload, validacion temporal y resolucion de valores quedaron en `presentation/utils`; los textos, defaults y opciones en `presentation/constants`.
- REST queda activo por defecto; el mock se conserva con `NEXT_PUBLIC_USE_MOCK_EXPLORER_REGISTER=true`; el fallback de API es `https://localhost:5001`.
- Se agregaron tests unitarios para mappers REST y armado/validacion de payload.
- El rango temporal ahora usa dos `DatePickerInput` independientes de `@mantine/dates`, con estilos importados en el layout raiz y valores `YYYY-MM-DD` compatibles con el contrato del backend.

## Verificacion

- `bun x jest src/modules/explorer-register --runInBand`
- `bun x eslint app/layout.tsx app/'(private)'/explorar-padron/page.tsx src/modules/explorer-register`
- `bun x tsc --noEmit`
- `curl -I http://127.0.0.1:3000/explorar-padron` respondio `307` hacia `/login`, esperado para la ruta privada sin sesion.
