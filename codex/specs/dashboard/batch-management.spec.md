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
5. El usuario deberia poder desplegar cada item de la lista de lotes

## Update Modal Lotes

## Estructura nuevo modal

- En el nuevo diseño cambio un poco la estructura del modal, revisar la imagen de `codex/assets/design/dashboard/batch-management/newModal.png`

## Diseño UI nuevo modal

<div class="modal" style="width:580px;max-width:95vw">
    <div class="modal-header" style="padding:24px 28px 18px">
      <div>
        <div class="modal-title" style="font-size:20px;font-weight:800">Crear nuevo lote</div>
        <div class="modal-subtitle">Completá los datos y cargá los CUITs a analizar</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="closeModal('modal-nuevo-lote');resetForm()" style="font-size:20px;color:var(--gray-5)">×</button>
    </div>
    <div class="modal-body" style="padding:20px 28px;gap:20px">

      <!-- Nombre + Régimen -->
      <div class="form-row" id="lote-regimen-group">
        <div class="form-group">
          <label class="form-label" style="font-size:14px;font-weight:700;color:var(--gray-9)">Nombre del lote <span style="color:#FA5252">*</span></label>
          <input class="form-input" id="lote-nombre" type="text" placeholder="Ej: ANOVA-623" style="border-radius:10px;padding:12px 16px" oninput="clearFieldError('lote-nombre','err-nombre')">
          <div class="form-error" id="err-nombre"></div>
        </div>
        <div class="form-group" id="lote-regimen-field">
          <label class="form-label" style="font-size:14px;font-weight:700;color:var(--gray-9)">Tipo de contribuyente <span style="color:#FA5252">*</span></label>
          <select class="form-input form-select" id="lote-regimen" style="border-radius:10px;padding:12px 16px" onchange="clearFieldError('lote-regimen','err-regimen')">
            <option value="">Seleccioná tipo de contribuyente</option>
            <option value="cm">Convenio Multilateral</option>
            <option value="local">Local</option>
            <option value="noinscripto">No inscripto</option>
          </select>
          <div class="form-error" id="err-regimen"></div>
        </div>
      </div>

      <!-- Tipo de contribuyente (informativo, solo desde Explorar Padrón) -->
      <div id="lote-tipo-info" style="display:none;margin-bottom:4px">
        <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:6px">Tipo de contribuyente</div>
        <div id="lote-tipo-badge" style="display:inline-flex;align-items:center;gap:6px;background:var(--blue-1);border:1px solid #BFDBFE;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;color:var(--blue-5)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span id="lote-tipo-texto">Convenio Multilateral</span>
        </div>
        <div style="font-size:11.5px;color:var(--gray-5);margin-top:6px">Definido por los filtros de Explorar Padrón. No editable.</div>
      </div>

      <!-- Nombre solo (cuando viene desde Explorar Padrón) -->
      <div class="form-group" id="lote-nombre-solo" style="display:none">
        <label class="form-label" style="font-size:14px;font-weight:700;color:var(--gray-9)">Nombre del lote <span style="color:#FA5252">*</span></label>
        <input class="form-input" id="lote-nombre-solo-input" type="text" placeholder="Ej: ANOVA-623" style="border-radius:10px;padding:12px 16px">
        <div class="form-error" id="err-nombre-solo"></div>
      </div>

      <!-- Descripción -->
      <div class="form-group">
        <label class="form-label" style="font-size:14px;font-weight:700;color:var(--gray-9)">Descripción del lote</label>
        <input class="form-input" id="lote-desc" type="text" placeholder="Ej: Comercio mayorista con variación negativa 2024" style="border-radius:10px;padding:12px 16px">
      </div>

      <!-- CUITs -->
      <div class="form-group">
        <label class="form-label" style="font-size:14px;font-weight:700;color:var(--gray-9)">CUITs a analizar <span style="color:#FA5252">*</span></label>

        <!-- Barra de acciones -->
        <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
          <div style="flex:1;display:flex;align-items:center;gap:8px;background:var(--gray-0);border:1px solid var(--gray-2);border-radius:8px;padding:7px 12px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input id="cuit-buscar" type="text" placeholder="Buscar por CUIT o razón social..." oninput="cuitTablaFiltrar(this.value)" style="border:none;outline:none;font-size:13px;background:transparent;font-family:'DM Sans',sans-serif;flex:1">
          </div>
          <div id="lote-importar-btn">
            <button class="btn btn-outline btn-sm" onclick="simularImportExcel()" style="border-radius:8px;font-weight:600;gap:6px;white-space:nowrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Importar Excel
            </button>
          </div>
          <button onclick="toggleInputCuit()" id="btn-cargar-cuit" style="display: flex; align-items: center; gap: 6px; background: var(--gray-0); border-color: var(--gray-2); border-top-style: ; border-top-width: ; border-right-style: ; border-right-width: ; border-bottom-style: ; border-bottom-width: ; border-left-style: ; border-left-width: ; border-image-source: ; border-image-slice: ; border-image-width: ; border-image-outset: ; border-image-repeat: ; border-radius: 8px; padding: 7px 14px; font-family: &quot;DM Sans&quot;, sans-serif; font-size: 13px; font-weight: 600; color: var(--gray-7); cursor: pointer; white-space: nowrap;" onmouseover="this.style.background='var(--blue-1)';this.style.borderColor='var(--blue-5)';this.style.color='var(--blue-5)'" onmouseout="this.style.background='var(--gray-0)';this.style.borderColor='var(--gray-2)';this.style.color='var(--gray-7)'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Cargar CUIT
          </button>
        </div>

        <!-- Input para agregar CUITs -->
        <div id="input-cuit-container" style="display:none;margin-bottom:10px">
          <input id="cuit-input" type="text" placeholder="Escribí o pegá un CUIT..." style="width:100%;border:1px solid var(--blue-5);border-radius:8px;padding:9px 14px;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;box-shadow:0 0 0 3px rgba(67,117,238,.1);box-sizing:border-box" onkeydown="handleCuitInput(event)" onpaste="handleCuitPaste(event)">
        </div>

        <!-- Tabla de CUITs -->
        <div style="border:1px solid var(--gray-2);border-radius:10px;overflow:hidden;max-height:280px;overflow-y:auto" id="cuit-tabla-container">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead style="background:var(--gray-0);position:sticky;top:0;z-index:1">
              <tr>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);width:36px">#</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2)">CUIT</th>
                <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2)">RAZÓN SOCIAL</th>
                <th style="padding:8px 12px;width:40px;border-bottom:1px solid var(--gray-2)"></th>
              </tr>
            </thead>
            <tbody id="cuit-tabla-tbody"><tr><td colspan="4" style="padding:24px;text-align:center;color:var(--gray-5);font-size:13px;font-style:italic">Agregá CUITs usando el campo de arriba o importando un Excel.</td></tr></tbody>
          </table>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
          <div class="form-error" id="err-cuits"></div>
          <div style="font-size:12px;color:var(--gray-5)" id="cuit-contador">0 CUITs cargados</div>
        </div>
      </div>

    </div>
    <div class="modal-footer" style="padding:16px 28px 24px;gap:10px">
      <button class="btn btn-outline" onclick="closeModal('modal-nuevo-lote');resetForm()" style="border-radius:999px;padding:10px 24px;font-size:14px">Cancelar</button>
      <button class="btn btn-primary" id="btn-cargar-lote" onclick="validarYCrearLote()" style="border-radius:999px;padding:10px 28px;font-size:14px;font-weight:700">
        Cargar lote
      </button>
    </div>

  </div>

