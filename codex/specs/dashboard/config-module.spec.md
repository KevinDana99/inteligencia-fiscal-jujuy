## Spec Config Module

- Referencias visuales: `codex/assets/design/dashboard/config-module/config-module-1.png` , `codex/assets/design/dashboard/config-module/config-module-2.png` y `codex/assets/design/dashboard/config-module/config-module-3.png`

## Requisitos

1. Usar siempre Mantine UI para componentes. Si una pieza no se resuelve con Mantine, complementar con JSX y CSS Modules.
2. Usar siempre Mantine UI para estilos. Si una pieza no se resuelve con props de Mantine, complementar con CSS Modules.
3. Para iconos mapeados usar `globals/icons` si ya existe el mapeo. Si no existe, usar Tabler Icons como libreria base.

## Alcance

1. Este modulo vive en `/configuracion` dentro del dashboard privado.
2. No tiene relacion con `/admin`.
3. Esta iteracion trabaja solo con state local de React.
4. No se debe crear cookie, localStorage ni persistencia cliente para esta etapa.
5. La persistencia real vendra del backend cuando exista contrato.

## Funcionalidades

1. Todos los inputs deben ser editables.
2. Todos los inputs arrancan con los default values definidos en esta spec.
3. El estado inicial se arma a partir de esos defaults dentro del componente/hook.
4. `Intimación` es la tab activa por defecto.
5. `Informe de análisis` existe como tab, pero por ahora solo muestra una vista simple con el titulo.
6. El header se comparte entre tabs.
7. El resto del contenido cambia segun la tab activa.
8. `Previsualizar PDF` debe abrir una nueva pestaña del navegador y mostrar el PDF mediante el visor nativo del browser.
9. La preview del PDF debe salir del documento maquetado que se ve en la vista activa.
10. `Confirmar cambios` debe mostrar un modal de exito con un mensaje del tipo `Se guardaron los cambios correctamente`.

## Estado minimo

La pantalla debe poder representarse con un state local equivalente a:

```ts
type ConfigTab = 'intimacion' | 'informe';

type ConfigState = {
  activeTab: ConfigTab;
  intimacion: {
    asunto: string;
    saludo: string;
    cuerpo: string;
    cierre: string;
    piePlanilla: string;
    columnas: string[];
  };
  informe: {
    titulo: string;
  };
};
```

## Comportamiento esperado

1. `Previsualizar PDF` debe abrir la vista del documento actual en una nueva pestaña externa a la aplicacion.
2. La preview no debe ser una ruta interna del dashboard.
3. La vista activa define el contenido que luego se previsualiza como PDF.
4. `Intimación` muestra el documento completo con sus cards y preview.
5. `Informe de análisis` muestra solo un titulo simple por ahora.
6. `Confirmar cambios` no persiste aun en backend y solo confirma visualmente la accion.

## Estructura

header:
Personalizar documentos de salida
Editá la estructura de los documentos generados. Los cambios se aplican globalmente al confirmar.
buttons:
intimacion
informe de analisis (debe existir como tab y por ahora mostrar solo un titulo simple)

---

Asunto (title card)
Texto del asunto (label)
input text
default value:
PRESUNTA DIFERENCIA DE BASE IMPONIBLE

---

Cuerpo del documento (title card)
Saludo (label)
input text
Señor Contribuyente:
Texto del cuerpo (label)
input textarea (scrolleable)
default value:
Por medio de la presente, la Dirección Provincial de Rentas de Jujuy pone en su conocimiento que sobre la base de información cierta, derivada del cruce de bases de datos con el organismo recaudador nacional (ARCA) y los agentes de recaudación designados por este organismo, se han detectado inconsistencias en sus declaraciones juradas y en el cumplimiento de sus obligaciones fiscales en los periodos que se detallan en planilla adjunta.

Por ello, y en uso de las facultades conferidas a este organismo por el art. 10º inc. 3 del Código Fiscal, Ley Nro. 5791/2013, se lo intima para que en el término de diez (10) días proceda a presentar las declaraciones juradas originales o rectificativas, e ingrese el impuesto omitido más los intereses a la fecha del efectivo pago.

