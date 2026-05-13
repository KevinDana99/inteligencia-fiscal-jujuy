## Spec Batch Management

## Diseño

**Ref visual:** `codex/assets/design/dashboard/batch-management/batchs.png`

## Estructura

1. Cotenedor general modulo gestion de lotes:
   <Stack gap-xl>
2. Header de modulo de lotes:
<div class="Group justify-apart">
            <!-- Stack gap="xs" -->
            <div class="Stack gap-xs">
              <!-- Title order={3} → <Title order={3}>Gestión de Lotes</Title> -->
              <h3 class="Title order-3">Gestión de Lotes</h3>
              <!-- Text fz="sm" c="dimmed" -->
              <p class="Text fz-sm c-dimmed">Administrá los lotes de CUITs para análisis fiscal</p>
            </div>
            <!--
              Button variant="filled" color="blue" size="sm" radius="xl" leftSection={<IconPlus/>}
              → <Button variant="filled" color="blue" size="sm" radius="xl" leftSection={<IconPlus size={14}/>} onClick={() => openModal('modal-nuevo-lote')}>
            -->
            <button class="Button variant-filled bg-blue-5 size-sm radius-full" onclick="openModal('modal-nuevo-lote')">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
              Nuevo Lote
            </button>
          </div>

3. Buscador:

<div class="Group gap-md">
            <!--
              TextInput leftSection={<IconSearch/>} radius="xl" placeholder="Buscar..."
              → <TextInput leftSection={<IconSearch size={16}/>} radius="xl" placeholder="Buscar por número de lote..." style={{maxWidth:320}}/>
            -->
            <div class="Input-wrapper" style="max-width:320px;width:100%">
              <div class="Input-leftSection">
                <svg fill="none" viewBox="0 0 24 24" stroke="var(--m-gray-5)" stroke-width="2" style="width:16px;height:16px"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input class="Input leftPad radius-xl" type="text" placeholder="Buscar por número de lote..." oninput="filtrarLotes(this.value)">
            </div>
            <!-- Text fz="sm" c="dimmed" → contador -->
            <span class="Text fz-sm c-dimmed" id="lotes-count">5 lotes</span>
          </div>

4. Tabla de lotes:

