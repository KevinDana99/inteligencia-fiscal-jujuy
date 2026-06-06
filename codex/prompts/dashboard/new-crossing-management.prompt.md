# Prompt New Crossing Management Preview

Implementar la nueva vista de `/gestion-de-cruces/vista-previa-cruce/[crossId]` en base a:

- `codex/specs/dashboard/new-crossing-management.spec.md`
- `codex/constraints/dashboard/new-crossing-management.rule.md`

## Alcance

Implementar solo la vista preview/detalle del cruce.

No reemplazar el listado principal de `/gestion-de-cruces`.

## Objetivo

Construir una nueva vista de detalle con dos tabs:

1. `Planilla`
2. `Resumen`

La data debe ser mock local en esta iteración y debe seguir literalmente el ejemplo visual del spec.

## Reglas obligatorias

1. Usar Mantine UI siempre que sea posible.
2. Complementar con CSS Modules solo para layout y estilos que Mantine no cubra bien.
3. Usar Tabler Icons.
4. No implementar todavía contratos backend.
5. No implementar todavía el modal `Generar intimación`.
6. No implementar todavía la reutilización con la template/configuración.
7. No usar localStorage ni cookies.

## Requisitos funcionales

### Header compartido

La vista debe tener un header compartido entre tabs con:

- botón volver a `Gestión de Cruces`
- toggle `Planilla / Resumen`
- card informativa `Cruce en curso`
- metadata:
  - `Lote / CUIT`
  - `Período`
  - `Total CUITs`
  - `Relevantes`

### Tab `Planilla`

Debe mostrar:

- indicadores:
  - `Fuentes BI`
  - `CM05`
  - `Coeficientes`
  - `BI Estimada`
  - `Impuesto`
  - `Final`
- header/toolbar de tabla con:
  - título `Planilla de datos`
  - buscador `Buscar CUIT o razón social...`
- tabla principal mockeada según el ejemplo visual

### Tab `Resumen`

Debe mostrar:

- botón visible `Generar intimación` arriba a la derecha
- tabla 1 de resumen
- tabla 2 `Análisis sistémico por CUIT`
- buscador `Buscar CUIT o razón social...`

## Reglas de data y filtrado

1. La data base del cruce debe ser la misma para ambas tabs.
2. `Planilla` y `Resumen` deben ser dos representaciones distintas de esa misma data.
3. Mockear la data literal según el ejemplo visual del spec.
4. Cada tab debe tener su propio buscador.
5. Cada buscador debe filtrar solo la tabla visible de su propia tab.
6. El filtro debe buscar por:
   - `CUIT`
   - `razón social`
7. Al cambiar de tab, el buscador de la tab a la que se entra debe resetearse.

## Qué no hacer

- no implementar modal de `Generar intimación`
- no tocar todavía el módulo `/configuracion`
- no introducir provider compartido todavía
- no agregar filtros avanzados por columna
- no agregar export real

## Validación final

1. La ruta `/gestion-de-cruces/vista-previa-cruce/[crossId]` debe renderizar la nueva vista completa.
2. La tab `Planilla` debe renderizar indicadores, buscador y tabla.
3. La tab `Resumen` debe renderizar botón, tabla resumen, buscador y tabla de análisis.
4. Los buscadores deben filtrar por `CUIT` y `razón social`.
5. Al cambiar de tab, el buscador visible debe resetearse.
6. Ejecutar `npm run build` y dejar la build pasando.