En caso de no regularizar su situación fiscal, la Dirección podrá dar inicio a una verificación integral, perdiendo Ud. el beneficio del cumplimiento voluntario debiendo abonar además del tributo las sanciones previstas en los artículos 48° y 49º del Código Fiscal (Ley 5791/2013), sin perjuicio de dar inicio al procedimiento de determinación de oficio en los términos del artículo 37° del mencionado plexo normativo.

Para dar cumplimiento a esta intimación podrá comunicarse con el Departamento Inteligencia Fiscal al siguiente correo electrónico: inteligenciafiscal@rentasjujuy.gob.ar o al Centro de Atención 0800-555-5599 en el horario de 07:30 a 12:30 o personalmente en Lavalle 55 - San Salvador de Jujuy - de Lunes a Viernes en el horario de 07:30 a 12:30.

---

Cierre (title card)
Texto de cierre (label)
input text
default value:
Queda/n Ud/s. debidamente notificado/s.

---

Planilla adjunta — Columnas (title card)
Columnas que aparecen en la tabla de comparación de bases

default value columns: (inputs text editables)

✓
AÑO
×
✓
Base Imponible Ingresos Brutos
×
✓
Base Imponible Informada por Terceros (_)
×
✓
Diferencia de Base Imponible
×
✓
Fuente de Información (_)

button add columns

Texto pie de planilla (label)
input text
default value:
Queda/n Ud/s. debidamente notificado/s.

---

buttons pie de pagina (fuera de la ultima card abajo de ella)
Previsualizar PDF
Confirmar cambios

## Validacion funcional

1. `/configuracion` debe abrir dentro del dashboard privado.
2. `Intimación` debe ser el tab inicial activo.
3. `Informe de análisis` debe mostrar solo un titulo simple por ahora.
4. `Previsualizar PDF` debe abrir una nueva pestaña del navegador con el documento renderizado.
5. `Confirmar cambios` debe mostrar un modal de exito.
6. No debe haber persistencia cliente.

## Layout

Header ///////////////////////////////////////////////////////////////////////////////////////////////////
Asunto Card - Preview de documento (fixed o sticky top 0 de seccion despues de header)
Cuerpo del documento Card - Preview de documento (fixed o sticky top 0 de seccion despues de header)
Cierre Card - Preview de documento (fixed o sticky top 0 de seccion despues de header)
Plantilla adjunta - columnas Card - Preview de documento (fixed o sticky top 0 de seccion despues de header)
Buttons pie de pagina - Preview de documento (fixed o sticky top 0 de seccion despues de header)

## Diseño y UI