<div class="Table-wrapper">
            <table class="Table">
              <thead>
                <tr>
                  <th style="width:32px"></th>
                  <th>Nro de lote</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th class="td-center">CUITs</th>
                  <th>Fecha</th>
                  <th style="width:44px"></th>
                </tr>
              </thead>
              <tbody id="lotes-tbody">

                <!-- ── LOTE 622 ── -->
                <tr id="row-lote-622" onclick="toggleLoteRow('622')" style="cursor: pointer;">
                  <td>
                    <!-- Chevron → <ActionIcon variant="subtle" size="sm"> -->
                    <span class="Table-chevron open" id="chev-622">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </span>
                  </td>
                  <td class="fw-700">622</td>
                  <td class="fw-600">ANOVA-622</td>
                  <td class="c-dimmed">Comercio mayorista — variación negativa</td>
                  <td class="td-center">
                    <!-- Badge variant="light" color="blue" → <Badge variant="light" color="blue">47</Badge> -->
                    <span class="Badge variant-light c-blue">47</span>
                  </td>
                  <td class="c-dimmed">12/04/2026</td>
                  <td onclick="event.stopPropagation()">
                    <!--
                      ActionIcon variant="subtle" size="md"
                      → <ActionIcon variant="subtle" color="gray" size="md" onClick={(e) => { e.stopPropagation(); openMenu('622', e); }}>
                    -->
                    <button class="ActionIcon size-md variant-subtle" onclick="toggleLoteMenu('622', this)">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                    <!--
                      Menu shadow="md" width={320}
                      → <Menu shadow="md" width={320}>
                          <Menu.Label>Período a fiscalizar</Menu.Label>
                          + checkboxes tipo cruce
                          <Menu.Item>Confirmar</Menu.Item>
                        </Menu>
                    -->
                    <div class="Dropdown-menu" id="lmenu-622" style="min-width: 320px; top: 346px; left: 739px;">
                      <div class="Dropdown-label">Período a fiscalizar</div>
                      <div style="padding:0 14px 10px;display:flex;gap:8px;align-items:center">
                        <div style="flex:1">
                          <p class="Text fz-xs c-dimmed mb-xs">Desde</p>
                          <select class="Input Select-input" style="padding:7px 28px 7px 10px;font-size:12.5px">
                            <option>2021</option><option>2022</option><option>2023</option><option selected="">2024</option><option>2025</option>
                          </select>
                        </div>
                        <span class="c-dimmed" style="margin-top:14px">→</span>
                        <div style="flex:1">
                          <p class="Text fz-xs c-dimmed mb-xs">Hasta</p>
                          <select class="Input Select-input" style="padding:7px 28px 7px 10px;font-size:12.5px">
                            <option>2021</option><option>2022</option><option>2023</option><option>2024</option><option selected="">2025</option>
                          </select>
                        </div>
                      </div>
                      <div class="Dropdown-divider"></div>
                      <div class="Dropdown-label">Tipo de cruce</div>
                      <div style="padding:0 14px 8px">
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de desvío de BI — Régimen Gral</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" checked="" style="accent-color:var(--m-blue-5)"> Control de desvío de BI — Régimen CM</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de BI declarada por actividad</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de créditos</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de SAF</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de Agentes</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Detección de no inscriptos</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Comparación de Bases Presuntivas</label>
                      </div>
                      <div class="Dropdown-divider"></div>
                      <div style="padding:10px 14px;display:flex;justify-content:flex-end">
                        <button class="Button variant-filled bg-blue-5 size-sm" onclick="document.getElementById('lmenu-622').classList.remove('open');showNotification('success','Cruce confirmado','Cruce agregado al historial.')">
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                <!-- Expand row 622 -->
                <tr class="Table-expand-row open" id="expand-lote-622" style="display: none;">
                  <td colspan="7" class="Table-expand-cell">
                    <div class="Table-expand-inner">
                      <p class="Text fz-xs fw-700 tt-uppercase c-dimmed mb-sm">CUITs en lote ANOVA-622</p>
                      <table class="Table" style="font-size:12px">
                        <thead><tr>
                          <th>#</th><th>CUIT</th><th>Razón Social</th><th>Régimen</th>
                        </tr></thead>
                        <tbody>
                          <tr><td class="c-dimmed">1</td><td style="font-family:monospace">30-70123456-8</td><td>DISTRIBUIDORA NORTE ANDINO S.A.</td><td><span class="Badge variant-light c-blue size-sm">CM</span></td></tr>
                          <tr><td class="c-dimmed">2</td><td style="font-family:monospace">20-28456789-4</td><td>COMERCIAL PUNA NORTE S.R.L.</td><td><span class="Badge variant-light c-blue size-sm">CM</span></td></tr>
                          <tr><td class="c-dimmed">3</td><td style="font-family:monospace">30-61234567-2</td><td>TRANSPORTES QUEBRADA ALTA S.A.</td><td><span class="Badge variant-light c-blue size-sm">CM</span></td></tr>
                        </tbody>
                      </table>
                      <p class="Text fz-xs c-dimmed mt-sm">Mostrando 3 de 47 CUITs · <a class="Anchor">Ver todos</a></p>
                    </div>
                  </td>
                </tr>

                <!-- ── LOTE 589 ── -->
                <tr id="row-lote-589" onclick="toggleLoteRow('589')" style="cursor: pointer;">
                  <td><span class="Table-chevron" id="chev-589"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></span></td>
                  <td class="fw-700">589</td><td class="fw-600">TRUFA-589</td>
                  <td class="c-dimmed">Fiscalización especial — grandes contribuyentes</td>
                  <td class="td-center"><span class="Badge variant-light c-blue">83</span></td>
                  <td class="c-dimmed">28/03/2026</td>
                  <td onclick="event.stopPropagation()">
                    <button class="ActionIcon size-md variant-subtle" onclick="showNotification('info','Próximamente','Panel de cruces disponible pronto.')">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                  </td>
                </tr>
                <tr class="Table-expand-row" id="expand-lote-589" style="display: none;">
                  <td colspan="7" class="Table-expand-cell"><div class="Table-expand-inner"><p class="Text fz-sm c-dimmed">Sin CUITs para mostrar.</p></div></td>
                </tr>

                <!-- ── LOTE 541 ── -->
                <tr id="row-lote-541" onclick="toggleLoteRow('541')" style="cursor: pointer;">
                  <td><span class="Table-chevron open" id="chev-541"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></span></td>
                  <td class="fw-700">541</td><td class="fw-600">GC-2023</td>
                  <td class="c-dimmed">Grandes contribuyentes — base &gt; $50M</td>
                  <td class="td-center"><span class="Badge variant-light c-blue">31</span></td>
                  <td class="c-dimmed">02/03/2026</td>
                  <td onclick="event.stopPropagation()">
                    <button class="ActionIcon size-md variant-subtle" onclick="showNotification('info','Próximamente','Panel de cruces disponible pronto.')">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                  </td>
                </tr>
                <tr class="Table-expand-row open" id="expand-lote-541" style="display: none;">
                  <td colspan="7" class="Table-expand-cell"><div class="Table-expand-inner"><p class="Text fz-sm c-dimmed">Sin CUITs para mostrar.</p></div></td>
                </tr>

                <!-- ── LOTE 498 ── -->
                <tr id="row-lote-498" onclick="toggleLoteRow('498')" style="cursor: pointer;">
                  <td><span class="Table-chevron" id="chev-498"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></span></td>
                  <td class="fw-700">498</td><td class="fw-600">SECTOR-498</td>
                  <td class="c-dimmed">Sector construcción — variación de coeficiente</td>
                  <td class="td-center"><span class="Badge variant-light c-blue">22</span></td>
                  <td class="c-dimmed">14/02/2026</td>
                  <td onclick="event.stopPropagation()">
                    <button class="ActionIcon size-md variant-subtle" onclick="showNotification('info','Próximamente','Panel de cruces disponible pronto.')">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                  </td>
                </tr>
                <tr class="Table-expand-row" id="expand-lote-498" style="display: none;">
                  <td colspan="7" class="Table-expand-cell"><div class="Table-expand-inner"><p class="Text fz-sm c-dimmed">Sin CUITs para mostrar.</p></div></td>
                </tr>

                <!-- ── LOTE 412 ── -->
                <tr id="row-lote-412" onclick="toggleLoteRow('412')" style="cursor: pointer;">
                  <td><span class="Table-chevron" id="chev-412"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></span></td>
                  <td class="fw-700">412</td><td class="fw-600">INMUEBLES-412</td>
                  <td class="c-dimmed">Contribuyentes con más de dos inmuebles</td>
                  <td class="td-center"><span class="Badge variant-light c-blue">58</span></td>
                  <td class="c-dimmed">19/01/2026</td>
                  <td onclick="event.stopPropagation()">
                    <button class="ActionIcon size-md variant-subtle" onclick="showNotification('info','Próximamente','Panel de cruces disponible pronto.')">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                  </td>
                </tr>
                <tr class="Table-expand-row" id="expand-lote-412" style="display: none;">
                  <td colspan="7" class="Table-expand-cell"><div class="Table-expand-inner"><p class="Text fz-sm c-dimmed">Sin CUITs para mostrar.</p></div></td>
                </tr>

              </tbody>
            </table>
          </div>

