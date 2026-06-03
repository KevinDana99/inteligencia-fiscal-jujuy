## Spec New Crossing Management

- Referencia Visual Tab 1: `codex/assets/design/dashboard/cross-management/new-cross-management-planilla.png`
- Referencia Visual Tab 2: `codex/assets/design/dashboard/cross-management/new-cross-management-resume.png`
- Referencia Visual Modal configurar intimacion: `codex/assets/design/dashboard/cross-management/new-cross-management-modal.png`

## Requisitos

1. El dashboard debe mostrar toda la informacion de los widgets del padron unificado.
2. Todos los componentes deben usar Mantine UI, en caso de no tener compoenente para este se puede proceder a usar JSX.
3. Todos los componentes deben usar Mantine UI, en caso de no tener estilos predefinidos en la libreria para la implementacion debe usar CSS Modules.
4. No debe salirse de la arquitectura ni de los patrones de diseño que ya tenemos.
5. Para los Icons se debe usar Tabler Icons, en caso de necesitar icons mapeados se pueden agregar a `src/globals/Icons` y reutilizar desde alli.

## Alcance

- Esta implementacion no pretende remplazar lo que ya existe dentro de `/gestion-de-cruces/` sino mas bien lo que existe en `/gestion-de-cruces/vista-previa-cruce/[cruce]`

## Funcionalidad

- Esta implementacion dispara un modal que es el modal de configuracion, es decir con la configuracion general de la pagina osea de los exportables debe disparar el boton de generar intimacion un modal para poder editar esta configuracion predeterminada (la config del informe), antes de generar el exportable final.
- Este modal permitira una vez se completen todos los campos visualizar y exportar un exportable final.
- El modal posee el mismo template que el formulario de la pagina de configuracion donde ves la intimacion y la configuras.
- El modal debe reutilizar el template de configuracion osea tanto visualmente como en datos debe ser el mismo por ende debemos separar esto en un componente template reutilizable de las dos pantallas tanto de `configuracion` como de `/gestion-de-cruces/vista-previa-cruce/[cruce]`.
- Al ser la misma template que la de configurar intimacion, tambien debe tener el mismo modal que ese modulo posee para la configuracion de las columnas.
- Ya que la configuracion global viene de un provider de config, debemos aprovechar ese provider de config que nos traera la informacion persistida en el backend sobre la configuracion a travez de los contratos definidos previamente

## Estructura de page

- Header : Incluye la tab view buttons para cambiar de view similar al modulo de configuracion.
- view 1 (planilla)
- indicators
  Fuentes BI
  CM05
  Coeficientes
  BI Estimada
  Impuesto
  Final
  (Antes de la tabla)
- Tabla
- Header:
  (`Planilla de datos` como Titulo o header de la tabla)
  - Buscador de resultados (input placeholder `Buscar CUIT o razón social...`)
- view 2 (resumen)
- Arriba del header: (Del lado derecho)
  Button : `Generar intimacion`
- Header Page:
  - Seccion izq:
    Cambia el header de la page a este Cruce en curso
    Control de desvío de BI — Régimen CM
  - Seccion der:
    Lote / CUIT
    ANOVA-622
    Período
    2024
    Total CUITs
    2
    Relevantes
    3 relevantes
    2 Tablas:
    Tabla 1: (Tabla de resumen)
    Tabla 2: (Análisis sistémico por CUIT)

## Diseño y UI

- Header (ambas views comparten mismo header que incluye la tab view, el button back y info del cruce en curso):
  <div id="header-container">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">

            <!-- Volver + Toggle juntos -->
            <div style="display:flex;align-items:center;gap:10px;justify-content:space-between">
              <div style="display:flex;align-items:center;gap:10px">
              <button onclick="volverHistorial()" style="display:flex;align-items:center;gap:6px;background:white;border:1px solid #E2E8F0;border-radius:999px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#475569;cursor:pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Gestión de Cruces
              </button>
              <!-- Toggle vista -->
              <div style="display:flex;background:#F1F5F9;border-radius:999px;padding:3px;gap:2px">
                <button id="btn-vista-planilla" onclick="setVistaCruce('planilla')" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 999px; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; background: white; color: rgb(67, 117, 238); box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  Planilla
                </button>
                <button id="btn-vista-resumen" onclick="setVistaCruce('resumen')" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 999px; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; background: transparent; color: rgb(100, 116, 139); box-shadow: none;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="5" rx="1"></rect><rect x="3" y="10" width="18" height="5" rx="1"></rect><rect x="3" y="17" width="18" height="4" rx="1"></rect></svg>
                  Resumen
                </button>
              </div>
            </div><!-- /pills -->
            </div><!-- /volver+toggle -->
            <button id="btn-generar-intimacion" class="btn btn-primary btn-sm" onclick="abrirModalIntimacion()" style="margin-left: auto; display: none;">Generar Intimación</button>

            <!-- Botón Generar Informe en vista planilla -->


          </div>

  <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4375EE" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <div>
              <div style="font-size:10.5px;font-weight:700;color:#4375EE;text-transform:uppercase;letter-spacing:.06em">Cruce en curso</div>
              <div style="font-size:16px;font-weight:700;color:#1E293B;margin-top:2px" id="cruce-titulo">Control de desvío de BI — Régimen CM</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:20px;align-items:center">
              <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Lote / CUIT</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-lote">ANOVA-622</div></div>
              <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Período</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-periodo">2024</div></div>
              <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Total CUITs</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-total-cuits">2</div></div>
              <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Relevantes</div><div style="font-size:13px;font-weight:700;color:#059669" id="relevantes-count">3 relevantes</div></div>
              <div style="width:1px;height:32px;background:#BFDBFE;margin:0 4px"></div>
            </div>
          </div>
  </div>

