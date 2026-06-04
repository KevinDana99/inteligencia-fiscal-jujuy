## Spec Cross Filter Modal

- Referencias Visuales: `codex/assets/design/dashboard/cross-management/cross-filter-modal.png`

## Requisitos

1. Usar siempre Mantine UI para componentes. Si una pieza no se resuelve con Mantine, complementar con JSX y CSS Modules.
2. Usar siempre Mantine UI para estilos. Si una pieza no se resuelve con props de Mantine, complementar con CSS Modules.
3. Para iconos mapeados usar `globals/icons` si ya existe el mapeo. Si no existe, usar Tabler Icons como libreria base.

## Alcance

1. Este modal se usa para filtros numéricos por columna dentro de la tabla `Análisis sistémico por CUIT`.
2. En esta iteración, el modal se abre solo desde el icono/flecha de estas columnas:
   - `B.I. 910 ▾`
   - `B.I. PRETENDIDA ▾`
   - `DIFERENCIA ▾`
   - `IMPUESTO ESTIMADO ▾`
   - `NETO A PAGAR ▾`
3. No debe abrirse desde:
   - `CUIT`
   - `RAZÓN SOCIAL`
   - `ESTADO`
4. Los filtros de este formulario disparan una server action que realiza una request al backend.
5. La respuesta del backend debe devolver la data ya filtrada para actualizar la tabla.
6. El listado de operadores/filtros por columna vendrá del backend cuando los contratos estén cerrados.
7. El front debe quedar preparado para consumir esos contratos sin reestructurar la UI.

## Persistencia por columna

1. Cada columna filtrable tiene su propia instancia lógica de filtro.
2. Cuando el usuario aplica el filtro de una columna, el estado de ese filtro debe persistirse para esa columna.
3. Al reabrir el modal de una columna, el formulario debe mostrarse con el último estado aplicado de esa columna.
4. Ese estado solo debe resetearse si el usuario usa `Limpiar` en ese mismo modal.
5. El estado del filtro por columna debe mantenerse sincronizado con lo que devuelva el backend en cada request.

## Comportamiento

### Aplicar

- `Aplicar` debe disparar una server action.
- La action debe enviar al backend:
  - columna origen
  - condición 1
  - conector lógico
  - condición 2
  - valores numéricos asociados
- El resultado backend debe actualizar la tabla con los datos filtrados.

### Limpiar

- `Limpiar` debe:
  - limpiar el formulario completo
  - eliminar los filtros activos de esa columna
  - actualizar el estado de la tabla removiendo ese filtro
- No es solo un reset visual del modal: también impacta en resultados.

### Cancelar

- `Cancelar` debe cerrar el modal sin alterar el último filtro aplicado.

## Tipos de valor permitidos

El input numérico debe aceptar:

- enteros
- decimales
- negativos

Ejemplos válidos:

- `1000`
- `25.5`
- `-10`

## Diseño y UI