5. Item de lote:
<tr id="row-lote-622" onclick="toggleLoteRow('622')" style="cursor: pointer;">
                  <td>
                    <!-- Chevron → <ActionIcon variant="subtle" size="sm"> -->
                    <span class="Table-chevron open" id="chev-622">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </span>
                  </td>
                  <td class="fw-700">622</td>
                  <td class="fw-600">ANOVA-622</td>
                  <td class="c-dimmed">Comercio mayorista — variación negativa</td>
                  <td class="td-center">
                    <!-- Badge variant="light" color="blue" → <Badge variant="light" color="blue">47</Badge> -->
                    <span class="Badge variant-light c-blue">47</span>
                  </td>
                  <td class="c-dimmed">12/04/2026</td>
                  <td onclick="event.stopPropagation()">
                    <!--
                      ActionIcon variant="subtle" size="md"
                      → <ActionIcon variant="subtle" color="gray" size="md" onClick={(e) => { e.stopPropagation(); openMenu('622', e); }}>
                    -->
                    <button class="ActionIcon size-md variant-subtle" onclick="toggleLoteMenu('622', this)">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                    <!--
                      Menu shadow="md" width={320}
                      → <Menu shadow="md" width={320}>
                          <Menu.Label>Período a fiscalizar</Menu.Label>
                          + checkboxes tipo cruce
                          <Menu.Item>Confirmar</Menu.Item>
                        </Menu>
                    -->
                    <div class="Dropdown-menu" id="lmenu-622" style="min-width: 320px; top: 346px; left: 739px;">
                      <div class="Dropdown-label">Período a fiscalizar</div>
                      <div style="padding:0 14px 10px;display:flex;gap:8px;align-items:center">
                        <div style="flex:1">
                          <p class="Text fz-xs c-dimmed mb-xs">Desde</p>
                          <select class="Input Select-input" style="padding:7px 28px 7px 10px;font-size:12.5px">
                            <option>2021</option><option>2022</option><option>2023</option><option selected="">2024</option><option>2025</option>
                          </select>
                        </div>
                        <span class="c-dimmed" style="margin-top:14px">→</span>
                        <div style="flex:1">
                          <p class="Text fz-xs c-dimmed mb-xs">Hasta</p>
                          <select class="Input Select-input" style="padding:7px 28px 7px 10px;font-size:12.5px">
                            <option>2021</option><option>2022</option><option>2023</option><option>2024</option><option selected="">2025</option>
                          </select>
                        </div>
                      </div>
                      <div class="Dropdown-divider"></div>
                      <div class="Dropdown-label">Tipo de cruce</div>
                      <div style="padding:0 14px 8px">
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de desvío de BI — Régimen Gral</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" checked="" style="accent-color:var(--m-blue-5)"> Control de desvío de BI — Régimen CM</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de BI declarada por actividad</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de créditos</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de SAF</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Control de Agentes</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Detección de no inscriptos</label>
                        <label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12.5px;color:var(--m-gray-7);cursor:pointer"><input type="checkbox" style="accent-color:var(--m-blue-5)"> Comparación de Bases Presuntivas</label>
                      </div>
                      <div class="Dropdown-divider"></div>
                      <div style="padding:10px 14px;display:flex;justify-content:flex-end">
                        <button class="Button variant-filled bg-blue-5 size-sm" onclick="document.getElementById('lmenu-622').classList.remove('open');showNotification('success','Cruce confirmado','Cruce agregado al historial.')">
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

