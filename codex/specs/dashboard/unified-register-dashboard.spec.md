## Spec Dashboard Unified Register

- Referencia visual: `codex/assets/design/dashboard/unified-register/unified-register-dashboard.png` y `codex/assets/design/dashboard/unified-register/unified-register-dashboard-2.png`

## Requisitos

1. El dashboard debe mostrar toda la informacion de los widgets del padron unificado.
2. Todos los componentes deben usar Mantine UI, en caso de no tener compoenente para este se puede proceder a usar JSX.
3. Todos los componentes deben usar Mantine UI, en caso de no tener estilos predefinidos en la libreria para la implementacion debe usar CSS Modules.
4. No debe salirse de la arquitectura ni de los patrones de diseño que ya tenemos.
5. Para los Icons se debe usar Tabler Icons, en caso de necesitar icons mapeados se pueden agregar a `src/globals/Icons` y reutilizar desde alli.

## Funcionalidades

1. Header:

- Buttons:
- Marcar reproceso: debe disparar el modal para confirmacion y una vez confirmado enviar a reproceso (Por ahora solo lo estetico esta funcionalidad la conectamos despues)
- Cruces a realizar: Debe disparar un modal que ya lo tenemos armado en otra branch. No debemos implementar todavia.
- Generar informe: Todavia no podemos disparar ese modal ya que sera un modal reutilizable que implementaremos al tener lista la configuracion panel del proyecto, por lo que no se debe recrear.
- Agregar lote: El boton agregar lote dispara un selector custom donde aparecen los lotes cargados previamente en gestion de lotes, como no tenemos todo en la misma branch por ahora implementar con mock. Debe poseer un buscador de los lotes que esto todavia no tenemos contrato por ahora solo mock.

2. Cards:

- AddressCard: el usuario debe poder agregar, modificar y elimninar una direccion.
- ContactCard: el usuario debe poder agregar, modificar y eliminar un contacto.
- NotesCard: el usuario debe poder agregar, modificar y eliminar notas.

## Estructura

- Layout:

  Header //////////////////////////////////////////
  WidgetCard - WidgetCard - WidgetCard - WidgetCard
  ActivityCard - MultasTable //////////////////////
  AddressCard - InterventionOrderTable ////////////
  ContactCard - TaxesTable ////////////////////////
  NotesCard ///////////////////////////////////////

## Diseño y UI

