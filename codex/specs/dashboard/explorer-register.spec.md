## Spec Explorer register

- Ref Visual: `codex/assets/design/dashboard/explorer-register/explorer-register.design.png`
- Ref Visual busqueda `codex/assets/design/dashboard/explorer-register/search-explorer-register.png`

## Requisitos

- Se debe usar siempre para estilar Mantine UI, lo mismo a la hora de estructurar debe realizarse con los componentes mas acordes de la libreria segun cada caso.
- En caso de no poder utilizar un estilo o componente se puede usar JSX y CSS Modules pero ningun otro.
- Se debe seguir al pie de la letra la arqui de la skill.
- Se debe tener en cuenta para cada color la paleta de colores actual y la fuente.
- Por ahora usaremos data mock creada por nosotros hasta que esten listos los contratos del backend.

- Debemos crear el modulo de Explorar Padron. Para esto deberiamos agregar primero el item respectivo al sidebar,
  luego proceder a maquetar la pantalla y montar para ya dejar listo el routing.

## Modificaciones Sidebar

1. Se debe crear un item nuevo del sidebar que permita acceder por Next Link a el modulo Explorar Padron que tambien vamos a desarrollar en esta spec.

- Estructura del sidebar:

Item nuevo : `Explorar Padrón`

2. Este item nuevo debe estar creado justo abajo del primero es decir debe listarse como segundo elemento del sidebar, por ende debe estar en la seccion de `analisis`, manteniendo los estilos que ya poseen los otros items del sidebar. Tambien se debe reflejar la ruta como en el resto de los modulos en el navbar.

## Estructura del modulo Explorar Padron

1. El modulo de `Explorar Padron` debe tener 3 secciones.

- Seccion Pills
- Seccion Filtros
- Seccion Tabla resultados

2. Se detallara la siguiente estructura para tener en cuenta las secciones mejor descriptas.
   SectionContainer <div>

- Seccion pills

  title: <Text> `COLUMNAS Y FILTROS DISPONIBLES`
  Items: `Rubro`, `Actividad`, `Tipo Contribuyente`, `Domicilio`, `Localidad`, `Provincia`, `Matriz de riesgo`, `Sistema de Control`,
  `Mercurio (Ruta)`, `Trufa (Operativos)`, `Agente`, `Sujeto Retenido`, `Convenio Jurisdiccion`

- Seccion filtros

Container: flex column

 <div>

title: <Text> `CONFIGURAR FILTROS`
button: `Limpiar filtros`
button: <SearchIcon> `Buscar`

<div/>

 <div> flex

label: <Text> `Rubro`
input select: `Todas las opciones`
options: `Gastronomia`, `Textil`, `Automotor`, `Construccion`, `Tecnologia`

label: <Text> `Actividad`
input select: `Todas las opciones`

<div/>

- Seccion Tabla resultados (Example)

Cols: `CUIT`, `Nombre / Razón Social`, `Rubro`, `Actividad`
Rows: <IconCross> `30-50401884-5`, `VOLKSWAGEN ARGENTINA S.A.`, `Automotor`, `Fabricación de vehículos`

## Funcionalidades y casos de uso

- Este modulo busca y filtra cuits de contribuyentes y permite crear un lote nuevo de la seccion gestion de lotes sin entrar en ella. Se debe poder crear un lote asumiendo que los elementos encontrados en la busqueda con filtros + lo que el usuario deseleccione con la X Icon, son los elementos seleccionados para crear el nuevo lote.

- Debemos crear para este modulo un <Button> a nivel navbar `Crear lote con 7 resultados`.

- Seccion de pills:

Lo que seleccionemos en esta seccion es lo que se va a mostrar de filtros, por lo que se debe hacer un renderizado condicional de cada filtro dependiendo la pill seleccionada.

- Seccion de filtros:

En esta seccion se podran seleccionar los inputs select, se deben poder limpiar los filtros, y al pinchar en el boton de buscar deberia mostrar los resultados en la tabla de resultados

- Seccion tabla de resultados:

1. Esta seccion es la mas simple, los resultados de los filtros deben mostrarse en la tabla, la tabla debe renderizar columnas condicionalmente y mostrar cada item en la columna respectiva.
   Si se deselecciona una pill, no debe renderizarse la columna respectiva