---

## Update Menu Cruces

- Ref visual: `codex/assets/design/dashboard/batch-management/crossing-modal.png`

## Casos de uso

- Primer cambio grande debe poder el usuario seleccionar entre mensual o anual el periodo.
- En los mensuales solo deben mostrarse los cruces permitidos mensuales como en la referencia de imagen, en los anuales solo los anuales esto deben ser items desplegables que permitan seleccionar dependiendo en caso cada formulario si el mensual o el anual.

## Funcionalidades

- Se debe poder seleccionar mensual o anual y deberia mostrarse los cruces en un item desplegable que conlleva cada uno segun el que despleguemos.
- Al abrir el menu de cruces del lote, las secciones `Mensual` y `Anual` deben arrancar cerradas por defecto.
- El usuario debe poder desplegar `Mensual`, `Anual` o ambas secciones al mismo tiempo.
- El anual debe mostrar los cruces:

Control de desvío de BI — Régimen CM
Control de BI declarada por actividad
Detección de no inscriptos
Comparación de Bases Presuntivas
Contribuyentes con más de dos inmuebles

- El mensual debe mostrar los siguientes cruces:

Control de desvío de BI — Régimen Gral
Control de créditos
Control de SAF
Control de Agentes

- El cruce mensual debe poder seleccionar mes y año en rango
- El cruce de anual debe poder seleccionar solo años permitiendo poder acceder a registros con un limite de 5 años para atras solamente. Ese seria el max limit que podes acceder del pasado y del futuro seria como limite el ultimo año osea el actual.
- Al desplegar por primera vez la seccion `Mensual`, los valores por defecto deben ser:
  - `Desde`: mes actual + año actual
  - `Hasta`: mes actual + año actual
