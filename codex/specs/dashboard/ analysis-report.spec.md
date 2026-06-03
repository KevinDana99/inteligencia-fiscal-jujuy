## Spec Analysis Report Config Module

- Referencia Visual: `codex/assets/design/dashboard/config-module/config-module-4.png`

## Requisitos

1. Los componentes deben usar siempre Mantine UI. Solo en casos puntuales donde el styling no se pueda resolver con Mantine se debe complementar con CSS Modules.
2. Los componentes deben usar componentes de Mantine UI. Si para una integración puntual no existe un componente adecuado en la librería, se puede resolver con etiquetas JSX base como `<div>`.

## Alcance

1. Esta spec cubre solo la tab `Informe de análisis` dentro del módulo `/configuracion`.
2. La tab se muestra dentro del módulo de configuración del dashboard privado.
3. Esta iteración resuelve solo UI y state local.
4. La persistencia real, el provider de configuración y los contratos backend se definirán en otra spec.

## Definiciones cerradas

1. El nombre de la tab debe ser `Informe de análisis`.
2. El título configurable del documento debe ser `INFORME DE INVESTIGACIÓN`.
3. El copy del alert contextual queda exactamente como figura en esta spec.
4. Esta iteración tiene solo 2 campos editables para la tab:
   - `titulo`
   - `cuerpo`
5. El botón `Confirmar cambios` debe existir visualmente, pero su comportamiento final de persistencia no se define en esta spec.

## Estructura

Alert:
`Configuración global del Informe de Investigación. Solo el título y el texto se editan acá y aplican a todos los usuarios. Los datos del contribuyente, la acción fiscalizadora y los cruces se completan al generar el informe desde el Padrón Unificado.`

Form

- Section-Card:
  title: `Título del informe`
  label: `Texto del título`
  input value: `INFORME DE INVESTIGACIÓN`

- Section-Card:
  title: `Texto introductorio`
  label: `Cuerpo del informe`
  input TextArea: `Se eleva para su conocimiento y consideración, informe sobre la situación fiscal del contribuyente abajo descripto, solicitando el cargo al Dpto. Inspecciones y Verificaciones, conforme a los fundamentos, datos y periodos fiscales que se indican a continuación:`

---

Footer:
Button: Confirmar cambios (el mismo que en intimacion)

## Estado mínimo

```ts
type AnalysisReportState = {
  titulo: string;
  cuerpo: string;
};
```

Default values:

```ts
{
  titulo: 'INFORME DE INVESTIGACIÓN',
  cuerpo:
    'Se eleva para su conocimiento y consideración, informe sobre la situación fiscal del contribuyente abajo descripto, solicitando el cargo al Dpto. Inspecciones y Verificaciones, conforme a los fundamentos, datos y periodos fiscales que se indican a continuación:'
}
```

## Diseño y UI

<div id="cfg-doc-inf" style="display: block;">
        <div style="max-width:600px">

          <!-- Aviso contextual -->
          <div style="background:var(--blue-1);border:1px solid #BFDBFE;border-radius:10px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-5)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div style="font-size:12.5px;color:var(--blue-7);line-height:1.5">
              <strong>Configuración global del Informe de Investigación.</strong> Solo el título y el texto se editan acá y aplican a todos los usuarios. Los datos del contribuyente, la acción fiscalizadora y los cruces se completan al generar el informe desde el Padrón Unificado.
            </div>
          </div>

          <!-- Título -->
          <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px 20px;margin-bottom:14px">
            <div style="font-size:12px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">Título del informe</div>
            <div class="form-group">
              <label class="form-label">Texto del título</label>
              <input class="form-input" id="inf-titulo" value="INFORME DE INVESTIGACIÓN">
            </div>
          </div>

          <!-- Texto / cuerpo -->
          <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px 20px;margin-bottom:14px">
            <div style="font-size:12px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">Texto introductorio</div>
            <div class="form-group">
              <label class="form-label">Cuerpo del informe</label>
              <textarea class="form-input" id="inf-cuerpo" rows="5" style="resize:vertical">Se eleva para su conocimiento y consideración, informe sobre la situación fiscal del contribuyente abajo descripto, solicitando el cargo al Dpto. Inspecciones y Verificaciones, conforme a los fundamentos, datos y periodos fiscales que se indican a continuación:</textarea>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px;padding-bottom:8px">
            <button id="btn-confirmar-informe" class="btn btn-primary btn-sm">Confirmar cambios</button>
          </div>

        </div>
      </div>