2. Si se presiona el boton `Limpiar filtros`, deberia restablecerse el estado inicial sin opciones de columnas/filtros seleccionadas y deberia borrarse el estado de la tabla osea que no encuentre nada ya que se borra la busqueda como si hicieras un reset.

3. En caso que no haya busqueda ni filtro aplicado deberia haber un fallback en la tabla `Seleccioná columnas/filtros arriba y presioná Buscar para poblar el cuadro.`

4. En caso de que no se encuentren resultados `No se encontro coincidencias para la busqueda realizada`

5. En caso de encontrar los resultados se consideraran todos como seleccionados con su respectivo estado para poder tener una lista de cuits para crear lote con los resultados con el button del navbar de esta seccion. En caso que se borre un resultado solo debe limitarse a modificar el estado de los seleccionados y obviamente ya no mostrar la row, como aplicando un Filter js method al item en cuestion.

## UI y diseño

<div class="page">

    <!-- PILLS: columnas/filtros disponibles -->
    <div style="margin-bottom:16px">
      <div style="font-size:10px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px">Columnas y filtros disponibles</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px" id="ep-pills">
        <button class="ep-pill" data-col="rubro" onclick="epTogglePill(this)">Rubro</button>
        <button class="ep-pill" data-col="actividad" onclick="epTogglePill(this)">Actividad</button>
        <button class="ep-pill" data-col="tipo" onclick="epTogglePill(this)">Tipo Contribuyente</button>
        <button class="ep-pill" data-col="domicilio" onclick="epTogglePill(this)">Domicilio</button>
        <button class="ep-pill" data-col="localidad" onclick="epTogglePill(this)">Localidad</button>
        <button class="ep-pill" data-col="provincia" onclick="epTogglePill(this)">Provincia</button>
        <button class="ep-pill" data-col="riesgo" onclick="epTogglePill(this)">Matriz de Riesgo</button>
        <button class="ep-pill" data-col="control" onclick="epTogglePill(this)">Sistema de Control</button>
        <button class="ep-pill" data-col="mercurio" onclick="epTogglePill(this)">Mercurio (Ruta)</button>
        <button class="ep-pill" data-col="trufa" onclick="epTogglePill(this)">Trufa (Operativos)</button>
        <button class="ep-pill" data-col="agente" onclick="epTogglePill(this)">Agente</button>
        <button class="ep-pill" data-col="retenido" onclick="epTogglePill(this)">Sujeto Retenido</button>
        <button class="ep-pill" data-col="convenio" onclick="epTogglePill(this)">Convenio Jurisdicción</button>
      </div>
    </div>

    <!-- CONFIGURAR FILTROS -->
    <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;padding:18px 20px;margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.07em">Configurar filtros</div>
        <div style="display:flex;gap:8px">
          <button onclick="epLimpiar()" style="background:white;border:1px solid var(--gray-2);border-radius:999px;padding:7px 16px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--gray-7);cursor:pointer">Limpiar filtros</button>
          <button onclick="epBuscar()" style="background:var(--blue-5);color:white;border:none;border-radius:999px;padding:7px 18px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Buscar
          </button>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end" id="ep-filtros-activos">
        <!-- filtros dinámicos según pills activos -->
        <div id="ep-filtro-rubro" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Rubro</div>
          <select class="ep-select" onchange="epActualizarActividades(this.value)" style="min-width:160px">
            <option value="">Todas las opciones</option>
            <option value="gastronomia">Gastronomia</option>
            <option value="textil">Textil</option>
            <option value="automotor">Automotor</option>
            <option value="construccion">Construccion</option>
            <option value="tecnologia">Tecnologia</option>
          </select>
        </div>
        <div id="ep-filtro-actividad" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Actividad</div>
          <select class="ep-select" id="ep-sel-actividad" style="min-width:200px"><option value="">Todas las opciones</option></select>
        </div>
        <div id="ep-filtro-tipo" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Tipo Contribuyente</div>
          <select class="ep-select" style="min-width:160px">
            <option value="">Todas las opciones</option>
            <option>Local</option>
            <option>Convenio</option>
          </select>
        </div>
        <div id="ep-filtro-domicilio" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Domicilio</div>
          <select class="ep-select" style="min-width:200px">
            <option value="">Todas las opciones</option>
            <option>San Salvador de Jujuy</option>
            <option>Palpalá</option>
            <option>Humahuaca</option>
            <option>Tilcara</option>
            <option>La Quiaca</option>
          </select>
        </div>
        <div id="ep-filtro-localidad" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Localidad</div>
          <select class="ep-select" style="min-width:160px">
            <option value="">Todas las opciones</option>
            <option>Capital</option><option>Palpalá</option><option>Humahuaca</option><option>Tilcara</option>
          </select>
        </div>
        <div id="ep-filtro-provincia" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Provincia</div>
          <select class="ep-select" style="min-width:140px">
            <option value="">Todas las opciones</option>
            <option>Jujuy</option><option>Salta</option><option>Buenos Aires</option>
          </select>
        </div>
        <div id="ep-filtro-riesgo" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Matriz de Riesgo</div>
          <select class="ep-select" style="min-width:140px">
            <option value="">Todas las opciones</option>
            <option>Alto</option><option>Medio</option><option>Bajo</option>
          </select>
        </div>
        <div id="ep-filtro-control" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Sistema de Control</div>
          <select class="ep-select" style="min-width:160px">
            <option value="">Todas las opciones</option>
            <option>Activo</option><option>Inactivo</option>
          </select>
        </div>
        <div id="ep-filtro-mercurio" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Mercurio (Ruta)</div>
          <select class="ep-select" style="min-width:140px">
            <option value="">Todas las opciones</option>
            <option>Ruta 9</option><option>Ruta 34</option><option>Ruta 52</option>
          </select>
        </div>
        <div id="ep-filtro-trufa" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Trufa (Operativos)</div>
          <select class="ep-select" style="min-width:160px">
            <option value="">Todas las opciones</option>
            <option>Operativo 2024</option><option>Operativo 2025</option>
          </select>
        </div>
        <div id="ep-filtro-agente" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Agente</div>
          <select class="ep-select" style="min-width:160px">
            <option value="">Todas las opciones</option>
            <option>Percepción</option><option>Retención</option>
          </select>
        </div>
        <div id="ep-filtro-retenido" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Sujeto Retenido</div>
          <select class="ep-select" style="min-width:140px">
            <option value="">Todas las opciones</option>
            <option>Sí</option><option>No</option>
          </select>
        </div>
        <div id="ep-filtro-convenio" class="ep-filtro-group" style="display:none">
          <div style="font-size:12px;color:var(--gray-7);margin-bottom:5px;font-weight:500">Convenio Jurisdicción</div>
          <select class="ep-select" style="min-width:160px">
            <option value="">Todas las opciones</option>
            <option>Jujuy (J.910)</option><option>Buenos Aires</option>
          </select>
        </div>
      </div>
    </div>

    <!-- TABLA RESULTADOS -->
    <div style="background:white;border:1px solid var(--gray-2);border-radius:12px;overflow:hidden">
      <table id="ep-tabla" style="width:100%;border-collapse:collapse">
        <thead id="ep-thead" style="background:var(--gray-0)">
          <tr id="ep-thead-row">
            <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;width:40px"></th>
            <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap">CUIT</th>
            <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap">Nombre / Razón Social</th>
            <th id="ep-th-rubro" style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: var(--gray-5); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--gray-2); white-space: nowrap;">Rubro</th>
            <th id="ep-th-actividad" style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: var(--gray-5); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--gray-2); white-space: nowrap;">Actividad</th>
            <th id="ep-th-tipo" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Tipo Contribuyente</th>
            <th id="ep-th-domicilio" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Domicilio</th>
            <th id="ep-th-localidad" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Localidad</th>
            <th id="ep-th-provincia" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Provincia</th>
            <th id="ep-th-riesgo" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Matriz de Riesgo</th>
            <th id="ep-th-control" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Sistema de Control</th>
            <th id="ep-th-mercurio" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Mercurio (Ruta)</th>
            <th id="ep-th-trufa" style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: var(--gray-5); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--gray-2); white-space: nowrap;">Trufa (Operativos)</th>
            <th id="ep-th-agente" style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: var(--gray-5); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--gray-2); white-space: nowrap;">Agente</th>
            <th id="ep-th-retenido" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Sujeto Retenido</th>
            <th id="ep-th-convenio" style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--gray-5);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-2);white-space:nowrap;display:none">Convenio Jurisdicción</th>
          </tr>
        </thead>
        <tbody id="ep-tbody"><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''" style="">
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);text-align:center">
        <button onclick="epToggleRow(this,'30-50401884-5')" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;display:flex;align-items:center;justify-content:center" title="Quitar de selección">✕</button>
      </td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-family:monospace;color:var(--blue-5);font-weight:600;font-size:13px">30-50401884-5</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-weight:600;font-size:13px">VOLKSWAGEN ARGENTINA S.A.</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Automotor</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Fabricación de vehículos</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Operativo 2024</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Retención</td>
    </tr><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''">
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);text-align:center">
        <button onclick="epToggleRow(this,'30-50168521-2')" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;display:flex;align-items:center;justify-content:center" title="Quitar de selección">✕</button>
      </td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-family:monospace;color:var(--blue-5);font-weight:600;font-size:13px">30-50168521-2</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-weight:600;font-size:13px">CERÁMICA DEL NORTE S.A.</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Construccion</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Obra civil</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">—</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Percepción</td>
    </tr><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''">
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);text-align:center">
        <button onclick="epToggleRow(this,'27-32178654-3')" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;display:flex;align-items:center;justify-content:center" title="Quitar de selección">✕</button>
      </td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-family:monospace;color:var(--blue-5);font-weight:600;font-size:13px">27-32178654-3</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-weight:600;font-size:13px">MINERA ALTIPLANO JUJUY S.A.</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Construccion</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Instalaciones eléctricas</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Operativo 2025</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Retención</td>
    </tr><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''">
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);text-align:center">
        <button onclick="epToggleRow(this,'30-19876543-2')" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;display:flex;align-items:center;justify-content:center" title="Quitar de selección">✕</button>
      </td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-family:monospace;color:var(--blue-5);font-weight:600;font-size:13px">30-19876543-2</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-weight:600;font-size:13px">CONSTRUCTORA TILCARA HNOS. S.A.</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Construccion</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Arquitectura</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">—</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">—</td>
    </tr><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''">
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);text-align:center">
        <button onclick="epToggleRow(this,'20-71234567-8')" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;display:flex;align-items:center;justify-content:center" title="Quitar de selección">✕</button>
      </td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-family:monospace;color:var(--blue-5);font-weight:600;font-size:13px">20-71234567-8</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-weight:600;font-size:13px">FARMACÉUTICA VALLES S.A.</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Tecnologia</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Telecomunicaciones</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">—</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">—</td>
    </tr><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''">
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);text-align:center">
        <button onclick="epToggleRow(this,'27-45678901-3')" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;display:flex;align-items:center;justify-content:center" title="Quitar de selección">✕</button>
      </td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-family:monospace;color:var(--blue-5);font-weight:600;font-size:13px">27-45678901-3</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-weight:600;font-size:13px">TECH JUJUY S.A.</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Tecnologia</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Desarrollo de software</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">—</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Percepción</td>
    </tr><tr onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''">
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);text-align:center">
        <button onclick="epToggleRow(this,'30-61234567-2')" style="width:20px;height:20px;border:none;background:transparent;cursor:pointer;color:#DC2626;font-size:16px;display:flex;align-items:center;justify-content:center" title="Quitar de selección">✕</button>
      </td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-family:monospace;color:var(--blue-5);font-weight:600;font-size:13px">30-61234567-2</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-weight:600;font-size:13px">TEXTIL SAN SALVADOR S.R.L.</td>
      <td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Textil</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">Fabricacion de prendas de vestir</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">—</td><td style="padding:11px 14px;border-bottom:1px solid var(--gray-1);font-size:13px">—</td>
    </tr></tbody>
      </table>
    </div>

  </div>