<div class="page">

    <!-- TABS -->
    <div style="display:flex;border-bottom:1px solid var(--gray-2);margin-bottom:24px;background:white;border-radius:12px 12px 0 0;overflow:hidden;border:1px solid var(--gray-2);border-bottom:none">
      <button class="cfg-tab active" id="cfg-tab-docs" onclick="setCfgTab('docs')" style="padding:16px 24px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--blue-5);cursor:pointer;border-bottom:2px solid var(--blue-5);margin-bottom:-1px;display:flex;align-items:center;gap:8px">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        Documentos de salida
      </button>
    </div>

    <!-- ══ TAB: PARÁMETROS DE CRUCES ══ -->


    <!-- ══ TAB: DOCUMENTOS DE SALIDA ══ -->
    <div id="cfg-panel-docs">

      <div style="margin-bottom:20px">
        <div style="font-size:16px;font-weight:800;color:var(--gray-9)">Personalizar documentos de salida</div>
        <div style="font-size:13px;color:var(--gray-5);margin-top:4px">Editá la estructura de los documentos generados. Los cambios se aplican globalmente al confirmar.</div>
      </div>

      <!-- Sub-tabs: Intimación / Informe -->
      <div style="display:flex;gap:8px;margin-bottom:20px">
        <button class="cfg-doc-tab active" id="cfg-doc-tab-int" onclick="setCfgDocTab('int')" style="background: var(--blue-5); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 999px; padding: 7px 18px; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 13px; font-weight: 600; cursor: pointer;">Intimación</button>
        <button class="cfg-doc-tab" id="cfg-doc-tab-inf" onclick="setCfgDocTab('inf')" style="background: white; color: var(--gray-7); border: 1px solid var(--gray-2); border-radius: 999px; padding: 7px 18px; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 13px; font-weight: 500; cursor: pointer;">Informe de análisis</button>
      </div>

      <!-- INTIMACIÓN -->
      <div id="cfg-doc-int" style="display: block;">

        <!-- PREVIEW + EDITOR en dos columnas -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

          <!-- COLUMNA IZQUIERDA: Editor -->
          <div style="display:flex;flex-direction:column;gap:14px">

            <!-- Asunto -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px 20px">
              <div style="font-size:12px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">Asunto</div>
              <div class="form-group">
                <label class="form-label">Texto del asunto</label>
                <input class="form-input" id="int-asunto" value="PRESUNTA DIFERENCIA DE BASE IMPONIBLE">
              </div>
            </div>

            <!-- Cuerpo del documento -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px 20px">
              <div style="font-size:12px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">Cuerpo del documento</div>
              <div class="form-group" style="margin-bottom:12px">
                <label class="form-label">Saludo</label>
                <input class="form-input" id="int-saludo" value="Señor Contribuyente:">
              </div>
              <div class="form-group">
                <label class="form-label">Texto del cuerpo</label>
                <textarea class="form-input" id="int-cuerpo" rows="12" style="resize:vertical">Por medio de la presente, la Dirección Provincial de Rentas de Jujuy pone en su conocimiento que sobre la base de información cierta, derivada del cruce de bases de datos con el organismo recaudador nacional (ARCA) y los agentes de recaudación designados por este organismo, se han detectado inconsistencias en sus declaraciones juradas y en el cumplimiento de sus obligaciones fiscales en los periodos que se detallan en planilla adjunta.

Por ello, y en uso de las facultades conferidas a este organismo por el art. 10º inc. 3 del Código Fiscal, Ley Nro. 5791/2013, se lo intima para que en el término de diez (10) días proceda a presentar las declaraciones juradas originales o rectificativas, e ingrese el impuesto omitido más los intereses a la fecha del efectivo pago.

En caso de no regularizar su situación fiscal, la Dirección podrá dar inicio a una verificación integral, perdiendo Ud. el beneficio del cumplimiento voluntario debiendo abonar además del tributo las sanciones previstas en los artículos 48° y 49º del Código Fiscal (Ley 5791/2013), sin perjuicio de dar inicio al procedimiento de determinación de oficio en los términos del artículo 37° del mencionado plexo normativo.

Para dar cumplimiento a esta intimación podrá comunicarse con el Departamento Inteligencia Fiscal al siguiente correo electrónico: inteligenciafiscal@rentasjujuy.gob.ar o al Centro de Atención 0800-555-5599 en el horario de 07:30 a 12:30 o personalmente en Lavalle 55 - San Salvador de Jujuy - de Lunes a Viernes en el horario de 07:30 a 12:30.</textarea>