## Preferences

- Se debe usar en todo momento componentes de Mantine UI, en caso muy puntual que mantine limite el estilo se pueden usar CSS Modules.

## Requisitos

1. Se debe poder buscar por lote.
2. Cada lote debe mostrarse en una lista dentro de una tabla.
3. Se deben poder crear nuevos lotes.

## Funcionalidades

1. Buscador:

- Debe realizar busqueda de lotes, por el momento en local porque esto en el futuro se hara en el backend.
- Debe mostrar la cantidad de lotes disponible al lado de la barra de busqueda.
- Debe mostrar los resultados de la busqueda en la tabla de lotes o en su defecto devolver un fallback de que `no se encontraron resultados`.

2. Creacion de lotes:

- Se debe poder crear lotes en un modal que se abre al hacer click en nuevo lote button.
- Este modal debe incluir varios campos ya que es un formulario. Todavia no implementaremos el modal, lo dejaremos para mas tarde.
- La estructura principal del listado de lotes debe mantenerse como una tabla.
- Cada lote debe renderizarse como una fila principal dentro de esa tabla.
- Cada fila principal debe poder expandirse y contraerse para mostrar una fila de detalle debajo, con comportamiento tipo accordion.
- No debe reemplazarse la tabla por un componente `Accordion` de Mantine como contenedor principal; el comportamiento expandible debe resolverse dentro de la tabla.
- El contenido interno de la fila expandida todavia no esta cerrado del todo, se puede usar mock de momento.

## Casos de uso

1. Al tocar los 3 puntitos del item del lote deberia abrirse un modal a 50px 50px right que permita seleccionar los cruces con check y con 2 inputs date seleccionar la date de periodo para tener un rango de lo que se debe consultar.
2. El usuario deberia poder generar un nuevo lote. (Lo implementaremos mas tarde).
3. El usuario deberia poder seleccionar cruces y rango de fecha.
4. El usuario deberia poder buscar entre los diferentes lotes.
5. El usuario deberia poder desplegar cada item de la lista de lotes.