- Diseño Tab Planilla (Tab 1):
  <div id="view-tablero-resultado" class="page" style="display: block;">

          <!-- Barra superior -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">

            <!-- Volver + Toggle juntos -->
            <div style="display:flex;align-items:center;gap:10px;justify-content:space-between">
              <div style="display:flex;align-items:center;gap:10px">
              <button onclick="volverHistorial()" style="display:flex;align-items:center;gap:6px;background:white;border:1px solid #E2E8F0;border-radius:999px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#475569;cursor:pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Gestión de Cruces
              </button>
              <!-- Toggle vista -->
              <div style="display:flex;background:#F1F5F9;border-radius:999px;padding:3px;gap:2px">
                <button id="btn-vista-planilla" onclick="setVistaCruce('planilla')" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 999px; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; background: white; color: rgb(67, 117, 238); box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  Planilla
                </button>
                <button id="btn-vista-resumen" onclick="setVistaCruce('resumen')" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 999px; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; background: transparent; color: rgb(100, 116, 139); box-shadow: none;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="5" rx="1"></rect><rect x="3" y="10" width="18" height="5" rx="1"></rect><rect x="3" y="17" width="18" height="4" rx="1"></rect></svg>
                  Resumen
                </button>
              </div>
            </div><!-- /pills -->
            </div><!-- /volver+toggle -->
            <button id="btn-generar-intimacion" class="btn btn-primary btn-sm" onclick="abrirModalIntimacion()" style="margin-left: auto; display: none;">Generar Intimación</button>

            <!-- Botón Generar Informe en vista planilla -->


          </div>

          <!-- Header cruce -->
          <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4375EE" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <div>
              <div style="font-size:10.5px;font-weight:700;color:#4375EE;text-transform:uppercase;letter-spacing:.06em">Cruce en curso</div>
              <div style="font-size:16px;font-weight:700;color:#1E293B;margin-top:2px" id="cruce-titulo">Control de desvío de BI — Régimen CM</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:20px;align-items:center">
              <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Lote / CUIT</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-lote">ANOVA-622</div></div>
              <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Período</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-periodo">2024</div></div>
              <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Total CUITs</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-total-cuits">2</div></div>
              <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Relevantes</div><div style="font-size:13px;font-weight:700;color:#059669" id="relevantes-count">3 relevantes</div></div>
              <div style="width:1px;height:32px;background:#BFDBFE;margin:0 4px"></div>
            </div>
          </div>

          <!-- ══════ VISTA PLANILLA ══════ -->
          <div id="vista-planilla" style="display: block;">
            <div style="font-size:12px;color:#64748B;margin-bottom:10px;display:flex;gap:16px;flex-wrap:wrap">
              <span><span style="display:inline-block;width:12px;height:12px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Fuentes BI</span>
              <span><span style="display:inline-block;width:12px;height:12px;background:#F5F3FF;border:1px solid #DDD6FE;border-radius:2px;vertical-align:middle;margin-right:4px"></span>CM05</span>
              <span><span style="display:inline-block;width:12px;height:12px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Coeficientes</span>
              <span><span style="display:inline-block;width:12px;height:12px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:2px;vertical-align:middle;margin-right:4px"></span>BI Estimada</span>
              <span><span style="display:inline-block;width:12px;height:12px;background:#FEF2F2;border:1px solid #FECACA;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Impuesto</span>
              <span><span style="display:inline-block;width:12px;height:12px;background:#1D4ED8;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Final</span>
            </div>
            <div style="background:var(--blue-5);border-radius:10px 10px 0 0;padding:10px 16px;display:flex;align-items:center;gap:16px">
              <span style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:white;white-space:nowrap;flex-shrink:0">Planilla de datos</span>
              <div style="position:relative;flex-shrink:0">
                <svg style="position:absolute;left:9px;top:50%;transform:translateY(-50%);opacity:.7" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input id="planilla-search" oninput="filtrarPlanillaBusqueda()" placeholder="Buscar CUIT o razón social..." style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:6px 10px 6px 28px;font-family:'DM Sans',sans-serif;font-size:12px;color:white;outline:none;width:200px" onfocus="this.style.background='rgba(255,255,255,.28)'" onblur="this.style.background='rgba(255,255,255,.18)'">
              </div>
            </div>
            <div style="overflow-x:auto;border-radius:0 0 12px 12px;border:1px solid #E2E8F0;border-top:none" id="pt-table-wrapper">
              <table id="pt-table" style="border-collapse:collapse;font-size:12px;font-family:'DM Sans',sans-serif;white-space:nowrap">
                <thead>
                  <tr>
                    <th colspan="4" class="g-id" style="padding:8px 10px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;border-left:2px solid #CBD5E1;font-size:10px;color:#64748B;text-transform:uppercase;letter-spacing:.05em">Identificación</th>
                    <th colspan="6" style="padding:8px 10px;background:#EFF6FF;border-bottom:1px solid #BFDBFE;border-left:2px solid #93C5FD;font-size:10px;color:#1D4ED8;text-transform:uppercase;letter-spacing:.05em">Fuentes de Base Imponible</th>
                    <th style="padding:8px 10px;background:#DBEAFE;border-bottom:1px solid #93C5FD;border-left:2px solid #60A5FA;font-size:10px;color:#1D4ED8;text-transform:uppercase;letter-spacing:.05em">Mayor Base</th>
                    <th style="padding:8px 10px;background:#F5F3FF;border-bottom:1px solid #DDD6FE;border-left:2px solid #A78BFA;font-size:10px;color:#6D28D9;text-transform:uppercase;letter-spacing:.05em">CM05 Jujuy</th>
                    <th colspan="3" style="padding:8px 10px;background:#FEF9C3;border-bottom:1px solid #FDE047;border-left:2px solid #FACC15;font-size:10px;color:#854D0E;text-transform:uppercase;letter-spacing:.05em">Diferencia / Período</th>
                    <th colspan="5" style="padding:8px 10px;background:#F5F3FF;border-bottom:1px solid #DDD6FE;border-left:2px solid #A78BFA;font-size:10px;color:#6D28D9;text-transform:uppercase;letter-spacing:.05em">CM05 — Coeficientes Declarados</th>
                    <th colspan="3" style="padding:8px 10px;background:#ECFDF5;border-bottom:1px solid #A7F3D0;border-left:2px solid #34D399;font-size:10px;color:#065F46;text-transform:uppercase;letter-spacing:.05em">Nuevos Coeficientes</th>
                    <th colspan="3" style="padding:8px 10px;background:#FFF7ED;border-bottom:1px solid #FED7AA;border-left:2px solid #FB923C;font-size:10px;color:#9A3412;text-transform:uppercase;letter-spacing:.05em">BI Estimada vs Declarada</th>
                    <th colspan="2" style="padding:8px 10px;background:#FEF2F2;border-bottom:1px solid #FECACA;border-left:2px solid #F87171;font-size:10px;color:#991B1B;text-transform:uppercase;letter-spacing:.05em">Impuesto</th>
                    <th colspan="2" style="padding:8px 10px;background:#ECFDF5;border-bottom:1px solid #A7F3D0;border-left:2px solid #34D399;font-size:10px;color:#065F46;text-transform:uppercase;letter-spacing:.05em">Créditos</th>
                    <th style="padding:8px 10px;background:#1D4ED8;border-bottom:1px solid #1D4ED8;border-left:2px solid #1E40AF;font-size:10px;color:white;text-transform:uppercase;letter-spacing:.05em">Final</th>
                  </tr>
                  <tr style="background:#F8FAFC">
                    <th style="padding:7px 10px;border-bottom:2px solid #E2E8F0;border-left:2px solid #CBD5E1;font-size:10px;color:#64748B;font-weight:600">ID Período</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #E2E8F0;font-size:10px;color:#64748B;font-weight:600">ID Sig.</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #E2E8F0;font-size:10px;color:#64748B;font-weight:600">CUIT</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #E2E8F0;font-size:10px;color:#64748B;font-weight:600;min-width:160px">Razón Social</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;border-left:2px solid #93C5FD;font-size:10px;color:#1D4ED8;font-weight:600">Fact. ARCA (año)</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Fact. ARCA (fecha)</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Ag. Percepción</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Ag. Retención</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Pago a Cta.</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Retenciones</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #93C5FD;border-left:2px solid #60A5FA;font-size:10px;color:#1D4ED8;font-weight:700">MAYOR</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;border-left:2px solid #A78BFA;font-size:10px;color:#6D28D9;font-weight:600">CM05 Jujuy</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #FDE047;border-left:2px solid #FACC15;font-size:10px;color:#854D0E;font-weight:600">Dif. Base</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #FDE047;font-size:10px;color:#854D0E;font-weight:600">Mes</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #FDE047;font-size:10px;color:#854D0E;font-weight:600">Año</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;border-left:2px solid #A78BFA;font-size:10px;color:#6D28D9;font-weight:600">Cierre Ej.</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;font-size:10px;color:#6D28D9;font-weight:600">Tot. Ing. País</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;font-size:10px;color:#6D28D9;font-weight:600">CI Decl.</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;font-size:10px;color:#6D28D9;font-weight:600">Tot. Egr.</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;font-size:10px;color:#6D28D9;font-weight:600">Coef. Egr.</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;border-left:2px solid #34D399;font-size:10px;color:#065F46;font-weight:600">Nuevo CI</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;font-size:10px;color:#065F46;font-weight:600">CU Decl.</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;font-size:10px;color:#065F46;font-weight:700">NCU</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #FED7AA;border-left:2px solid #FB923C;font-size:10px;color:#9A3412;font-weight:600">BI Total País</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #FED7AA;font-size:10px;color:#9A3412;font-weight:700">BI Estimada</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #FED7AA;font-size:10px;color:#9A3412;font-weight:600">BI Decl. CM03</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #FECACA;border-left:2px solid #F87171;font-size:10px;color:#991B1B;font-weight:600">Alícuota</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #FECACA;font-size:10px;color:#991B1B;font-weight:700">Imp. Presuntivo</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;border-left:2px solid #34D399;font-size:10px;color:#065F46;font-weight:600">Dif. Créditos</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;font-size:10px;color:#065F46;font-weight:600">SAF</th>
                    <th style="padding:7px 10px;border-bottom:2px solid #1E40AF;border-left:2px solid #1E40AF;font-size:10px;color:white;background:#1D4ED8;font-weight:700">EST. FINAL</th>
                  </tr>
                </thead>
                <tbody id="pt-tbody"><tr><td class="left g-id" style="font-size:10px">305040188452024</td><td class="left g-id" style="font-size:10px">305040188452025</td><td class="left g-id" style="font-family:monospace">30-50401884-5</td><td class="left g-id" style="font-weight:600;min-width:180px">VOLKSWAGEN ARGENTINA S.A.</td><td class="g-fuente">$42.937.860.598</td><td class="g-fuente td-mayor">$42.937.860.598</td><td class="g-fuente">$20.141.951.996</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="td-calc">$42.937.860.598</td><td style="background:#F5F3FF;color:#6D28D9">$22.361.024.153</td><td class="td-neg g-df">$20.576.836.445</td><td class="center g-df">12</td><td class="center g-df">2024</td><td class="center g-cm05">31/12/2024</td><td class="g-cm05">$2.927.995.069.414</td><td class="center g-cm05">0.7600%</td><td class="g-cm05">$556.230.000.000</td><td class="center g-cm05">0.2000%</td><td class="center g-coef">1.4664%</td><td class="center g-coef">0.4800%</td><td class="center g-coef" style="font-weight:700">0.8332%</td><td class="g-bi">$3.512.364.508.204</td><td class="td-calc g-bi">$29.266.065.257</td><td class="g-bi">$16.879.656.323</td><td class="center g-imp">1.50%</td><td class="td-neg g-imp">$185.796.134</td><td class="g-cred" style="color:#D97706">+$4.589.233</td><td class="center g-cred" style="color:var(--gray-3)">—</td><td class="td-result">$185.814.166</td></tr><tr><td class="left g-id" style="font-size:10px">305016852122024</td><td class="left g-id" style="font-size:10px">305016852122025</td><td class="left g-id" style="font-family:monospace">30-50168521-2</td><td class="left g-id" style="font-weight:600">CERÁMICA DEL NORTE S.A.</td><td class="g-fuente">$1.109.054.107</td><td class="g-fuente">$1.305.623.207</td><td class="g-fuente td-mayor">$1.366.863.071</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="td-calc">$1.366.863.071</td><td style="background:#F5F3FF;color:#6D28D9">$55.803.248</td><td class="td-neg g-df">$1.311.059.823</td><td class="center g-df">8</td><td class="center g-df">2024</td><td class="center g-cm05">31/08/2024</td><td class="g-cm05">$11.158.844.393</td><td class="center g-cm05">0.5000%</td><td class="g-cm05">$8.929.036.168</td><td class="center g-cm05">0.0000%</td><td class="center g-coef">12.2491%</td><td class="center g-coef">0.2500%</td><td class="center g-coef" style="font-weight:700">6.1246%</td><td class="g-bi">$13.970.733.232</td><td class="td-calc g-bi">$855.647.711</td><td class="g-bi">$32.767.157</td><td class="center g-imp">1.50%</td><td class="td-neg g-imp">$12.343.208</td><td class="center g-cred" style="color:var(--gray-3)">—</td><td class="g-cred" style="color:#059669">$503.979</td><td class="td-result">$12.343.208</td></tr></tbody>
              </table>
              <!-- Paginación planilla -->
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid var(--gray-2)">
                <span id="planilla-pag-info" style="font-size:12px;color:var(--gray-5)">Mostrando 1–2 de 2 resultados</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <button onclick="pagPlanilla(-1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
                  <span id="planilla-pag-txt" style="font-size:12px;color:var(--gray-5)">1 / 1</span>
                  <button onclick="pagPlanilla(1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
                </div>
              </div>
            </div>
          </div>

          <!-- ══════ VISTA RESUMEN ══════ -->
          <div id="vista-resumen" style="display: none;">

            <!-- TOTALES unificado -->
            <div style="background:var(--blue-5);color:white;border-radius:10px 10px 0 0;padding:10px 16px;display:flex;align-items:center;justify-content:space-between">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;opacity:.85">Resumen</div>
              <span style="background:rgba(255,255,255,.2);font-size:12px;font-weight:600;padding:3px 12px;border-radius:999px">2 CUITs · RÉGIMEN CM</span>
            </div>
            <div style="background:white;border:1px solid var(--gray-2);border-top:none;overflow-x:auto;margin-bottom:16px;border-radius:0 0 10px 10px">
              <table style="width:100%;border-collapse:collapse;font-size:13px">
                <thead>
                  <tr style="background:var(--blue-1)">
                    <th style="padding:9px 14px;text-align:left;font-weight:700;color:var(--blue-5);white-space:nowrap">RÉGIMEN</th>
                    <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">B.I. 910</th>
                    <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">MAYOR BASE IMP.</th>
                    <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">DIF A FAVOR DPR</th>
                    <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">IMPUESTO</th>
                    <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">DEUDA NETA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding:10px 14px;font-weight:700;color:var(--gray-9);border-bottom:1px solid var(--gray-1)">CM</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;border-bottom:1px solid var(--gray-1)">$ 16.912.423.480</td>
                    <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 0</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 16.912.423.480</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 253.686.352</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 253.668.320</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ANÁLISIS SISTÉMICO -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:10px;overflow:visible">
              <div style="background:var(--blue-5);color:white;padding:10px 16px;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:space-between;gap:12px">
                <span style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap">Análisis sistémico por CUIT</span>
                <div style="position:relative;flex-shrink:0">
                  <svg style="position:absolute;left:9px;top:50%;transform:translateY(-50%);opacity:.7" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input id="resumen-search" oninput="filtrarResumenBusqueda()" placeholder="Buscar CUIT o razón social..." style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:6px 10px 6px 28px;font-family:'DM Sans',sans-serif;font-size:12px;color:white;outline:none;width:220px" onfocus="this.style.background='rgba(255,255,255,.28)'" onblur="this.style.background='rgba(255,255,255,.18)'">
                </div>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:13px">
                <thead>
                  <tr style="background:var(--blue-1)">

                    <th style="padding:10px 14px;text-align:left;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                      CUIT
                      <div id="fcol-cuit" class="col-filter-dropdown" style="display:none">
                        <div class="cfd-label">Buscar CUIT</div>
                        <input id="fcol-cuit-val" placeholder="30504..." oninput="filtrarResumen()" style="width:100%;border:1px solid var(--gray-2);border-radius:6px;padding:6px 8px;font-size:12px;outline:none;font-family:monospace;box-sizing:border-box;color:var(--gray-9)">
                        <button onclick="limpiarFiltroCol('fcol-cuit-val')" class="cfd-clear">Limpiar</button>
                      </div>
                    </th>

                    <th style="padding:10px 14px;text-align:left;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                      RAZÓN SOCIAL
                      <div id="fcol-razon" class="col-filter-dropdown" style="display:none">
                        <div class="cfd-label">Buscar razón social</div>
                        <input id="fcol-razon-val" placeholder="Volkswagen..." oninput="filtrarResumen()" style="width:100%;border:1px solid var(--gray-2);border-radius:6px;padding:6px 8px;font-size:12px;outline:none;box-sizing:border-box;color:var(--gray-9)">
                        <button onclick="limpiarFiltroCol('fcol-razon-val')" class="cfd-clear">Limpiar</button>
                      </div>
                    </th>

                    <!-- Columnas numéricas con filtros simplificados -->
                    <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                      B.I. 910
                      <button onclick="abrirModalFiltro('bi910')" style="background:rgba(67,117,238,.15);border:none;color:var(--blue-5);cursor:pointer;border-radius:4px;padding:2px 6px;margin-left:4px;font-size:11px;transition:background .12s" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                    </th>

                    <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                      B.I. PRETENDIDA
                      <button onclick="abrirModalFiltro('bip')" style="background: rgba(67, 117, 238, 0.15); border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: var(--blue-5); cursor: pointer; border-radius: 4px; padding: 2px 6px; margin-left: 4px; font-size: 11px; transition: background 0.12s;" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                    </th>

                    <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                      DIFERENCIA
                      <button onclick="abrirModalFiltro('dif')" style="background:rgba(67,117,238,.15);border:none;color:var(--blue-5);cursor:pointer;border-radius:4px;padding:2px 6px;margin-left:4px;font-size:11px;transition:background .12s" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                    </th>

                    <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                      IMPUESTO ESTIMADO
                      <button onclick="abrirModalFiltro('imp')" style="background:rgba(67,117,238,.15);border:none;color:var(--blue-5);cursor:pointer;border-radius:4px;padding:2px 6px;margin-left:4px;font-size:11px;transition:background .12s" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                    </th>

                    <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                      NETO A PAGAR
                      <button onclick="abrirModalFiltro('neto')" style="background:rgba(67,117,238,.15);border:none;color:var(--blue-5);cursor:pointer;border-radius:4px;padding:2px 6px;margin-left:4px;font-size:11px;transition:background .12s" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                    </th>

                    <th style="padding:10px 14px;text-align:center;font-weight:700;color:var(--blue-5);white-space:nowrap">ESTADO</th>

                  </tr>
                </thead>
                <tbody id="resumen-tbody">
                  <tr onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style="">
                    <td style="padding:10px 14px;font-family:monospace;font-size:12px;color:var(--blue-5);font-weight:600;border-bottom:1px solid var(--gray-1)">30504018845</td>
                    <td style="padding:10px 14px;font-weight:600;border-bottom:1px solid var(--gray-1)">VOLKSWAGEN ARGENTINA S.A</td>
                    <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 16.879.656.323</td>
                    <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 0</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 16.879.656.323</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 253.194.844</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 253.176.812</td>
                    <td style="padding:10px 14px;text-align:center;border-bottom:1px solid var(--gray-1)"><select class="estado-select relevante" onchange="cambiarEstado(this,1)" style="border:none;background:#ECFDF5;color:#059669;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif"><option value="ninguno">— Estado</option><option value="relevante" selected="">✓ Relevante</option><option value="reproceso">🔴 Reproceso</option></select></td>
                  </tr>
                  <tr onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style="">
                    <td style="padding:10px 14px;font-family:monospace;font-size:12px;color:var(--blue-5);font-weight:600;border-bottom:1px solid var(--gray-1)">30501685212</td>
                    <td style="padding:10px 14px;font-weight:600;border-bottom:1px solid var(--gray-1)">CERÁMICA DEL NORTE S.A</td>
                    <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 32.767.157</td>
                    <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 0</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 32.767.157</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 491.507</td>
                    <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 491.507</td>
                    <td style="padding:10px 14px;text-align:center;border-bottom:1px solid var(--gray-1)"><select class="estado-select ninguno" onchange="cambiarEstado(this,2)" style="border:none;background:var(--gray-1);color:var(--gray-5);border-radius:999px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif"><option value="ninguno" selected="">— Estado</option><option value="relevante">✓ Relevante</option><option value="reproceso">🔴 Reproceso</option></select></td>
                  </tr>
                </tbody>
              </table>
              <!-- Paginación resumen -->
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid var(--gray-2)">
                <span id="resumen-pag-info" style="font-size:12px;color:var(--gray-5)">Mostrando 1–2 de 2 resultados</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <button onclick="pagResumen(-1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
                  <span id="resumen-pag-txt" style="font-size:12px;color:var(--gray-5)">1 / 1</span>
                  <button onclick="pagResumen(1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
                </div>
              </div>
            </div>

          </div><!-- /vista-resumen -->

        </div>