<div id="padron-detalle" style="display: block; padding: 20px;">

          <!-- VOLVER -->
          <div style="margin-bottom:16px">
            <button onclick="volverListaPadron()" style="display:flex;align-items:center;gap:6px;background:white;border:1px solid var(--gray-2);border-radius:999px;padding:7px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--gray-7);cursor:pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Padrón Unificado
            </button>
          </div>

          <!-- HEADER PRINCIPAL -->
          <div style="background:white;border:1px solid var(--gray-2);border-radius:14px;padding:20px 24px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:16px">
              <div style="flex:1">
                <div style="font-size:10.5px;color:var(--gray-5);font-family:monospace;letter-spacing:.05em;margin-bottom:4px">CUIT 30-50401884-5</div>
                <div style="font-size:22px;font-weight:800;color:var(--gray-9);margin-bottom:10px">VOLKSWAGEN ARGENTINA S.A.</div>
                <!-- Chips de info clave -->
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">
                  <span style="background:var(--green-1);color:#059669;font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px;display:flex;align-items:center;gap:4px">
                    <span style="width:6px;height:6px;border-radius:50%;background:#059669;display:inline-block"></span> Activo
                  </span>
                  <span style="background:var(--blue-1);color:var(--blue-5);font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px">Convenio Multilateral</span>
                  <span style="background:#EFF6FF;color:#1D4ED8;font-size:12px;font-weight:600;padding:4px 12px;border-radius:999px">Control IF: 3 lotes</span>
                  <span style="background:var(--gray-1);color:var(--gray-7);font-size:12px;font-weight:500;padding:4px 12px;border-radius:999px">Fabricación de vehículos automotores</span>
                  <span style="background:var(--gray-1);color:var(--gray-5);font-size:12px;font-weight:500;padding:4px 12px;border-radius:999px">Venta mayorista</span>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:6px 20px;font-size:12.5px;color:var(--gray-5)">
                  <span><strong style="color:var(--gray-7)">Inicio actividad:</strong> 01/06/2005</span>
                  <span><strong style="color:var(--gray-7)">Jurisdicción:</strong> Jujuy (J.910)</span>
                  <span><strong style="color:var(--gray-7)">Domicilio fiscal:</strong> Av. San Martín 1234, S.S. de Jujuy</span>
                  <span><strong style="color:var(--gray-7)">Domicilio alternativo:</strong> Belgrano 890, S.S. de Jujuy</span>
                </div>
              </div>
              <!-- Clasificación de riesgo A/B/C/D -->
              <div style="text-align:center;background:#FEF2F2;border:2px solid #FECACA;border-radius:14px;padding:16px 24px;flex-shrink:0;min-width:90px">
                <div style="font-size:42px;font-weight:900;color:#DC2626;line-height:1">A</div>
                <div style="font-size:10px;color:#991B1B;text-transform:uppercase;letter-spacing:.07em;margin-top:4px;font-weight:700">Riesgo</div>
              </div>
            </div>

            <!-- CONTROLES -->
            <div style="border-top:1px solid var(--gray-1);padding-top:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:space-between">
              <div id="reproceso-chip" onclick="toggleReprocesoPadron()" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;border:1px solid var(--gray-2);background:var(--gray-0);cursor:pointer;user-select:none;transition:all .2s">
                <div id="reproceso-switch" style="width:28px;height:16px;border-radius:999px;background:var(--gray-2);position:relative;transition:background .2s;flex-shrink:0">
                  <div id="reproceso-knob" style="position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:white;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)"></div>
                </div>
                <span id="reproceso-label" style="font-size:12px;font-weight:600;color:var(--gray-5);white-space:nowrap">Marcar reproceso</span>
              </div>
              <div style="position:relative">
                <button onclick="toggleCrucesPanel()" style="display:flex;align-items:center;gap:6px;background:var(--gray-0);border:1px solid var(--gray-2);border-radius:999px;padding:6px 12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:var(--gray-7)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue-5)" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  <span id="cruces-label">Cruces a realizar</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gray-5)" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div id="cruces-panel" style="display:none;position:absolute;top:calc(100% + 8px);left:0;background:white;border:1px solid var(--gray-2);border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:9999;min-width:380px;overflow:hidden">

                  <!-- ── CRUCES MENSUALES ── -->
                  <div style="border-bottom:1px solid var(--gray-1)">
                    <div onclick="toggleSeccionCruces('mensual')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;cursor:pointer;background:var(--gray-0)" onmouseover="this.style.background='#EFF6FF'" onmouseout="this.style.background='var(--gray-0)'">
                      <div style="display:flex;align-items:center;gap:8px">
                        <span style="background:#DBEAFE;color:#2563EB;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;letter-spacing:.04em">MENSUAL</span>
                        <span style="font-size:12.5px;font-weight:700;color:var(--gray-7)">Cruces mensuales</span>
                      </div>
                      <svg id="chevron-mensual" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gray-5)" stroke-width="2" style="transition:transform .2s;transform:rotate(90deg)"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>

                    <div id="seccion-mensual" style="padding:12px 16px">
                      <!-- Selector período mensual -->
                      <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:12px 14px;margin-bottom:10px">
                        <div style="font-size:10px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">Período a fiscalizar</div>
                        <div style="display:flex;align-items:center;gap:8px">
                          <div style="flex:1">
                            <div style="font-size:11px;color:#2563EB;margin-bottom:4px;font-weight:500">Desde</div>
                            <div style="display:flex;gap:4px">
                              <select style="flex:1;border:1px solid #BFDBFE;border-radius:7px;padding:6px 8px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--gray-9);outline:none;background:white">
                                <option>Ene</option><option>Feb</option><option>Mar</option><option>Abr</option><option>May</option><option>Jun</option><option selected="">Jul</option><option>Ago</option><option>Sep</option><option>Oct</option><option>Nov</option><option>Dic</option>
                              </select>
                              <select style="width:68px;border:1px solid #BFDBFE;border-radius:7px;padding:6px 8px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--gray-9);outline:none;background:white">
                                <option>2022</option><option>2023</option><option selected="">2024</option><option>2025</option>
                              </select>
                            </div>
                          </div>
                          <div style="color:var(--gray-4);font-size:16px;margin-top:14px">→</div>
                          <div style="flex:1">
                            <div style="font-size:11px;color:#2563EB;margin-bottom:4px;font-weight:500">Hasta</div>
                            <div style="display:flex;gap:4px">
                              <select style="flex:1;border:1px solid #BFDBFE;border-radius:7px;padding:6px 8px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--gray-9);outline:none;background:white">
                                <option>Ene</option><option>Feb</option><option>Mar</option><option>Abr</option><option>May</option><option>Jun</option><option>Jul</option><option>Ago</option><option>Sep</option><option>Oct</option><option>Nov</option><option selected="">Dic</option>
                              </select>
                              <select style="width:68px;border:1px solid #BFDBFE;border-radius:7px;padding:6px 8px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--gray-9);outline:none;background:white">
                                <option>2022</option><option>2023</option><option>2024</option><option selected="">2025</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Cruces mensuales -->
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" onclick="actualizarCrucesLabel()"> Control de desvío de BI — Régimen Gral</label>
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" onclick="actualizarCrucesLabel()"> Control de créditos</label>
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" checked="" onclick="actualizarCrucesLabel()"> Control de SAF</label>
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" onclick="actualizarCrucesLabel()"> Control de Agentes</label>
                    </div>
                  </div>

                  <!-- ── CRUCES ANUALES ── -->
                  <div style="border-bottom:1px solid var(--gray-1)">
                    <div onclick="toggleSeccionCruces('anual')" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;cursor:pointer;background:var(--gray-0)" onmouseover="this.style.background='#F0FDF4'" onmouseout="this.style.background='var(--gray-0)'">
                      <div style="display:flex;align-items:center;gap:8px">
                        <span style="background:#D1FAE5;color:#059669;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;letter-spacing:.04em">ANUAL</span>
                        <span style="font-size:12.5px;font-weight:700;color:var(--gray-7)">Cruces anuales</span>
                      </div>
                      <svg id="chevron-anual" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gray-5)" stroke-width="2" style="transition:transform .2s;transform:rotate(90deg)"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>

                    <div id="seccion-anual" style="padding:12px 16px">
                      <!-- Selector período anual -->
                      <div style="background:#F0FDF4;border:1px solid #A7F3D0;border-radius:10px;padding:12px 14px;margin-bottom:10px">
                        <div style="font-size:10px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">Período a fiscalizar</div>
                        <div style="display:flex;align-items:center;gap:8px">
                          <div style="flex:1">
                            <div style="font-size:11px;color:#059669;margin-bottom:4px;font-weight:500">Desde</div>
                            <select style="width:100%;border:1px solid #A7F3D0;border-radius:7px;padding:6px 10px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--gray-9);outline:none;background:white">
                              <option>2020</option><option>2021</option><option>2022</option><option selected="">2023</option><option>2024</option><option>2025</option>
                            </select>
                          </div>
                          <div style="color:var(--gray-4);font-size:16px;margin-top:14px">→</div>
                          <div style="flex:1">
                            <div style="font-size:11px;color:#059669;margin-bottom:4px;font-weight:500">Hasta</div>
                            <select style="width:100%;border:1px solid #A7F3D0;border-radius:7px;padding:6px 10px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--gray-9);outline:none;background:white">
                              <option>2020</option><option>2021</option><option>2022</option><option>2023</option><option>2024</option><option selected="">2025</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <!-- Cruces anuales -->
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" checked="" onclick="actualizarCrucesLabel()"> Control de desvío de BI — Régimen CM</label>
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" onclick="actualizarCrucesLabel()"> Control de BI declarada por actividad</label>
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" onclick="actualizarCrucesLabel()"> Detección de no inscriptos</label>
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" onclick="actualizarCrucesLabel()"> Comparación de Bases Presuntivas</label>
                      <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" onclick="actualizarCrucesLabel()"> Contribuyentes con más de dos inmuebles</label>
                    </div>
                  </div>

                  <div style="padding:10px 16px;display:flex;justify-content:flex-end">
                    <button class="btn btn-primary btn-sm" onclick="toggleCrucesPanel();showToast('✅ Cruces guardados','success')">Confirmar</button>
                  </div>
                </div>
              </div>
              <div style="margin-left:auto;display:flex;align-items:center;gap:8px;position:relative">
                <button onclick="abrirModalInforme()" style="display: flex; align-items: center; gap: 6px; background: var(--gray-0); border: 1px solid var(--gray-2); border-radius: 999px; padding: 6px 12px; cursor: pointer; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 12px; font-weight: 600; color: var(--gray-7);" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='var(--gray-0)'">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  Generar Informe
                </button>
                <button class="btn btn-primary btn-sm" onclick="toggleLoteSelector()"> Agregar a lote</button>
                <div id="lote-selector" style="display: none; position: absolute; top: calc(100% + 8px); right: 0px; background: white; border: 1px solid var(--gray-2); border-radius: 12px; box-shadow: rgba(0, 0, 0, 0.12) 0px 8px 24px; z-index: 9999; min-width: 280px; overflow: hidden;">
                  <div style="padding:10px 12px 6px">
                    <input id="lote-selector-search" oninput="filtrarLoteSelector()" placeholder="Buscar lote..." style="width: 100%; border-color: var(--gray-2); border-top-style: ; border-top-width: ; border-right-style: ; border-right-width: ; border-bottom-style: ; border-bottom-width: ; border-left-style: ; border-left-width: ; border-image-source: ; border-image-slice: ; border-image-width: ; border-image-outset: ; border-image-repeat: ; border-radius: 8px; padding: 7px 12px; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 13px; outline: none; box-sizing: border-box;" onfocus="this.style.borderColor='var(--blue-5)'" onblur="this.style.borderColor='var(--gray-2)'">
                  </div>
                  <div id="lote-selector-list">
                    <div onclick="confirmarAgregarLote('ANOVA-622',47)" class="lote-sel-item" style="padding: 10px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><span style="font-size:13px;font-weight:600">ANOVA-622</span><span style="font-size:11.5px;color:var(--gray-5)">47 CUITs</span></div>
                    <div onclick="confirmarAgregarLote('TRUFA-589',83)" class="lote-sel-item" style="padding: 10px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><span style="font-size:13px;font-weight:600">TRUFA-589</span><span style="font-size:11.5px;color:var(--gray-5)">83 CUITs</span></div>
                    <div onclick="confirmarAgregarLote('GC-2023',31)" class="lote-sel-item" style="padding: 10px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''"><span style="font-size:13px;font-weight:600">GC-2023</span><span style="font-size:11.5px;color:var(--gray-5)">31 CUITs</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- KPIs -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:16px">
            <!-- BI Declarada -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px">
              <div style="font-size:11.5px;color:var(--gray-5);margin-bottom:6px">BI Declarada</div>
              <div style="font-size:24px;font-weight:800;color:var(--gray-9)">$16.879 M</div>
              <div style="margin-top:8px">
                <span style="background:var(--blue-1);color:var(--blue-5);font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px">Convenio Multilateral</span>
              </div>
            </div>
            <!-- Impuestos declarados -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px">
              <div style="font-size:11.5px;color:var(--gray-5);margin-bottom:6px">Impuestos declarados</div>
              <div style="font-size:24px;font-weight:800;color:var(--gray-9)">$253.194 K</div>
              <div style="font-size:12px;color:var(--gray-5);margin-top:4px">Últimos 12 meses</div>
            </div>
            <!-- Deuda -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px">
              <div style="font-size:11.5px;color:var(--gray-5);margin-bottom:6px">Deuda</div>
              <div style="font-size:24px;font-weight:800;color:#DC2626">$38.450 K</div>
              <div style="font-size:12px;color:#DC2626;margin-top:4px">Últimos 12 meses</div>
            </div>
            <!-- DDJJ -->
            <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px">
              <div style="font-size:11.5px;color:var(--gray-5);margin-bottom:6px">Declaraciones juradas</div>
              <div style="display:flex;align-items:baseline;gap:8px;margin-top:4px">
                <div>
                  <div style="font-size:24px;font-weight:800;color:#059669">10</div>
                  <div style="font-size:11px;color:#059669;margin-top:2px">Presentadas</div>
                </div>
                <div style="color:var(--gray-3);font-size:20px;font-weight:300">/</div>
                <div>
                  <div style="font-size:24px;font-weight:800;color:#DC2626">2</div>
                  <div style="font-size:11px;color:#DC2626;margin-top:2px">No presentadas</div>
                </div>
              </div>
            </div>
          </div>

          <!-- GRILLA PRINCIPAL -->
          <div style="display:grid;grid-template-columns:280px 1fr;gap:14px;margin-bottom:16px;align-items:start">

            <!-- COLUMNA IZQUIERDA -->
            <div style="display:flex;flex-direction:column;gap:12px">

              <!-- Actividades -->
              <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px">
                <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:12px">Actividades</div>
                <div style="display:grid;gap:10px;font-size:12.5px">
                  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                    <div>
                      <div style="color:var(--gray-5);font-size:11px;margin-bottom:2px">Primaria</div>
                      <div style="font-weight:600">Fabricación de vehículos automotores</div>

                    </div>
                    <span style="background:var(--blue-1);color:var(--blue-5);font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:999px;white-space:nowrap;flex-shrink:0">Principal</span>
                  </div>
                  <div style="border-top:1px solid var(--gray-1);padding-top:10px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                    <div>
                      <div style="color:var(--gray-5);font-size:11px;margin-bottom:2px">Secundaria</div>
                      <div style="font-weight:600">Venta al por mayor de vehículos y repuestos</div>

                    </div>
                    <span style="background:#F3E8FF;color:#7C3AED;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:999px;white-space:nowrap;flex-shrink:0">Secundaria</span>
                  </div>
                </div>
              </div>

              <!-- Domicilios -->
              <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px">
                <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:12px">Domicilios</div>
                <div style="display:grid;gap:10px;font-size:12.5px">
                  <!-- Fiscal y Comercial: fijos -->
                  <div><div style="color:var(--gray-5);font-size:11px">Fiscal</div><div style="font-weight:600">Av. San Martín 1234, S.S. de Jujuy</div></div>
                  <div><div style="color:var(--gray-5);font-size:11px">Comercial</div><div style="font-weight:600">Ruta Nac. 9 km 12, Palpalá</div></div>
                  <!-- Alternativos -->
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
                    <div style="font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em">Alternativos</div>
                    <button onclick="abrirModalAgregarDomicilio()" style="background:var(--blue-1);color:var(--blue-5);border:none;border-radius:6px;padding:4px 10px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer">+ Agregar</button>
                  </div>
                  <div id="pd-domicilios-alternativos" style="display:flex;flex-direction:column;gap:8px">
                    <div class="pd-dom-alt" style="background:var(--gray-0);border:1px solid var(--gray-2);border-radius:8px;padding:10px 12px">
                      <div style="display:flex;justify-content:flex-end;gap:6px;margin-bottom:6px">
                        <button onclick="pdEditarDomAlt(this)" style="border:none;background:transparent;cursor:pointer;color:var(--gray-5);font-size:11px;font-weight:500;padding:0;font-family:'DM Sans',sans-serif">Editar</button>
                        <button onclick="confirmarEliminar('Eliminar domicilio','¿Estás seguro que querés eliminar este domicilio alternativo?', function(){ this.closest('.pd-dom-alt').remove(); showToast('Domicilio eliminado','info'); }.bind(this))" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:11px;font-weight:500;padding:0;font-family:'DM Sans',sans-serif">Eliminar</button>
                      </div>
                      <div style="font-weight:600;font-size:13px;color:var(--gray-9)">Belgrano 890, S.S. de Jujuy</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contactos -->
              <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                  <div style="font-size:13px;font-weight:700;color:var(--gray-9)">Contactos</div>
                  <button onclick="abrirModalAgregarContactos()" style="background:var(--blue-1);color:var(--blue-5);border:none;border-radius:6px;padding:4px 10px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer">+ Agregar</button>
                </div>
                <!-- Contacto visible -->
                <div id="pd-contacto-card" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px;font-size:12.5px">
                  <div style="display:flex;justify-content:flex-end;gap:6px;margin-bottom:10px">
                    <button onclick="pdEditarContactoModal()" style="border:none;background:transparent;cursor:pointer;color:var(--gray-5);font-size:11px;font-weight:500;padding:0;font-family:'DM Sans',sans-serif">Editar</button>
                    <button onclick="confirmarEliminar('Eliminar contacto','¿Estás seguro que querés eliminar este contacto?', pdEliminarContacto)" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:11px;font-weight:500;padding:0;font-family:'DM Sans',sans-serif">Eliminar</button>
                  </div>
                  <div id="pd-contacto-contenido"><div style="margin-bottom:8px"><div style="font-weight:600;font-size:13px;color:var(--gray-9);margin-bottom:2px">Teléfono</div><div style="font-size:12px;color:var(--gray-5)">+54 388 422-0000</div></div><div style="margin-bottom:8px"><div style="font-weight:600;font-size:13px;color:var(--gray-9);margin-bottom:2px">Mail</div><div style="font-size:12px;color:var(--gray-5)">impuestos@vw-arg.com</div></div><div style="margin-bottom:8px"><div style="font-weight:600;font-size:13px;color:var(--gray-9);margin-bottom:2px">Representante legal</div><div style="font-size:12px;color:var(--gray-5)">Carlos Méndez</div></div><div style="margin-bottom:8px"><div style="font-weight:600;font-size:13px;color:var(--gray-9);margin-bottom:2px">Contador</div><div style="font-size:12px;color:var(--gray-5)">Estudio García &amp; Asoc.</div></div></div>
                </div>
                <!-- Paginación -->
                <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:10px;border-top:1px solid #FDE68A;padding-top:8px">
                  <button onclick="pdContactoPag(-1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
                  <span id="pd-contacto-pag" style="font-size:12px;color:var(--gray-5)">1 / 2</span>
                  <button onclick="pdContactoPag(1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
                </div>
              </div>

              <!-- Notas internas -->
              <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                  <div style="font-size:13px;font-weight:700;color:var(--gray-9)">Notas internas</div>
                  <button onclick="pdAgregarNota()" style="background:var(--blue-1);color:var(--blue-5);border:none;border-radius:6px;padding:4px 10px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer">+ Nota</button>
                </div>
                <!-- Nota visible -->
                <div id="pd-nota-card" style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px">
                  <div style="display:flex;justify-content:flex-end;gap:6px;margin-bottom:8px">
                    <button onclick="pdEditarNota()" style="border:none;background:transparent;cursor:pointer;color:var(--gray-5);font-size:11px;font-weight:500;padding:0;font-family:'DM Sans',sans-serif">Editar</button>
                    <button onclick="confirmarEliminar('Eliminar nota','¿Estás seguro que querés eliminar esta nota?', pdEliminarNota)" style="border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:11px;font-weight:500;padding:0;font-family:'DM Sans',sans-serif">Eliminar</button>
                  </div>
                  <div id="pd-nota-texto" style="font-size:12.5px;color:var(--gray-7);line-height:1.5">Pendiente de respuesta de intimación.</div>
                </div>
                <!-- Paginación -->
                <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:10px;border-top:1px solid #FDE68A;padding-top:8px">
                  <button onclick="pdNotaPag(-1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
                  <span id="pd-nota-pag" style="font-size:12px;color:var(--gray-5)">1 / 2</span>
                  <button onclick="pdNotaPag(1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
                </div>
              </div>

            </div><!-- /col izq -->

            <!-- COLUMNA DERECHA -->
            <div style="display:flex;flex-direction:column;gap:12px">

              <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px">
                <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:12px;display:flex;align-items:center;gap:8px">
                  Multas Mercurio
                  <span style="background:#FEF2F2;color:#DC2626;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">3 registros</span>
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:12px">
                  <thead><tr style="background:var(--gray-0)">
                    <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">N°</th>
                    <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">Fecha</th>
                    <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">Descripción</th>
                    <th style="padding:7px 10px;text-align:right;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">Monto</th>
                    <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">Estado</th>
                  </tr></thead>
                  <tbody>
                    <tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''" style="">
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);color:var(--gray-5);font-size:12px">MER-001</td>
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);color:var(--gray-5)">12/03/2025</td>
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);font-weight:500">Exceso de carga — Ruta 9 km 34</td>
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);text-align:right;font-weight:600;color:#DC2626">$180.000</td>
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);text-align:center"><span style="background:#FEF2F2;color:#DC2626;font-size:10px;font-weight:600;padding:2px 8px;border-radius:999px">Impaga</span></td>
                    </tr>
                    <tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''" style="">
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);color:var(--gray-5);font-size:12px">MER-002</td>
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);color:var(--gray-5)">08/09/2024</td>
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);font-weight:500">Documentación incompleta — Ruta 9</td>
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);text-align:right;font-weight:600;color:#059669">$95.000</td>
                      <td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);text-align:center"><span style="background:var(--green-1);color:#059669;font-size:10px;font-weight:600;padding:2px 8px;border-radius:999px">Pagada</span></td>
                    </tr>
                    <tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''" style="">
                      <td style="padding:8px 10px;color:var(--gray-5);font-size:12px">MER-003</td>
                      <td style="padding:8px 10px;color:var(--gray-5)">15/04/2024</td>
                      <td style="padding:8px 10px;font-weight:500">Mercadería sin remito — Ruta 34</td>
                      <td style="padding:8px 10px;text-align:right;font-weight:600;color:#D97706">$220.000</td>
                      <td style="padding:8px 10px;text-align:center"><span style="background:#FFF7ED;color:#D97706;font-size:10px;font-weight:600;padding:2px 8px;border-radius:999px">En gestión</span></td>
                    </tr>
                  </tbody>
                </table>
                <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:10px;border-top:1px solid var(--gray-2);padding-top:8px">
                  <button onclick="pagMercurio(-1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
                  <span id="pag-mer-txt" style="font-size:12px;color:var(--gray-5)">1 / 1</span>
                  <button onclick="pagMercurio(1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
                </div>
              </div>

              <!-- Órdenes de Intervención -->
              <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:16px">
                <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:12px;display:flex;align-items:center;gap:8px">
                  Órdenes de Intervención
                  <span style="background:var(--blue-1);color:var(--blue-5);font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">2 registros</span>
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:12px">
                  <thead><tr style="background:var(--gray-0)">
                    <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">N° OI</th>
                    <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">Período</th>
                    <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">Motivo</th>
                    <th style="padding:7px 10px;text-align:right;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">Monto</th>
                    <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;border-bottom:1px solid var(--gray-2)">Estado</th>
                  </tr></thead>
                  <tbody><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''" style=""><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);font-family:monospace;font-weight:600;color:var(--blue-5)">OI-2025-0341</td><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);color:var(--gray-5)">2023 — 2024</td><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1)">Desvío de BI — Régimen CM</td><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);text-align:right;font-weight:600;color:#DC2626">$253.194.844</td><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);text-align:center"><span style="background:#FFF7ED;color:#D97706;font-size:10px;font-weight:600;padding:2px 8px;border-radius:999px">En curso</span></td></tr><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''" style=""><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);font-family:monospace;font-weight:600;color:var(--blue-5)">OI-2022-0187</td><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);color:var(--gray-5)">2020 — 2021</td><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1)">Control de créditos — Local</td><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);text-align:right;font-weight:600;color:var(--gray-7)">$38.450.000</td><td style="padding:8px 10px;border-bottom:1px solid var(--gray-1);text-align:center"><span style="background:var(--green-1);color:#059669;font-size:10px;font-weight:600;padding:2px 8px;border-radius:999px">Cerrada</span></td></tr></tbody>
                </table>
                <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:10px;border-top:1px solid var(--gray-2);padding-top:8px">
                  <button onclick="pagOI(-1)" style="width: 26px; height: 26px; border: 1px solid var(--gray-2); border-radius: 6px; background: white; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
                  <span id="pag-oi-txt" style="font-size:12px;color:var(--gray-5)">1 / 1</span>
                  <button onclick="pagOI(1)" style="width: 26px; height: 26px; border: 1px solid var(--gray-2); border-radius: 6px; background: white; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
                </div>
              </div>

              <!-- TABS DE FUENTES -->
              <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;overflow:hidden">

            <div style="display:flex;border-bottom:1px solid var(--gray-2);overflow-x:auto;background:var(--gray-0)">
              <button class="ptab-btn active" onclick="setPadronTab(this,'tab-iibb')" style="padding:14px 20px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--blue-5);cursor:pointer;white-space:nowrap;border-bottom:2px solid var(--blue-5);margin-bottom:-1px">Ingresos Brutos</button>
              <button class="ptab-btn" onclick="setPadronTab(this,'tab-arca')" style="padding:14px 20px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--gray-5);cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px">ARCA</button>
              <button class="ptab-btn" onclick="setPadronTab(this,'tab-cm')" style="padding:14px 20px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--gray-5);cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px">Convenio Multilateral</button>
              <button class="ptab-btn" onclick="setPadronTab(this,'tab-ret')" style="padding:14px 20px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--gray-5);cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px">Retenciones</button>
              <button class="ptab-btn" onclick="setPadronTab(this,'tab-perc')" style="padding:14px 20px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--gray-5);cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px">Percepciones</button>
              <button class="ptab-btn" onclick="setPadronTab(this,'tab-inm')" style="padding:14px 20px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--gray-5);cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px">Inmuebles</button>
              <button class="ptab-btn" onclick="setPadronTab(this,'tab-mer')" style="padding:14px 20px;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--gray-5);cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px">Mercurio</button>
            </div>
            <div id="tab-iibb" class="padron-tab-content" style="overflow-x:auto">
              <table><thead><tr><th>Período</th><th>BI Declarada</th><th>Ingresos</th><th>Egresos</th><th>Actualización</th><th>Calidad</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>2026-01</td><td>$95.000.000</td><td>$95.000.000</td><td>$71.000.000</td><td>10/02/2026</td><td>Alta</td><td><span class="badge badge-normal" style="font-size:11px">✓ Validado</span></td></tr>
                <tr><td>2026-02</td><td>$101.000.000</td><td>$101.000.000</td><td>$73.000.000</td><td>09/03/2026</td><td>Media</td><td><span class="badge badge-normal" style="font-size:11px">✓ Validado</span></td></tr>
                <tr><td>2026-03</td><td>$108.000.000</td><td>$108.000.000</td><td>$74.000.000</td><td>10/04/2026</td><td>Alta</td><td><span class="badge badge-normal" style="font-size:11px">✓ Validado</span></td></tr>
              </tbody></table>
            </div>
            <div id="tab-arca" class="padron-tab-content" style="display:none;overflow-x:auto">
              <table><thead><tr><th>Período</th><th>Facturación ARCA</th><th>BI declarada IIBB</th><th>Diferencia</th><th>Actualización</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>2026-01</td><td>$138.000.000</td><td>$95.000.000</td><td style="color:#DC2626;font-weight:600">+$43.000.000</td><td>11/02/2026</td><td><span class="badge badge-critico" style="font-size:11px">Diferencia</span></td></tr>
                <tr><td>2026-02</td><td>$151.000.000</td><td>$101.000.000</td><td style="color:#DC2626;font-weight:600">+$50.000.000</td><td>11/03/2026</td><td><span class="badge badge-critico" style="font-size:11px">Diferencia</span></td></tr>
                <tr><td>2026-03</td><td>$162.000.000</td><td>$108.000.000</td><td style="color:#DC2626;font-weight:600">+$54.000.000</td><td>11/04/2026</td><td><span class="badge badge-critico" style="font-size:11px">Diferencia</span></td></tr>
              </tbody></table>
            </div>
            <div id="tab-cm" class="padron-tab-content" style="display:none;overflow-x:auto">
              <table><thead><tr><th>Período</th><th>Jurisdicción</th><th>BI Declarada CM03</th><th>Coef. Unificado</th><th>Tot. Ingresos País</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>2026-01</td><td>Jujuy (J.910)</td><td>$16.879.656.323</td><td>0.4800%</td><td>$2.927.995.069.414</td><td><span class="badge badge-critico" style="font-size:11px">Desvío</span></td></tr>
                <tr><td>2025-12</td><td>Jujuy (J.910)</td><td>$15.200.000.000</td><td>0.4750%</td><td>$2.800.000.000.000</td><td><span class="badge badge-advertencia" style="font-size:11px">Revisar</span></td></tr>
                <tr><td>2025-06</td><td>Jujuy (J.910)</td><td>$12.100.000.000</td><td>0.4600%</td><td>$2.630.000.000.000</td><td><span class="badge badge-normal" style="font-size:11px">✓ OK</span></td></tr>
              </tbody></table>
            </div>
            <div id="tab-ret" class="padron-tab-content" style="display:none;overflow-x:auto">
              <table><thead><tr><th>Período</th><th>Agente</th><th>Monto retenido</th><th>Declarado por contribuyente</th><th>Diferencia</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>2026-01</td><td>ARCOR S.A.</td><td>$1.240.000</td><td>$1.240.000</td><td style="color:#059669">$0</td><td><span class="badge badge-normal" style="font-size:11px">✓ OK</span></td></tr>
                <tr><td>2026-01</td><td>CARREFOUR ARG.</td><td>$2.890.000</td><td>$2.450.000</td><td style="color:#DC2626;font-weight:600">+$440.000</td><td><span class="badge badge-critico" style="font-size:11px">Diferencia</span></td></tr>
                <tr><td>2026-02</td><td>WALMART ARG.</td><td>$1.890.000</td><td>$1.890.000</td><td style="color:#059669">$0</td><td><span class="badge badge-normal" style="font-size:11px">✓ OK</span></td></tr>
              </tbody></table>
            </div>
            <div id="tab-perc" class="padron-tab-content" style="display:none;overflow-x:auto">
              <table><thead><tr><th>Período</th><th>Agente</th><th>Monto percibido</th><th>Base de percepción</th><th>Alícuota</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>2026-01</td><td>DGR Jujuy</td><td>$3.120.000</td><td>$208.000.000</td><td>1.50%</td><td><span class="badge badge-normal" style="font-size:11px">✓ OK</span></td></tr>
                <tr><td>2026-02</td><td>DGR Jujuy</td><td>$3.450.000</td><td>$230.000.000</td><td>1.50%</td><td><span class="badge badge-normal" style="font-size:11px">✓ OK</span></td></tr>
                <tr><td>2026-03</td><td>DGR Jujuy</td><td>$3.780.000</td><td>$252.000.000</td><td>1.50%</td><td><span class="badge badge-normal" style="font-size:11px">✓ OK</span></td></tr>
              </tbody></table>
            </div>
            <div id="tab-inm" class="padron-tab-content" style="display:none;overflow-x:auto">
              <table><thead><tr><th>Partida</th><th>Domicilio</th><th>Categoría</th><th>Valuación fiscal</th><th>Impuesto anual</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>12-345-678</td><td>Av. San Martín 1234</td><td>Comercial</td><td>$45.000.000</td><td>$1.350.000</td><td><span class="badge badge-normal" style="font-size:11px">Al día</span></td></tr>
                <tr><td>12-345-679</td><td>Ruta Nac. 9 km 12</td><td>Industrial</td><td>$120.000.000</td><td>$3.600.000</td><td><span class="badge badge-normal" style="font-size:11px">Al día</span></td></tr>
                <tr><td>12-345-680</td><td>Calle Belgrano 890</td><td>Comercial</td><td>$32.000.000</td><td>$960.000</td><td><span class="badge badge-advertencia" style="font-size:11px">Deuda parcial</span></td></tr>
              </tbody></table>
            </div>
            <div id="tab-mer" class="padron-tab-content" style="display:none;overflow-x:auto">
              <table><thead><tr><th>Período</th><th>Concepto</th><th>Monto</th><th>Vencimiento</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td>2026-01</td><td>Anticipo IIBB</td><td>$4.200.000</td><td>15/02/2026</td><td><span class="badge badge-normal" style="font-size:11px">Pagado</span></td></tr>
                <tr><td>2026-02</td><td>Anticipo IIBB</td><td>$4.500.000</td><td>15/03/2026</td><td><span class="badge badge-normal" style="font-size:11px">Pagado</span></td></tr>
                <tr><td>2026-03</td><td>Anticipo IIBB</td><td>$4.800.000</td><td>15/04/2026</td><td><span class="badge badge-critico" style="font-size:11px">Pendiente</span></td></tr>
              </tbody></table>
            </div>
            <!-- Paginación tabs fuentes -->
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:10px 16px;border-top:1px solid var(--gray-2)">
              <button onclick="pagFuentes(-1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">←</button>
              <span id="pag-fuentes-txt" style="font-size:12px;color:var(--gray-5)">1 / 1</span>
              <button onclick="pagFuentes(1)" style="width:26px;height:26px;border:1px solid var(--gray-2);border-radius:6px;background:white;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background='white'">→</button>
            </div>
          </div><!-- /tabs fuentes -->

            </div><!-- /col der -->
          </div><!-- /grilla -->

      </div>