</div>
</div>

            <!-- Cierre -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px 20px">
              <div style="font-size:12px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px">Cierre</div>
              <div class="form-group">
                <label class="form-label">Texto de cierre</label>
                <input class="form-input" id="int-cierre" value="Queda/n Ud/s. debidamente notificado/s.">
              </div>
            </div>

            <!-- Planilla adjunta - columnas -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px 20px">
              <div style="font-size:12px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Planilla adjunta — Columnas</div>
              <div style="font-size:12px;color:var(--gray-5);margin-bottom:12px">Columnas que aparecen en la tabla de comparación de bases</div>
              <div style="display:flex;flex-direction:column;gap:8px" id="cfg-cols-int">
                <div class="cfg-col-row"><span style="color:var(--green-5);font-weight:700">✓</span><input class="form-input" value="AÑO" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
                <div class="cfg-col-row"><span style="color:var(--green-5);font-weight:700">✓</span><input class="form-input" value="Base Imponible Ingresos Brutos" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
                <div class="cfg-col-row"><span style="color:var(--green-5);font-weight:700">✓</span><input class="form-input" value="Base Imponible Informada por Terceros (*)" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
                <div class="cfg-col-row"><span style="color:var(--green-5);font-weight:700">✓</span><input class="form-input" value="Diferencia de Base Imponible" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
                <div class="cfg-col-row"><span style="color:var(--green-5);font-weight:700">✓</span><input class="form-input" value="Fuente de Información (*)" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
              </div>
              <button onclick="cfgAgregarCol()" style="margin-top: 10px; background: var(--gray-0); border-color: var(--gray-3); border-top-style: ; border-top-width: ; border-right-style: ; border-right-width: ; border-bottom-style: ; border-bottom-width: ; border-left-style: ; border-left-width: ; border-image-source: ; border-image-slice: ; border-image-width: ; border-image-outset: ; border-image-repeat: ; border-radius: 8px; padding: 8px; width: 100%; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 12.5px; color: var(--gray-5); cursor: pointer; transition: 0.12s;" onmouseover="this.style.borderColor='var(--blue-5)';this.style.color='var(--blue-5)'" onmouseout="this.style.borderColor='var(--gray-3)';this.style.color='var(--gray-5)'">+ Elegir columnas de planilla</button>
              <div class="form-group" style="margin-top:14px">
                <label class="form-label">Texto pie de planilla</label>
                <input class="form-input" id="int-pie-planilla" value="Fecha de corte 11/2025.">
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:8px;padding-bottom:8px">
              <button class="btn btn-outline btn-sm">Previsualizar PDF</button>
              <button class="btn btn-primary btn-sm" onclick="showToast('✅ Intimación actualizada','success')">Confirmar cambios</button>
            </div>

          </div>

          <!-- COLUMNA DERECHA: Preview del documento -->
          <div style="position:sticky;top:16px;align-self:start">
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;overflow:hidden">
              <div style="background:var(--gray-0);border-bottom:1px solid var(--gray-2);padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
                <div style="font-size:12px;font-weight:700;color:var(--gray-7)">Preview — Intimación</div>
                <span style="background:var(--blue-1);color:var(--blue-5);font-size:11px;font-weight:600;padding:2px 10px;border-radius:999px">Página 1</span>
              </div>
              <!-- Simulación del documento -->
              <div style="padding:28px 32px;font-size:11.5px;color:#1E293B;line-height:1.7;font-family:Georgia,serif;max-height:600px;overflow-y:auto">
                <!-- Logo simulado -->
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
                  <div style="width:48px;height:48px;background:#2563EB;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:18px">R</div>
                  <div style="font-size:10px;font-weight:700;color:#2563EB;line-height:1.3">DIRECCIÓN PROVINCIAL DE<br>RENTAS</div>
                </div>
                <div style="text-align:right;font-weight:700;font-size:11px;margin-bottom:16px">SAN SALVADOR DE JUJUY, 21 DE ENERO DE 2026</div>
                <div style="font-weight:700;margin-bottom:2px">CONTRIBUYENTE: [NOMBRE DEL CONTRIBUYENTE]</div>
                <div style="font-weight:700;margin-bottom:8px">CUIT: [CUIT]</div>
                <div style="text-align:center;font-weight:700;margin-bottom:16px">ASUNTO: PRESUNTA DIFERENCIA DE BASE IMPONIBLE</div>
                <div style="font-weight:700;margin-bottom:10px">Señor Contribuyente:</div>
                <p style="margin-bottom:10px;text-align:justify">Por medio de la presente, la Dirección Provincial de Rentas de Jujuy pone en su conocimiento que sobre la base de información cierta, derivada del cruce de bases de datos con el organismo recaudador nacional (ARCA) y los agentes de recaudación designados por este organismo, se han detectado inconsistencias en sus declaraciones juradas y en el cumplimiento de sus obligaciones fiscales en los periodos que se detallan en planilla adjunta.</p>
                <p style="margin-bottom:10px;text-align:justify">Por ello, y en uso de las facultades conferidas a este organismo por el art. 10º inc. 3 del Código Fiscal, Ley Nro. 5791/2013, se lo intima para que en el término de diez (10) días proceda a presentar las declaraciones juradas originales o rectificativas, e ingrese el impuesto omitido más los intereses a la fecha del efectivo pago.</p>
                <p style="margin-bottom:10px;text-align:justify">En caso de no regularizar su situación fiscal, la Dirección podrá dar inicio a una verificación integral, perdiendo Ud. el beneficio del cumplimiento voluntario debiendo abonar además del tributo las sanciones previstas en los artículos 48° y 49º del Código Fiscal (Ley 5791/2013), sin perjuicio de dar inicio al procedimiento de determinación de oficio en los términos del artículo 37° del mencionado plexo normativo.</p>
                <p style="margin-bottom:16px;text-align:justify">Para dar cumplimiento a esta intimación podrá comunicarse con el Departamento Inteligencia Fiscal al siguiente correo electrónico: inteligenciafiscal@rentasjujuy.gob.ar o al Centro de Atención 0800-555-5599 en el horario de 07:30 a 12:30 o personalmente en Lavalle 55 - San Salvador de Jujuy - de Lunes a Viernes en el horario de 07:30 a 12:30.</p>
                <p>Queda/n Ud/s. debidamente notificado/s.</p>
                <div style="text-align:center;margin-top:24px">
                  <div style="width:64px;height:64px;border:3px solid #1E293B;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;text-align:center;line-height:1.2;color:#1E293B">DIRECCIÓN<br>PCIAL. DE<br>RENTAS</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- INFORME -->
      <div id="cfg-doc-inf" style="display: none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div>
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:20px">
              <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:14px">Encabezado del informe</div>
              <div class="form-group" style="margin-bottom:12px">
                <label class="form-label">Título</label>
                <input class="form-input" value="INFORME DE ANÁLISIS FISCAL — INTELIGENCIA FISCAL DGR JUJUY">
              </div>
              <div class="form-group">
                <label class="form-label">Descripción del informe</label>
                <textarea class="form-input" rows="4" style="resize:vertical">El presente informe resume los resultados del análisis fiscal realizado sobre el contribuyente identificado, detallando las inconsistencias detectadas y los criterios aplicados para su determinación.</textarea>
              </div>
            </div>
          </div>
          <div>
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:20px;margin-bottom:16px">
              <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:14px">Secciones del informe</div>
              <div style="display:flex;flex-direction:column;gap:8px" id="cfg-cols-inf">
                <div class="cfg-col-row"><span>✓</span><input class="form-input" value="Datos del contribuyente" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
                <div class="cfg-col-row"><span>✓</span><input class="form-input" value="Resumen de inconsistencias" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
                <div class="cfg-col-row"><span>✓</span><input class="form-input" value="Detalle del cruce realizado" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
                <div class="cfg-col-row"><span>✓</span><input class="form-input" value="Tabla de diferencias por período" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
                <div class="cfg-col-row"><span>✓</span><input class="form-input" value="Conclusión y recomendación" style="flex:1"><button onclick="this.closest('.cfg-col-row').remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px">×</button></div>
              </div>
              <button onclick="cfgAgregarCol('inf')" style="margin-top:10px;background:var(--gray-0);border:1px dashed var(--gray-3);border-radius:8px;padding:8px;width:100%;font-family:'DM Sans',sans-serif;font-size:12.5px;color:var(--gray-5);cursor:pointer">+ Agregar sección</button>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px">
              <button class="btn btn-outline btn-sm">Previsualizar PDF</button>
              <button class="btn btn-primary btn-sm" onclick="showToast('✅ Informe de análisis actualizado','success')">Confirmar cambios</button>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /cfg-panel-docs -->

  </div>