- Diseño Tab Resumen (Tab 2):

<div id="view-tablero-resultado" class="page" style="display: block;">

        <!-- Barra superior -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">

          <!-- Volver + Toggle juntos -->
          <div style="display:flex;align-items:center;gap:10px;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:10px">
            <button onclick="volverHistorial()" style="display:flex;align-items:center;gap:6px;background:white;border:1px solid #E2E8F0;border-radius:999px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#475569;cursor:pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Gestión de Cruces
            </button>
            <!-- Toggle vista -->
            <div style="display:flex;background:#F1F5F9;border-radius:999px;padding:3px;gap:2px">
              <button id="btn-vista-planilla" onclick="setVistaCruce('planilla')" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 999px; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; background: transparent; color: rgb(100, 116, 139); box-shadow: none;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                Planilla
              </button>
              <button id="btn-vista-resumen" onclick="setVistaCruce('resumen')" style="display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 999px; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; background: white; color: rgb(67, 117, 238); box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="5" rx="1"></rect><rect x="3" y="10" width="18" height="5" rx="1"></rect><rect x="3" y="17" width="18" height="4" rx="1"></rect></svg>
                Resumen
              </button>
            </div>
          </div><!-- /pills -->
          </div><!-- /volver+toggle -->
          <button id="btn-generar-intimacion" class="btn btn-primary btn-sm" onclick="abrirModalIntimacion()" style="margin-left: auto;">Generar Intimación</button>

          <!-- Botón Generar Informe en vista planilla -->


        </div>

        <!-- Header cruce -->
        <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4375EE" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          <div>
            <div style="font-size:10.5px;font-weight:700;color:#4375EE;text-transform:uppercase;letter-spacing:.06em">Cruce en curso</div>
            <div style="font-size:16px;font-weight:700;color:#1E293B;margin-top:2px" id="cruce-titulo">Control de desvío de BI — Régimen CM</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:20px;align-items:center">
            <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Lote / CUIT</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-lote">ANOVA-622</div></div>
            <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Período</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-periodo">2024</div></div>
            <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Total CUITs</div><div style="font-size:13px;font-weight:700;color:#1E293B" id="cruce-total-cuits">2</div></div>
            <div style="text-align:center"><div style="font-size:10px;color:#64748B;margin-bottom:2px">Relevantes</div><div style="font-size:13px;font-weight:700;color:#059669" id="relevantes-count">3 relevantes</div></div>
            <div style="width:1px;height:32px;background:#BFDBFE;margin:0 4px"></div>
          </div>
        </div>

        <!-- ══════ VISTA PLANILLA ══════ -->
        <div id="vista-planilla" style="display: none;">
          <div style="font-size:12px;color:#64748B;margin-bottom:10px;display:flex;gap:16px;flex-wrap:wrap">
            <span><span style="display:inline-block;width:12px;height:12px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Fuentes BI</span>
            <span><span style="display:inline-block;width:12px;height:12px;background:#F5F3FF;border:1px solid #DDD6FE;border-radius:2px;vertical-align:middle;margin-right:4px"></span>CM05</span>
            <span><span style="display:inline-block;width:12px;height:12px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Coeficientes</span>
            <span><span style="display:inline-block;width:12px;height:12px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:2px;vertical-align:middle;margin-right:4px"></span>BI Estimada</span>
            <span><span style="display:inline-block;width:12px;height:12px;background:#FEF2F2;border:1px solid #FECACA;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Impuesto</span>
            <span><span style="display:inline-block;width:12px;height:12px;background:#1D4ED8;border-radius:2px;vertical-align:middle;margin-right:4px"></span>Final</span>
          </div>
          <div style="background:var(--blue-5);border-radius:10px 10px 0 0;padding:10px 16px;display:flex;align-items:center;gap:16px">
            <span style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:white;white-space:nowrap;flex-shrink:0">Planilla de datos</span>
            <div style="position:relative;flex-shrink:0">
              <svg style="position:absolute;left:9px;top:50%;transform:translateY(-50%);opacity:.7" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input id="planilla-search" oninput="filtrarPlanillaBusqueda()" placeholder="Buscar CUIT o razón social..." style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:6px 10px 6px 28px;font-family:'DM Sans',sans-serif;font-size:12px;color:white;outline:none;width:200px" onfocus="this.style.background='rgba(255,255,255,.28)'" onblur="this.style.background='rgba(255,255,255,.18)'">
            </div>
          </div>
          <div style="overflow-x:auto;border-radius:0 0 12px 12px;border:1px solid #E2E8F0;border-top:none" id="pt-table-wrapper">
            <table id="pt-table" style="border-collapse:collapse;font-size:12px;font-family:'DM Sans',sans-serif;white-space:nowrap">
              <thead>
                <tr>
                  <th colspan="4" class="g-id" style="padding:8px 10px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;border-left:2px solid #CBD5E1;font-size:10px;color:#64748B;text-transform:uppercase;letter-spacing:.05em">Identificación</th>
                  <th colspan="6" style="padding:8px 10px;background:#EFF6FF;border-bottom:1px solid #BFDBFE;border-left:2px solid #93C5FD;font-size:10px;color:#1D4ED8;text-transform:uppercase;letter-spacing:.05em">Fuentes de Base Imponible</th>
                  <th style="padding:8px 10px;background:#DBEAFE;border-bottom:1px solid #93C5FD;border-left:2px solid #60A5FA;font-size:10px;color:#1D4ED8;text-transform:uppercase;letter-spacing:.05em">Mayor Base</th>
                  <th style="padding:8px 10px;background:#F5F3FF;border-bottom:1px solid #DDD6FE;border-left:2px solid #A78BFA;font-size:10px;color:#6D28D9;text-transform:uppercase;letter-spacing:.05em">CM05 Jujuy</th>
                  <th colspan="3" style="padding:8px 10px;background:#FEF9C3;border-bottom:1px solid #FDE047;border-left:2px solid #FACC15;font-size:10px;color:#854D0E;text-transform:uppercase;letter-spacing:.05em">Diferencia / Período</th>
                  <th colspan="5" style="padding:8px 10px;background:#F5F3FF;border-bottom:1px solid #DDD6FE;border-left:2px solid #A78BFA;font-size:10px;color:#6D28D9;text-transform:uppercase;letter-spacing:.05em">CM05 — Coeficientes Declarados</th>
                  <th colspan="3" style="padding:8px 10px;background:#ECFDF5;border-bottom:1px solid #A7F3D0;border-left:2px solid #34D399;font-size:10px;color:#065F46;text-transform:uppercase;letter-spacing:.05em">Nuevos Coeficientes</th>
                  <th colspan="3" style="padding:8px 10px;background:#FFF7ED;border-bottom:1px solid #FED7AA;border-left:2px solid #FB923C;font-size:10px;color:#9A3412;text-transform:uppercase;letter-spacing:.05em">BI Estimada vs Declarada</th>
                  <th colspan="2" style="padding:8px 10px;background:#FEF2F2;border-bottom:1px solid #FECACA;border-left:2px solid #F87171;font-size:10px;color:#991B1B;text-transform:uppercase;letter-spacing:.05em">Impuesto</th>
                  <th colspan="2" style="padding:8px 10px;background:#ECFDF5;border-bottom:1px solid #A7F3D0;border-left:2px solid #34D399;font-size:10px;color:#065F46;text-transform:uppercase;letter-spacing:.05em">Créditos</th>
                  <th style="padding:8px 10px;background:#1D4ED8;border-bottom:1px solid #1D4ED8;border-left:2px solid #1E40AF;font-size:10px;color:white;text-transform:uppercase;letter-spacing:.05em">Final</th>
                </tr>
                <tr style="background:#F8FAFC">
                  <th style="padding:7px 10px;border-bottom:2px solid #E2E8F0;border-left:2px solid #CBD5E1;font-size:10px;color:#64748B;font-weight:600">ID Período</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #E2E8F0;font-size:10px;color:#64748B;font-weight:600">ID Sig.</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #E2E8F0;font-size:10px;color:#64748B;font-weight:600">CUIT</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #E2E8F0;font-size:10px;color:#64748B;font-weight:600;min-width:160px">Razón Social</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;border-left:2px solid #93C5FD;font-size:10px;color:#1D4ED8;font-weight:600">Fact. ARCA (año)</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Fact. ARCA (fecha)</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Ag. Percepción</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Ag. Retención</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Pago a Cta.</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #BFDBFE;font-size:10px;color:#1D4ED8;font-weight:600">Retenciones</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #93C5FD;border-left:2px solid #60A5FA;font-size:10px;color:#1D4ED8;font-weight:700">MAYOR</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;border-left:2px solid #A78BFA;font-size:10px;color:#6D28D9;font-weight:600">CM05 Jujuy</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #FDE047;border-left:2px solid #FACC15;font-size:10px;color:#854D0E;font-weight:600">Dif. Base</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #FDE047;font-size:10px;color:#854D0E;font-weight:600">Mes</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #FDE047;font-size:10px;color:#854D0E;font-weight:600">Año</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;border-left:2px solid #A78BFA;font-size:10px;color:#6D28D9;font-weight:600">Cierre Ej.</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;font-size:10px;color:#6D28D9;font-weight:600">Tot. Ing. País</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;font-size:10px;color:#6D28D9;font-weight:600">CI Decl.</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;font-size:10px;color:#6D28D9;font-weight:600">Tot. Egr.</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #DDD6FE;font-size:10px;color:#6D28D9;font-weight:600">Coef. Egr.</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;border-left:2px solid #34D399;font-size:10px;color:#065F46;font-weight:600">Nuevo CI</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;font-size:10px;color:#065F46;font-weight:600">CU Decl.</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;font-size:10px;color:#065F46;font-weight:700">NCU</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #FED7AA;border-left:2px solid #FB923C;font-size:10px;color:#9A3412;font-weight:600">BI Total País</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #FED7AA;font-size:10px;color:#9A3412;font-weight:700">BI Estimada</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #FED7AA;font-size:10px;color:#9A3412;font-weight:600">BI Decl. CM03</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #FECACA;border-left:2px solid #F87171;font-size:10px;color:#991B1B;font-weight:600">Alícuota</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #FECACA;font-size:10px;color:#991B1B;font-weight:700">Imp. Presuntivo</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;border-left:2px solid #34D399;font-size:10px;color:#065F46;font-weight:600">Dif. Créditos</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #A7F3D0;font-size:10px;color:#065F46;font-weight:600">SAF</th>
                  <th style="padding:7px 10px;border-bottom:2px solid #1E40AF;border-left:2px solid #1E40AF;font-size:10px;color:white;background:#1D4ED8;font-weight:700">EST. FINAL</th>
                </tr>
              </thead>
              <tbody id="pt-tbody"><tr><td class="left g-id" style="font-size:10px">305040188452024</td><td class="left g-id" style="font-size:10px">305040188452025</td><td class="left g-id" style="font-family:monospace">30-50401884-5</td><td class="left g-id" style="font-weight:600;min-width:180px">VOLKSWAGEN ARGENTINA S.A.</td><td class="g-fuente">$42.937.860.598</td><td class="g-fuente td-mayor">$42.937.860.598</td><td class="g-fuente">$20.141.951.996</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="td-calc">$42.937.860.598</td><td style="background:#F5F3FF;color:#6D28D9">$22.361.024.153</td><td class="td-neg g-df">$20.576.836.445</td><td class="center g-df">12</td><td class="center g-df">2024</td><td class="center g-cm05">31/12/2024</td><td class="g-cm05">$2.927.995.069.414</td><td class="center g-cm05">0.7600%</td><td class="g-cm05">$556.230.000.000</td><td class="center g-cm05">0.2000%</td><td class="center g-coef">1.4664%</td><td class="center g-coef">0.4800%</td><td class="center g-coef" style="font-weight:700">0.8332%</td><td class="g-bi">$3.512.364.508.204</td><td class="td-calc g-bi">$29.266.065.257</td><td class="g-bi">$16.879.656.323</td><td class="center g-imp">1.50%</td><td class="td-neg g-imp">$185.796.134</td><td class="g-cred" style="color:#D97706">+$4.589.233</td><td class="center g-cred" style="color:var(--gray-3)">—</td><td class="td-result">$185.814.166</td></tr><tr><td class="left g-id" style="font-size:10px">305016852122024</td><td class="left g-id" style="font-size:10px">305016852122025</td><td class="left g-id" style="font-family:monospace">30-50168521-2</td><td class="left g-id" style="font-weight:600">CERÁMICA DEL NORTE S.A.</td><td class="g-fuente">$1.109.054.107</td><td class="g-fuente">$1.305.623.207</td><td class="g-fuente td-mayor">$1.366.863.071</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="g-fuente" style="color:var(--gray-3)">—</td><td class="td-calc">$1.366.863.071</td><td style="background:#F5F3FF;color:#6D28D9">$55.803.248</td><td class="td-neg g-df">$1.311.059.823</td><td class="center g-df">8</td><td class="center g-df">2024</td><td class="center g-cm05">31/08/2024</td><td class="g-cm05">$11.158.844.393</td><td class="center g-cm05">0.5000%</td><td class="g-cm05">$8.929.036.168</td><td class="center g-cm05">0.0000%</td><td class="center g-coef">12.2491%</td><td class="center g-coef">0.2500%</td><td class="center g-coef" style="font-weight:700">6.1246%</td><td class="g-bi">$13.970.733.232</td><td class="td-calc g-bi">$855.647.711</td><td class="g-bi">$32.767.157</td><td class="center g-imp">1.50%</td><td class="td-neg g-imp">$12.343.208</td><td class="center g-cred" style="color:var(--gray-3)">—</td><td class="g-cred" style="color:#059669">$503.979</td><td class="td-result">$12.343.208</td></tr></tbody>
            </table>
            <!-- Paginación planilla -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid var(--gray-2)">
              <span id="planilla-pag-info" style="font-size:12px;color:var(--gray-5)">Mostrando 1–2 de 2 resultados</span>
              <div style="display:flex;align-items:center;gap:8px">
                <button onclick="pagPlanilla(-1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
                <span id="planilla-pag-txt" style="font-size:12px;color:var(--gray-5)">1 / 1</span>
                <button onclick="pagPlanilla(1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ══════ VISTA RESUMEN ══════ -->
        <div id="vista-resumen" style="display: block;">

          <!-- TOTALES unificado -->
          <div style="background:var(--blue-5);color:white;border-radius:10px 10px 0 0;padding:10px 16px;display:flex;align-items:center;justify-content:space-between">
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;opacity:.85">Resumen</div>
            <span style="background:rgba(255,255,255,.2);font-size:12px;font-weight:600;padding:3px 12px;border-radius:999px">2 CUITs · RÉGIMEN CM</span>
          </div>
          <div style="background:white;border:1px solid var(--gray-2);border-top:none;overflow-x:auto;margin-bottom:16px;border-radius:0 0 10px 10px">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="background:var(--blue-1)">
                  <th style="padding:9px 14px;text-align:left;font-weight:700;color:var(--blue-5);white-space:nowrap">RÉGIMEN</th>
                  <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">B.I. 910</th>
                  <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">MAYOR BASE IMP.</th>
                  <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">DIF A FAVOR DPR</th>
                  <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">IMPUESTO</th>
                  <th style="padding:9px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap">DEUDA NETA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:10px 14px;font-weight:700;color:var(--gray-9);border-bottom:1px solid var(--gray-1)">CM</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;border-bottom:1px solid var(--gray-1)">$ 16.912.423.480</td>
                  <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 0</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 16.912.423.480</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 253.686.352</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 253.668.320</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ANÁLISIS SISTÉMICO -->
          <div style="background:white;border:1px solid var(--gray-2);border-radius:10px;overflow:visible">
            <div style="background:var(--blue-5);color:white;padding:10px 16px;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:space-between;gap:12px">
              <span style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap">Análisis sistémico por CUIT</span>
              <div style="position:relative;flex-shrink:0">
                <svg style="position:absolute;left:9px;top:50%;transform:translateY(-50%);opacity:.7" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input id="resumen-search" oninput="filtrarResumenBusqueda()" placeholder="Buscar CUIT o razón social..." style="background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);border-radius:8px;padding:6px 10px 6px 28px;font-family:'DM Sans',sans-serif;font-size:12px;color:white;outline:none;width:220px" onfocus="this.style.background='rgba(255,255,255,.28)'" onblur="this.style.background='rgba(255,255,255,.18)'">
              </div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <thead>
                <tr style="background:var(--blue-1)">

                  <th style="padding:10px 14px;text-align:left;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                    CUIT
                    <div id="fcol-cuit" class="col-filter-dropdown" style="display:none">
                      <div class="cfd-label">Buscar CUIT</div>
                      <input id="fcol-cuit-val" placeholder="30504..." oninput="filtrarResumen()" style="width:100%;border:1px solid var(--gray-2);border-radius:6px;padding:6px 8px;font-size:12px;outline:none;font-family:monospace;box-sizing:border-box;color:var(--gray-9)">
                      <button onclick="limpiarFiltroCol('fcol-cuit-val')" class="cfd-clear">Limpiar</button>
                    </div>
                  </th>

                  <th style="padding:10px 14px;text-align:left;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                    RAZÓN SOCIAL
                    <div id="fcol-razon" class="col-filter-dropdown" style="display:none">
                      <div class="cfd-label">Buscar razón social</div>
                      <input id="fcol-razon-val" placeholder="Volkswagen..." oninput="filtrarResumen()" style="width:100%;border:1px solid var(--gray-2);border-radius:6px;padding:6px 8px;font-size:12px;outline:none;box-sizing:border-box;color:var(--gray-9)">
                      <button onclick="limpiarFiltroCol('fcol-razon-val')" class="cfd-clear">Limpiar</button>
                    </div>
                  </th>

                  <!-- Columnas numéricas con filtros simplificados -->
                  <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                    B.I. 910
                    <button onclick="abrirModalFiltro('bi910')" style="background:rgba(67,117,238,.15);border:none;color:var(--blue-5);cursor:pointer;border-radius:4px;padding:2px 6px;margin-left:4px;font-size:11px;transition:background .12s" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                  </th>

                  <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                    B.I. PRETENDIDA
                    <button onclick="abrirModalFiltro('bip')" style="background: rgba(67, 117, 238, 0.15); border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: var(--blue-5); cursor: pointer; border-radius: 4px; padding: 2px 6px; margin-left: 4px; font-size: 11px; transition: background 0.12s;" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                  </th>

                  <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                    DIFERENCIA
                    <button onclick="abrirModalFiltro('dif')" style="background:rgba(67,117,238,.15);border:none;color:var(--blue-5);cursor:pointer;border-radius:4px;padding:2px 6px;margin-left:4px;font-size:11px;transition:background .12s" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                  </th>

                  <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                    IMPUESTO ESTIMADO
                    <button onclick="abrirModalFiltro('imp')" style="background:rgba(67,117,238,.15);border:none;color:var(--blue-5);cursor:pointer;border-radius:4px;padding:2px 6px;margin-left:4px;font-size:11px;transition:background .12s" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                  </th>

                  <th style="padding:10px 14px;text-align:right;font-weight:700;color:var(--blue-5);white-space:nowrap;position:relative">
                    NETO A PAGAR
                    <button onclick="abrirModalFiltro('neto')" style="background:rgba(67,117,238,.15);border:none;color:var(--blue-5);cursor:pointer;border-radius:4px;padding:2px 6px;margin-left:4px;font-size:11px;transition:background .12s" onmouseover="this.style.background='rgba(67,117,238,.3)'" onmouseout="this.style.background='rgba(67,117,238,.15)'">▾</button>
                  </th>

                  <th style="padding:10px 14px;text-align:center;font-weight:700;color:var(--blue-5);white-space:nowrap">ESTADO</th>

                </tr>
              </thead>
              <tbody id="resumen-tbody">
                <tr onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style="">
                  <td style="padding:10px 14px;font-family:monospace;font-size:12px;color:var(--blue-5);font-weight:600;border-bottom:1px solid var(--gray-1)">30504018845</td>
                  <td style="padding:10px 14px;font-weight:600;border-bottom:1px solid var(--gray-1)">VOLKSWAGEN ARGENTINA S.A</td>
                  <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 16.879.656.323</td>
                  <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 0</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 16.879.656.323</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 253.194.844</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 253.176.812</td>
                  <td style="padding:10px 14px;text-align:center;border-bottom:1px solid var(--gray-1)"><select class="estado-select relevante" onchange="cambiarEstado(this,1)" style="border:none;background:#ECFDF5;color:#059669;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif"><option value="ninguno">— Estado</option><option value="relevante" selected="">✓ Relevante</option><option value="reproceso">🔴 Reproceso</option></select></td>
                </tr>
                <tr onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style="">
                  <td style="padding:10px 14px;font-family:monospace;font-size:12px;color:var(--blue-5);font-weight:600;border-bottom:1px solid var(--gray-1)">30501685212</td>
                  <td style="padding:10px 14px;font-weight:600;border-bottom:1px solid var(--gray-1)">CERÁMICA DEL NORTE S.A</td>
                  <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 32.767.157</td>
                  <td style="padding:10px 14px;text-align:right;border-bottom:1px solid var(--gray-1)">$ 0</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 32.767.157</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 491.507</td>
                  <td style="padding:10px 14px;text-align:right;font-weight:600;color:#DC2626;border-bottom:1px solid var(--gray-1)">-$ 491.507</td>
                  <td style="padding:10px 14px;text-align:center;border-bottom:1px solid var(--gray-1)"><select class="estado-select ninguno" onchange="cambiarEstado(this,2)" style="border:none;background:var(--gray-1);color:var(--gray-5);border-radius:999px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif"><option value="ninguno" selected="">— Estado</option><option value="relevante">✓ Relevante</option><option value="reproceso">🔴 Reproceso</option></select></td>
                </tr>
              </tbody>
            </table>
            <!-- Paginación resumen -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid var(--gray-2)">
              <span id="resumen-pag-info" style="font-size:12px;color:var(--gray-5)">Mostrando 1–2 de 2 resultados</span>
              <div style="display:flex;align-items:center;gap:8px">
                <button onclick="pagResumen(-1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
                <span id="resumen-pag-txt" style="font-size:12px;color:var(--gray-5)">1 / 1</span>
                <button onclick="pagResumen(1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
              </div>
            </div>
          </div>

        </div><!-- /vista-resumen -->

      </div>