- Al desplegar por primera vez la seccion `Anual`, los valores por defecto deben ser:
  - `Desde`: año actual
  - `Hasta`: año actual
- `Mensual` y `Anual` deben mantener estados independientes entre si.
- Ambos bloques deben compartir una estructura uniforme de datos. `Mensual` agrega mes dentro de ese mismo shape general, pero no debe romper la forma del objeto.
- No se deben ofrecer opciones fuera del rango permitido de 5 años hacia atras ni opciones futuras por encima del año actual.
- Si el usuario especifica un rango invalido donde `Desde` sea mayor que `Hasta`, se debe mostrar el mensaje:
  - `Debes especificar un rango válido para realizar el cruce`
- `Confirmar` debe permanecer bloqueado hasta que exista al menos un cruce seleccionado en el estado de `Mensual`, `Anual` o ambos.
- En esta iteracion, `Confirmar` debe:
  - enviar al usuario a `Gestión de Cruces`
- La consulta real al backend a partir de la configuracion de cruces no se implementa en esta branch. Esa integracion se hara cuando esta branch se mergee con la branch de `Gestión de Cruces` en `develop`.
- `Mensual` y `Anual` pueden configurarse al mismo tiempo. La resolucion operativa de ambos conjuntos de datos se implementara luego desde `Gestión de Cruces` con contratos reales.
- La distincion entre cruces mensuales y anuales sera devuelta luego por backend a traves de contratos para reflejarse en el flujo correspondiente.

## Diseño y UI

