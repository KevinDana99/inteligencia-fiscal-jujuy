# Analysis Report Rules

## Objetivo

Estas reglas definen restricciones obligatorias para implementar la tab `Informe de análisis` en base a `codex/specs/dashboard/ analysis-report.spec.md`.

## Alcance

1. Esta iteración solo puede tocar la tab `Informe de análisis` dentro del módulo `/configuracion`.
2. No debe modificar el flujo de `/admin`.
3. No debe introducir persistencia real, provider de configuración ni contratos backend en esta etapa.

## Reglas de UI

1. Los componentes deben usar siempre Mantine UI. Solo en casos puntuales donde el styling no se pueda resolver con Mantine se debe complementar con CSS Modules.
2. Los componentes deben usar componentes de Mantine UI. Si para una integración puntual no existe un componente adecuado en la librería, se puede resolver con etiquetas JSX base como `<div>`.
3. La tab visible debe llamarse `Informe de análisis`.
4. El layout de la vista debe ser de una sola columna con `max-width: 600px`.
5. No debe existir preview PDF ni columna lateral de preview en esta tab.

## Reglas funcionales

1. El alert contextual debe usar exactamente el copy definido en la spec.
2. La tab debe tener solo 2 campos editables en esta iteración:
   - `titulo`
   - `cuerpo`
3. El valor default de `titulo` debe ser `INFORME DE INVESTIGACIÓN`.
4. El valor default de `cuerpo` debe ser el texto definido en la spec.
5. El botón `Confirmar cambios` debe existir visualmente.
6. El comportamiento final de persistencia del botón no se define en esta regla.

## Reglas de estado

1. El state de la tab debe ser local de React durante esta iteración.
2. El shape mínimo del state debe ser:

```ts
type AnalysisReportState = {
  titulo: string;
  cuerpo: string;
};
```

3. No debe usarse localStorage, cookies ni sincronización cliente.

## Validación

1. La tab `Informe de análisis` debe verse navegable dentro de `/configuracion`.
2. Debe renderizar:
   - alert contextual
   - card de título
   - card de texto introductorio
   - botón `Confirmar cambios`
3. La vista no debe renderizar preview PDF.