- Diseño Modal :

<div style="background:white;border-radius:16px;width:640px;max-width:100%;box-shadow:0 16px 48px rgba(0,0,0,.18);padding:32px" onclick="event.stopPropagation()">

    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <div>
        <div style="font-size:18px;font-weight:700;color:var(--gray-9)">Generar Intimación</div>
        <div style="font-size:12px;color:var(--gray-5);margin-top:3px">Revisá y editá el documento antes de generar</div>
      </div>
      <button onclick="document.getElementById('modal-intimacion').style.display='none'" style="width:32px;height:32px;border:none;background:var(--gray-1);border-radius:8px;cursor:pointer;color:var(--gray-5);font-size:18px;display:flex;align-items:center;justify-content:center">×</button>
    </div>

    <!-- Asunto -->
    <div style="margin-bottom:6px;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.06em">Asunto</div>
    <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px 18px;margin-bottom:16px">
      <label style="font-size:13px;font-weight:600;color:var(--gray-7);display:block;margin-bottom:6px">Texto del asunto</label>
      <input id="mint-asunto" class="form-input" value="PRESUNTA DIFERENCIA DE BASE IMPONIBLE">
    </div>

    <!-- Cuerpo -->
    <div style="margin-bottom:6px;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.06em">Cuerpo del documento</div>
    <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px 18px;margin-bottom:16px">
      <div style="margin-bottom:12px">
        <label style="font-size:13px;font-weight:600;color:var(--gray-7);display:block;margin-bottom:6px">Saludo</label>
        <input id="mint-saludo" class="form-input" value="Señor Contribuyente:">
      </div>
      <div>
        <label style="font-size:13px;font-weight:600;color:var(--gray-7);display:block;margin-bottom:6px">Texto del cuerpo</label>
        <textarea id="mint-cuerpo" class="form-input" rows="8" style="resize:vertical">Por medio de la presente, la Dirección Provincial de Rentas de Jujuy pone en su conocimiento que sobre la base de información cierta, derivada del cruce de bases de datos con el organismo recaudador nacional (ARCA) y los agentes de recaudación designados por este organismo, se han detectado inconsistencias en sus declaraciones juradas y en el cumplimiento de sus obligaciones fiscales en los periodos que se detallan en planilla adjunta.