<div class="dropdown-menu open" id="menu-622" style="min-width: 420px; max-height: 80vh; overflow-y: auto; padding: 0px; position: fixed; top: 209px; left: 848px; width: 420px; z-index: 9999;">

                    <!-- ── CRUCES MENSUALES ── -->
                    <div style="border-bottom:1px solid var(--gray-1)">
                      <div onclick="toggleSeccionCruces('lote-622-mensual')" style="display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; cursor: pointer; background: var(--gray-0);" onmouseover="this.style.background='#EFF6FF'" onmouseout="this.style.background='var(--gray-0)'">
                        <div style="display:flex;align-items:center;gap:8px">
                          <span style="background:#DBEAFE;color:#2563EB;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">MENSUAL</span>
                          <span style="font-size:12.5px;font-weight:700;color:var(--gray-7)">Cruces mensuales</span>
                        </div>
                        <svg id="chevron-lote-622-mensual" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gray-5)" stroke-width="2" style="transition: transform 0.2s; transform: rotate(90deg);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </div>
                      <div id="seccion-lote-622-mensual" style="padding: 10px 16px; display: block;">
                        <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:10px 12px;margin-bottom:8px">
                          <div style="font-size:10px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Período</div>
                          <div style="display:flex;align-items:center;gap:6px">
                            <div style="flex:1">
                              <div style="font-size:10px;color:#2563EB;margin-bottom:3px">Desde</div>
                              <div style="display:flex;gap:3px">
                                <select style="flex:1;border:1px solid #BFDBFE;border-radius:6px;padding:5px 6px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--gray-9);outline:none;background:white"><option>Ene</option><option>Feb</option><option>Mar</option><option>Abr</option><option>May</option><option>Jun</option><option selected="">Jul</option><option>Ago</option><option>Sep</option><option>Oct</option><option>Nov</option><option>Dic</option></select>
                                <select style="width:60px;border:1px solid #BFDBFE;border-radius:6px;padding:5px 6px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--gray-9);outline:none;background:white"><option>2022</option><option>2023</option><option selected="">2024</option><option>2025</option></select>
                              </div>
                            </div>
                            <div style="color:var(--gray-4);margin-top:12px">→</div>
                            <div style="flex:1">
                              <div style="font-size:10px;color:#2563EB;margin-bottom:3px">Hasta</div>
                              <div style="display:flex;gap:3px">
                                <select style="flex:1;border:1px solid #BFDBFE;border-radius:6px;padding:5px 6px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--gray-9);outline:none;background:white"><option>Ene</option><option>Feb</option><option>Mar</option><option>Abr</option><option>May</option><option>Jun</option><option>Jul</option><option>Ago</option><option>Sep</option><option>Oct</option><option>Nov</option><option selected="">Dic</option></select>
                                <select style="width:60px;border:1px solid #BFDBFE;border-radius:6px;padding:5px 6px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--gray-9);outline:none;background:white"><option>2022</option><option>2023</option><option>2024</option><option selected="">2025</option></select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px"> Control de desvío de BI — Régimen Gral</label>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px"> Control de créditos</label>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" checked=""> Control de SAF</label>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px"> Control de Agentes</label>
                      </div>
                    </div>

                    <!-- ── CRUCES ANUALES ── -->
                    <div style="border-bottom:1px solid var(--gray-1)">
                      <div onclick="toggleSeccionCruces('lote-622-anual')" style="display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; cursor: pointer; background: var(--gray-0);" onmouseover="this.style.background='#F0FDF4'" onmouseout="this.style.background='var(--gray-0)'">
                        <div style="display:flex;align-items:center;gap:8px">
                          <span style="background:#D1FAE5;color:#059669;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">ANUAL</span>
                          <span style="font-size:12.5px;font-weight:700;color:var(--gray-7)">Cruces anuales</span>
                        </div>
                        <svg id="chevron-lote-622-anual" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gray-5)" stroke-width="2" style="transition: transform 0.2s; transform: rotate(90deg);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </div>
                      <div id="seccion-lote-622-anual" style="padding: 10px 16px; display: block;">
                        <div style="background:#F0FDF4;border:1px solid #A7F3D0;border-radius:10px;padding:10px 12px;margin-bottom:8px">
                          <div style="font-size:10px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Período</div>
                          <div style="display:flex;align-items:center;gap:6px">
                            <div style="flex:1">
                              <div style="font-size:10px;color:#059669;margin-bottom:3px">Desde</div>
                              <select style="width:100%;border:1px solid #A7F3D0;border-radius:6px;padding:5px 8px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--gray-9);outline:none;background:white"><option>2020</option><option>2021</option><option>2022</option><option selected="">2023</option><option>2024</option><option>2025</option></select>
                            </div>
                            <div style="color:var(--gray-4);margin-top:12px">→</div>
                            <div style="flex:1">
                              <div style="font-size:10px;color:#059669;margin-bottom:3px">Hasta</div>
                              <select style="width:100%;border:1px solid #A7F3D0;border-radius:6px;padding:5px 8px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--gray-9);outline:none;background:white"><option>2020</option><option>2021</option><option>2022</option><option>2023</option><option>2024</option><option selected="">2025</option></select>
                            </div>
                          </div>
                        </div>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px" checked=""> Control de desvío de BI — Régimen CM</label>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px"> Control de BI declarada por actividad</label>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px"> Detección de no inscriptos</label>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px"> Comparación de Bases Presuntivas</label>
                        <label class="cruce-check-row" onmouseover="this.style.background='var(--blue-1)'" onmouseout="this.style.background=''" style=""><input type="checkbox" style="accent-color:var(--blue-5);width:13px;height:13px"> Contribuyentes con más de dos inmuebles</label>
                      </div>
                    </div>

                    <div style="padding:10px 16px;display:flex;justify-content:flex-end">
                      <button class="btn btn-primary btn-sm" onclick="confirmarCruceLote('622',this)">Confirmar</button>
                    </div>
                  </div>