```html
<div id="modal-filtro-num" style="display: flex; position: fixed; inset: 0px; background: rgba(15, 23, 42, 0.45); z-index: 500; align-items: center; justify-content: center; backdrop-filter: blur(3px);" onclick="cerrarModalFiltro(event)">
  <div style="background:white;border-radius:16px;width:480px;max-width:95vw;box-shadow:0 16px 48px rgba(0,0,0,.18);padding:28px 28px 24px" onclick="event.stopPropagation()">
    
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <div>
        <div id="mfn-titulo" style="font-size:16px;font-weight:700;color:var(--gray-9)">Filtrar Diferencia</div>
        <div style="font-size:12px;color:var(--gray-5);margin-top:3px">Mostrar filas donde:</div>
      </div>
      <button onclick="cerrarModalFiltro()" style="width:32px;height:32px;border:none;background:var(--gray-1);border-radius:8px;cursor:pointer;color:var(--gray-5);font-size:18px;display:flex;align-items:center;justify-content:center">×</button>
    </div>

    <!-- Condición 1 -->
    <div style="margin-bottom:20px">
      <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:10px">Condición 1</div>
      <div style="display:flex;gap:10px;align-items:flex-start">
        <select id="mfn-op1" style="flex:1;border:1.5px solid var(--gray-2);border-radius:10px;padding:10px 12px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--gray-9);outline:none;cursor:pointer;appearance:none;background:white url('data:image/svg+xml,&lt;svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22&gt;&lt;path fill=%22%2364748B%22 d=%22M7 10l5 5 5-5z%22/&gt;&lt;/svg&gt;') no-repeat right 12px center" onfocus="this.style.borderColor='var(--blue-5)'" onblur="this.style.borderColor='var(--gray-2)'">
          <option value="">Seleccionar condición...</option>
          <option value="mayor">es mayor que</option>
          <option value="mayor_igual">es mayor o igual que</option>
          <option value="menor">es menor que</option>
          <option value="menor_igual">es menor o igual que</option>
          <option value="igual">es igual a</option>
          <option value="distinto">es distinto de</option>
        </select>
        <div style="flex:1;position:relative">
          <input id="mfn-v1" type="number" placeholder="0" style="width:100%;border:1.5px solid var(--gray-2);border-radius:10px;padding:10px 36px 10px 12px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--gray-9);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--blue-5)'" onblur="this.style.borderColor='var(--gray-2)'">
          <div style="position:absolute;right:0;top:0;bottom:0;display:flex;flex-direction:column;border-left:1px solid var(--gray-2)">
            <button onclick="stepInput('mfn-v1',1)" style="flex:1;border:none;background:transparent;cursor:pointer;color:var(--gray-5);font-size:10px;padding:0 8px;border-radius:0 10px 0 0" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background=''">▲</button>
            <button onclick="stepInput('mfn-v1',-1)" style="flex:1;border:none;background:transparent;cursor:pointer;color:var(--gray-5);font-size:10px;padding:0 8px;border-radius:0 0 10px 0;border-top:1px solid var(--gray-2)" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background=''">▼</button>
          </div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--gray-5);margin-top:6px">Ejemplo: 1000, 25.5, -10</div>
    </div>

    <!-- Conector lógico -->
    <div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:13px;font-weight:700;color:var(--gray-9)">Conector lógico</span>
        <span title="Y = ambas condiciones deben cumplirse. O = al menos una." style="width:18px;height:18px;border-radius:999px;border:1.5px solid var(--gray-3);color:var(--gray-5);font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;cursor:help">i</span>
      </div>
      <div style="display:flex;gap:10px">
        <label style="flex:1;display:flex;align-items:center;gap:10px;border:1.5px solid var(--blue-5);border-radius:10px;padding:10px 14px;cursor:pointer;background:var(--blue-1);">
          <input type="radio" name="mfn-conector" value="Y" checked style="accent-color:var(--blue-5);width:16px;height:16px">
          <span style="font-size:13px;color:var(--gray-9);font-weight:500">Y <span style="font-weight:400;color:var(--gray-5)">(Todas las condiciones)</span></span>
        </label>
        <label style="flex:1;display:flex;align-items:center;gap:10px;border:1.5px solid var(--gray-2);border-radius:10px;padding:10px 14px;cursor:pointer;background:white;">
          <input type="radio" name="mfn-conector" value="O" style="accent-color:var(--blue-5);width:16px;height:16px">
          <span style="font-size:13px;color:var(--gray-9);font-weight:500">O <span style="font-weight:400;color:var(--gray-5)">(Al menos una)</span></span>
        </label>
      </div>
    </div>

    <!-- Condición 2 -->
    <div style="margin-bottom:24px">
      <div style="font-size:13px;font-weight:700;color:var(--gray-9);margin-bottom:10px">Condición 2 <span style="font-weight:400;color:var(--gray-5);font-size:12px">(opcional)</span></div>
      <div style="display:flex;gap:10px;align-items:flex-start">
        <select id="mfn-op2" style="flex:1;border:1.5px solid var(--gray-2);border-radius:10px;padding:10px 12px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--gray-9);outline:none;cursor:pointer;appearance:none;background:white url('data:image/svg+xml,&lt;svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22&gt;&lt;path fill=%22%2364748B%22 d=%22M7 10l5 5 5-5z%22/&gt;&lt;/svg&gt;') no-repeat right 12px center" onfocus="this.style.borderColor='var(--blue-5)'" onblur="this.style.borderColor='var(--gray-2)'">
          <option value="">Sin segunda condición</option>
          <option value="mayor">es mayor que</option>
          <option value="mayor_igual">es mayor o igual que</option>
          <option value="menor">es menor que</option>
          <option value="menor_igual">es menor o igual que</option>
          <option value="igual">es igual a</option>
          <option value="distinto">es distinto de</option>
        </select>
        <div style="flex:1;position:relative">
          <input id="mfn-v2" type="number" placeholder="0" style="width:100%;border:1.5px solid var(--gray-2);border-radius:10px;padding:10px 36px 10px 12px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--gray-9);outline:none;box-sizing:border-box" onfocus="this.style.borderColor='var(--blue-5)'" onblur="this.style.borderColor='var(--gray-2)'">
          <div style="position:absolute;right:0;top:0;bottom:0;display:flex;flex-direction:column;border-left:1px solid var(--gray-2)">
            <button onclick="stepInput('mfn-v2',1)" style="flex:1;border:none;background:transparent;cursor:pointer;color:var(--gray-5);font-size:10px;padding:0 8px;border-radius:0 10px 0 0" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background=''">▲</button>
            <button onclick="stepInput('mfn-v2',-1)" style="flex:1;border:none;background:transparent;cursor:pointer;color:var(--gray-5);font-size:10px;padding:0 8px;border-radius:0 0 10px 0;border-top:1px solid var(--gray-2)" onmouseover="this.style.background='var(--gray-1)'" onmouseout="this.style.background=''">▼</button>
          </div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--gray-5);margin-top:6px">Ejemplo: 1000, 25.5, -10</div>
    </div>

    <!-- Botones -->
    <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--gray-2);padding-top:16px">
      <button onclick="limpiarModalFiltro()" style="padding: 9px 20px; border-radius: 999px; border: 1px solid var(--gray-2); background: white; color: var(--gray-7); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer;">Limpiar</button>
      <button onclick="cerrarModalFiltro()" style="padding: 9px 20px; border-radius: 999px; border: 1px solid var(--gray-2); background: white; color: var(--gray-7); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer;">Cancelar</button>
      <button onclick="aplicarModalFiltro()" style="padding: 9px 20px; border:none; border-radius: 999px; background: var(--blue-5); color: white; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer;">Aplicar</button>
    </div>

  </div>
</div>
```