Por ello, y en uso de las facultades conferidas a este organismo por el art. 10º inc. 3 del Código Fiscal, Ley Nro. 5791/2013, se lo intima para que en el término de diez (10) días proceda a presentar las declaraciones juradas originales o rectificativas, e ingrese el impuesto omitido más los intereses a la fecha del efectivo pago.

En caso de no regularizar su situación fiscal, la Dirección podrá dar inicio a una verificación integral, perdiendo Ud. el beneficio del cumplimiento voluntario debiendo abonar además del tributo las sanciones previstas en los artículos 48° y 49º del Código Fiscal (Ley 5791/2013), sin perjuicio de dar inicio al procedimiento de determinación de oficio en los términos del artículo 37° del mencionado plexo normativo.

Para dar cumplimiento a esta intimación podrá comunicarse con el Departamento Inteligencia Fiscal al siguiente correo electrónico: inteligenciafiscal@rentasjujuy.gob.ar o al Centro de Atención 0800-555-5599 en el horario de 07:30 a 12:30 o personalmente en Lavalle 55 - San Salvador de Jujuy - de Lunes a Viernes en el horario de 07:30 a 12:30.</textarea>

</div>
</div>

    <!-- Planilla adjunta columnas -->
    <div style="margin-bottom:6px;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.06em">Planilla adjunta — Columnas</div>
    <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px 18px;margin-bottom:16px">
      <div style="font-size:12px;color:var(--gray-5);margin-bottom:10px">Columnas que aparecen en la tabla de comparación de bases</div>
      <div id="mint-cols-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px;background:white;border:1px solid var(--gray-2);border-radius:8px;padding:8px 12px"><span style="color:var(--green-5);font-weight:700;font-size:14px">✓</span><span style="flex:1;font-size:13px;color:var(--gray-9)">AÑO</span><button onclick="this.parentElement.remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;line-height:1">×</button></div><div style="display:flex;align-items:center;gap:10px;background:white;border:1px solid var(--gray-2);border-radius:8px;padding:8px 12px"><span style="color:var(--green-5);font-weight:700;font-size:14px">✓</span><span style="flex:1;font-size:13px;color:var(--gray-9)">Base Imponible Ingresos Brutos</span><button onclick="this.parentElement.remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;line-height:1">×</button></div><div style="display:flex;align-items:center;gap:10px;background:white;border:1px solid var(--gray-2);border-radius:8px;padding:8px 12px"><span style="color:var(--green-5);font-weight:700;font-size:14px">✓</span><span style="flex:1;font-size:13px;color:var(--gray-9)">Base Imponible Informada por Terceros (*)</span><button onclick="this.parentElement.remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;line-height:1">×</button></div><div style="display:flex;align-items:center;gap:10px;background:white;border:1px solid var(--gray-2);border-radius:8px;padding:8px 12px"><span style="color:var(--green-5);font-weight:700;font-size:14px">✓</span><span style="flex:1;font-size:13px;color:var(--gray-9)">Diferencia de Base Imponible</span><button onclick="this.parentElement.remove()" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;line-height:1">×</button></div></div>
      <button onclick="cfgAgregarCol()" style="width:100%;background:var(--gray-0);border:1px dashed var(--gray-3);border-radius:8px;padding:8px;font-family:'DM Sans',sans-serif;font-size:12.5px;color:var(--gray-5);cursor:pointer;transition:all .12s" onmouseover="this.style.borderColor='var(--blue-5)';this.style.color='var(--blue-5)'" onmouseout="this.style.borderColor='var(--gray-3)';this.style.color='var(--gray-5)'">+ Elegir columnas de planilla</button>
    </div>

    <!-- Cierre -->
    <div style="margin-bottom:6px;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.06em">Cierre</div>
    <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px 18px;margin-bottom:24px">
      <label style="font-size:13px;font-weight:600;color:var(--gray-7);display:block;margin-bottom:6px">Texto pie de planilla</label>
      <input id="mint-pie" class="form-input" value="Fecha de corte 11/2025.">
    </div>

    <!-- Botones -->
    <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--gray-2);padding-top:20px">
      <button onclick="document.getElementById('modal-intimacion').style.display='none'" style="padding:10px 24px;border-radius:999px;border:1px solid var(--gray-2);background:white;color:var(--gray-7);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">Cancelar</button>
      <button onclick="siguienteModalIntimacion()" style="padding:10px 24px;border-radius:999px;border:none;background:var(--blue-5);color:white;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer" onmouseover="this.style.background='var(--blue-8)'" onmouseout="this.style.background='var(--blue-5)'">Siguiente →</button>
    </div>

  </div>
