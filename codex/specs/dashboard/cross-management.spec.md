## Spec Cross Managenement

- Ref Visual: `codex/assets/design/dashboard/cross-management/cross-management.png`

## Requisitos

1. Los componentes debe siempre usar Mantine UI salvo en el caso de que haya estilos en los que no se pueda usar, ahi en esos casos puntuales usar CSS Modules.
2. Los componentes deben usar compoenentes de Mantine UI, en caso de no tener componente de la libreria disponible para cierta integracion se puede usar `<div>` etiqueta JSX.

## Estructura

1. Seccion de titulo y subtitulo:

- Titulo
- Subtitulo

2. Seccion de buscador:

- Input type text (Buscador) placeholder: `Buscar pro nombre, lote o CUIT...`
- Input type select x2: Titulo Select 1: `Todos los periodos` Titulo Select 2: Todos los dias (Select 1 de mostrar los ultimos 5 años, Select 2 mostrar rango de dias: EJ: Ultimos 7 dias, Ultimos 30 dias, Ultimos 3 meses)

3. Seccion de tabla para mostrar resultados:

- cols: `Nombre del cruce`, `ORIGEN`, `LOTE/CUIT`, `PERIODO`, `CUITS`, `FECHA`

## Funcionalidad

1. Todas las filas de la tabla deben ser clickeables.
2. La opacidad reducida y el estado visual no clickeable de la referencia debe ignorarse porque fue un error de diseño.
3. Al hacer click sobre una fila, el usuario debe navegar a una subruta dinamica de Next correspondiente al cruce seleccionado.
4. Esa subruta dinamica debe representar la preview o detalle del cruce.
5. La pantalla detalle debe construirse a partir de los params recibidos desde la navegación.
6. En la ruta dinamica se realizará luego la request de la información del cruce para renderizar la vista.
7. En esta iteración, el buscador y los filtros deben operar con filtrado local reactivo sobre data mock.
8. El texto de búsqueda, el período y el rango de días deben combinarse entre sí.
9. Cualquier cambio en alguno de esos controles debe actualizar inmediatamente la tabla.
10. Cuando existan contratos, la lógica actual de filtrado local debe ser reemplazada por backend.
11. Si no existen resultados, debe mostrarse el estado vacío:
    `No se encontraron cruces asociados`.

## Diseño UI

- Titulos:
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <div>
            <div style="font-size:18px;font-weight:800;color:var(--gray-9)">Gestión de Cruces</div>
            <div style="font-size:13px;color:var(--gray-5);margin-top:2px">Todos los cruces realizados desde Lotes y Padrón Unificado</div>
          </div>
        </div>
- Buscador:
<div style="display:flex;gap:8px;margin-bottom:16px;align-items:center;flex-wrap:wrap">
          <div class="search-input" style="min-width:280px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar por nombre, lote o CUIT..." oninput="filtrarHistorial(this.value)">
          </div>
          <select onchange="filtrarHistorialPeriodo(this.value)" style="border:1px solid var(--gray-2);border-radius:999px;padding:7px 14px;font-family:'DM Sans',sans-serif;font-size:12.5px;color:var(--gray-7);outline:none;background:white;cursor:pointer">
            <option value="">Todos los períodos</option>
            <option>2025</option><option>2024</option><option>2023</option>
          </select>
          <select onchange="filtrarHistorialDias(this.value)" style="border:1px solid var(--gray-2);border-radius:999px;padding:7px 14px;font-family:'DM Sans',sans-serif;font-size:12.5px;color:var(--gray-7);outline:none;background:white;cursor:pointer">
            <option value="">Todos los días</option>
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 3 meses</option>
          </select>
          <div class="filter-sep"></div>
          <span style="font-size:12px;color:var(--gray-5)" id="historial-count">4 cruces</span>
        </div>
- Tabla:
<div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre del cruce</th>
                <th>Origen</th>
                <th>Lote / CUIT</th>
                <th>Período</th>
                <th>CUITs</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="historial-tbody">
              <!-- FILA 1: clickeable -->
              <tr class="lote-row" style="cursor:pointer" onclick="abrirCruce({id:1,nombre:'Control de desvío de BI — Régimen CM',origen:'Lote',lote:'ANOVA-622',periodo:'2024',cuits:2,fecha:'27/04/2026'})">
                <td style="font-weight:600">Control de desvío de BI — Régimen CM</td>
                <td><span class="badge badge-lote" style="font-size:11px">Lote</span></td>
                <td style="font-family:monospace;font-size:12.5px;font-weight:600">ANOVA-622</td>
                <td style="color:var(--gray-5)">2024</td>
                <td style="text-align:center;font-weight:600">2</td>
                <td style="color:var(--gray-5)">27/04/2026</td>
              </tr>
              <!-- FILA 2: clickeable -->
              <tr class="lote-row" style="cursor:pointer" onclick="abrirCruce({id:2,nombre:'Control de desvío de BI — Régimen CM',origen:'Padrón',lote:'30-50401884-5',periodo:'2024–2025',cuits:1,fecha:'26/04/2026'})">
                <td style="font-weight:600">Control de desvío de BI — Régimen CM</td>
                <td><span style="background:#F3E8FF;color:#7C3AED;font-size:11px;font-weight:600;padding:2px 9px;border-radius:999px">Padrón</span></td>
                <td style="font-family:monospace;font-size:12.5px;font-weight:600">30-50401884-5</td>
                <td style="color:var(--gray-5)">2024–2025</td>
                <td style="text-align:center;font-weight:600">1</td>
                <td style="color:var(--gray-5)">26/04/2026</td>
              </tr>
              <!-- FILA 3: no clickeable -->
              <tr style="opacity:.55">
                <td style="font-weight:600">Control de créditos</td>
                <td><span class="badge badge-lote" style="font-size:11px">Lote</span></td>
                <td style="font-family:monospace;font-size:12.5px;font-weight:600">TRUFA-589</td>
                <td style="color:var(--gray-5)">2023</td>
                <td style="text-align:center;font-weight:600">83</td>
                <td style="color:var(--gray-5)">20/04/2026</td>
              </tr>
              <!-- FILA 4: no clickeable -->
              <tr style="opacity:.55">
                <td style="font-weight:600">Detección de contribuyentes no inscriptos</td>
                <td><span class="badge badge-lote" style="font-size:11px">Lote</span></td>
                <td style="font-family:monospace;font-size:12.5px;font-weight:600">SECTOR-498</td>
                <td style="color:var(--gray-5)">2022</td>
                <td style="text-align:center;font-weight:600">22</td>
                <td style="color:var(--gray-5)">15/04/2026</td>
              </tr>
            </tbody>
          </table>
        </div>
