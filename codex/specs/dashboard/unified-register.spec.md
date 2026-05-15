## Spec Unified Register

- Ref Visual: `codex/assets/design/dashboard/unified-register/unified-register.png`

## Estructura

- Buscador:
  input text placeholder: `Buscar por CUIT o razón social...`
- Item-Card:
  nro cuit
  title
  actividad - Regimen - Estado
- Badge: Nivel de riesgo
- Icon: 3 puntos menu de opciones

## Funcionalidad

1. Al hacer click en una card de `Padrón Unificado`, el usuario debe navegar a una subruta dinámica de detalle del CUIT.
2. La subruta dinámica de detalle debe seguir el naming `vista-previa-padron` y recibir el `cuit` como parámetro.
3. En esta iteración, la pantalla de detalle aún no tiene diseño final cerrado, pero la navegación y la estructura de ruta sí forman parte del alcance.
4. En esta iteración, el buscador debe operar con filtrado local reactivo sobre data mock.
5. El buscador debe filtrar únicamente por `CUIT` o `razón social`.
6. Las acciones del menú de 3 puntos deben renderizarse en la UI, pero por ahora no deben ejecutar ninguna acción funcional.
7. Si la búsqueda no devuelve resultados, debe mostrarse el estado vacío:
   `No se encontraron resultados para ese CUIT o razón social`

## Diseño UI

- Buscador:
<div style="display:flex;gap:8px;margin-bottom:20px;align-items:center">
          <div class="search-input" style="flex:1;max-width:560px;border-radius:10px;padding:10px 16px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar por CUIT o razón social..." style="font-size:14px">
          </div>
        </div>

- Contenedor de cards:
<div> display:flex;flex-direction:column;gap:12px

- Card Item busqueda:

<div onclick="abrirDetallePadron()" style="background: white; border-color: var(--gray-2); border-top-style: ; border-top-width: ; border-right-style: ; border-right-width: ; border-bottom-style: ; border-bottom-width: ; border-left-style: ; border-left-width: ; border-image-source: ; border-image-slice: ; border-image-width: ; border-image-outset: ; border-image-repeat: ; border-radius: 14px; padding: 18px 22px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: rgba(0, 0, 0, 0.04) 0px 2px 8px; transition: box-shadow 0.15s, border-color 0.15s;" onmouseover="this.style.boxShadow='0 4px 16px rgba(67,117,238,.12)';this.style.borderColor='#BFDBFE'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='var(--gray-2)'">
            <div style="flex:1;min-width:0">
              <div style="font-size:10.5px;color:var(--gray-5);font-family:monospace;margin-bottom:4px">30-50401884-5</div>
              <div style="font-size:16px;font-weight:800;color:var(--gray-9);margin-bottom:6px">VOLKSWAGEN ARGENTINA S.A.</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12.5px;color:var(--gray-5)">
                <span><strong style="color:var(--gray-7)">Actividad:</strong> Fabricación de vehículos automotores</span>
                <span><strong style="color:var(--gray-7)">Régimen:</strong> Convenio Multilateral</span>
                <span><strong style="color:var(--gray-7)">Estado:</strong> Activo</span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-shrink:0">
              <span style="background:#FEF2F2;color:#DC2626;font-size:12px;font-weight:700;padding:4px 14px;border-radius:999px">Riesgo A</span>
              <div onclick="event.stopPropagation()" style="position:relative">
                <button onclick="toggleMenuCuit(this)" style="width:32px;height:32px;border:1px solid var(--gray-2);background:white;cursor:pointer;border-radius:8px;color:var(--gray-5);font-size:18px;display:flex;align-items:center;justify-content:center;font-weight:700">⋯</button>
                <div class="cuit-menu" style="display: block; position: absolute; right: 0px; top: 36px; background: white; border: 1px solid var(--gray-2); border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px; z-index: 99; min-width: 190px; overflow: hidden;">
                  <div onclick="abrirDetallePadron()" style="padding: 10px 14px; font-size: 13px; cursor: pointer; color: var(--gray-9);" onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''">🔍 Ver análisis completo</div>
                  <div onclick="showToast('✅ CUIT agregado a lote','success')" style="padding: 10px 14px; font-size: 13px; cursor: pointer; color: var(--gray-9);" onmouseover="this.style.background='var(--gray-0)'" onmouseout="this.style.background=''">➕ Agregar a lote</div>
                  <div onclick="toggleReprocesoPadron()" style="padding: 10px 14px; font-size: 13px; cursor: pointer; color: rgb(220, 38, 38);" onmouseover="this.style.background='#FFF5F5'" onmouseout="this.style.background=''">🔴 Marcar reproceso</div>
                </div>
              </div>
            </div>
          </div>

- Nota de implementación:
  - El menú de acciones se muestra abierto en el HTML solo como referencia visual.
  - En la implementación real debe abrir y cerrar con interacción normal.
