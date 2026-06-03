## Spec Reprocessing Module

- Ref Visual: `codex/assets/design/dashboard/reprocessing-module/reprocessing.png`

## Requerimientos

1. Los estilos deben usar lo mas que se pueda Mantine UI en caso de no tener estilo dentro de la libreria para un caso especifico puede usar CSS modules.
2. Los componentes deben ser los de Mantine UI, aunque en caso de no tener para un componente especifico se puede usar div JSX etiqueta.

## Estructura

1. El modulo de reproceso esta dividido en 2 partes:

- Alerta de reproceso
  titulo: `CUITs en reproceso`
  descripcion: `Contribuyentes pendientes de investigación profunda. Podés agregar CUITs desde el Padrón Unificado activando el switch`
  button: `[var] en proceso`

- Tabla de cuits en reproceso
  cols: `CUIT`, `RAZON SOCIAL`, `FECHA`, `MARCADO POR`, `ULTIMO CRUCE`, `NOTAS`, ACCION (X)

## Funcionalidad

1. Al hacer click sobre una fila de la tabla, el modulo debe redirigir al CUIT correspondiente dentro de `Padrón Unificado`.
2. La accion `X` debe quitar el CUIT de la lista de reproceso.
3. En esta iteracion, la accion `X` debe actualizar el estado de reproceso solo sobre data mock.
4. Al cambiar el estado de reproceso de un CUIT a `false`, el CUIT debe dejar de aparecer en la lista.
5. El estado de los CUITs en reproceso debe ser reactivo.
6. Cuando un CUIT entra o sale de reproceso, el cambio debe reflejarse en todas las partes de la UI que consumen ese estado.
7. El badge del bloque de alerta debe recalcular automaticamente la cantidad actual de CUITs en reproceso.
8. Cuando exista contrato real, estos cambios deben sincronizarse con backend.
9. Si no existen CUITs en reproceso, la tabla debe mostrar el estado vacio:
   `No se encontraron CUITs en reproceso`.

## Diseño UI

- Alerta:

<div style="background:#FFF5F5;border:1px solid #FECACA;border-radius:10px;padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:12px">
          <div style="flex:1">
            <div style="font-size:13px;font-weight:700;color:#DC2626">CUITs en reproceso</div>
            <div style="font-size:12px;color:#991B1B;margin-top:2px">Contribuyentes pendientes de investigación profunda. Podés agregar CUITs desde el Padrón Unificado activando el switch.</div>
          </div>
          <span id="reproceso-total-badge" style="background:#DC2626;color:white;font-size:12px;font-weight:700;padding:4px 14px;border-radius:999px;white-space:nowrap">2 en reproceso</span>
        </div>

- Tabla:

<div style="background:white;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:20px">
          <table style="width:100%;border-collapse:collapse;font-family:inherit">
            <thead style="background:#F8FAFC">
              <tr>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #E2E8F0">CUIT</th>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #E2E8F0">Razón Social</th>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #E2E8F0">Fecha</th>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #E2E8F0">Marcado por</th>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #E2E8F0">Último cruce</th>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid #E2E8F0">Notas</th>
                <th style="width:50px;border-bottom:2px solid #E2E8F0"></th>
              </tr>
            </thead>
            <tbody id="reproceso-tbody">
              <tr id="repr-row-1" onclick="abrirCuitEnPadron('30-50401884-5','VOLKSWAGEN ARGENTINA S.A.')" style="cursor: pointer;" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background=''">
                <td style="padding:14px;font-family:monospace;font-weight:600;font-size:13px;color:#4375EE;border-bottom:1px solid #F1F5F9">30-50401884-5</td>
                <td style="padding:14px;font-weight:600;font-size:13px;color:#1E293B;border-bottom:1px solid #F1F5F9">VOLKSWAGEN ARGENTINA S.A.</td>
                <td style="padding:14px;font-size:13px;color:#64748B;border-bottom:1px solid #F1F5F9">27/04/2026</td>
                <td style="padding:14px;font-size:13px;color:#64748B;border-bottom:1px solid #F1F5F9">Nadia Guzmán</td>
                <td style="padding:14px;border-bottom:1px solid #F1F5F9"><span style="background:#EFF6FF;color:#4375EE;font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px">Desvío BI — CM</span></td>
                <td style="padding:14px;font-size:12.5px;color:#64748B;border-bottom:1px solid #F1F5F9">Pendiente revisión coeficientes 2025</td>
                <td style="padding:14px;border-bottom:1px solid #F1F5F9" onclick="event.stopPropagation()">
                  <button onclick="quitarReproceso('repr-row-1')" style="width: 28px; height: 28px; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; background: transparent; cursor: pointer; border-radius: 6px;" onmouseover="this.style.background='#FEF2F2'" onmouseout="this.style.background='transparent'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </td>
              </tr>
              <tr id="repr-row-2" onclick="abrirCuitEnPadron('27-32178654-3','MINERA ALTIPLANO JUJUY S.A.')" style="cursor: pointer;" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background=''">
                <td style="padding:14px;font-family:monospace;font-weight:600;font-size:13px;color:#4375EE">27-32178654-3</td>
                <td style="padding:14px;font-weight:600;font-size:13px;color:#1E293B">MINERA ALTIPLANO JUJUY S.A.</td>
                <td style="padding:14px;font-size:13px;color:#64748B">25/04/2026</td>
                <td style="padding:14px;font-size:13px;color:#64748B">Nadia Guzmán</td>
                <td style="padding:14px"><span style="background:#EFF6FF;color:#4375EE;font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px">Desvío BI — CM</span></td>
                <td style="padding:14px;font-size:12.5px;color:#64748B">Desvío crítico — requiere auditoría</td>
                <td style="padding:14px" onclick="event.stopPropagation()">
                  <button onclick="quitarReproceso('repr-row-2')" style="width: 28px; height: 28px; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; background: transparent; cursor: pointer; border-radius: 6px;" onmouseover="this.style.background='#FEF2F2'" onmouseout="this.style.background='transparent'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

## Update modulo reproceso

- El modulo de reproceso esta correcto en cuanto a UI pero se agrego que al tocar el boton de la X debe llamar a un modal de confirmacion.

- Modal de confirmacion para quitar de reproceso:

Referencia Visual : `codex/assets/design/dashboard/reprocessing-module/modal.png`

## Estructura

Titulo `Quitar de reproceso`
Subtitulo `¿Confirmas que deseas quitar este CUIT del reproceso?`
Alerta `VOLKSWAGEN ARGENTINA S.A.`
Descripcion `El CUIT será removido de la lista de reproceso. Esta acción no afecta el historial de cruces.`
Boton cancelar (`Cancelar`)
Boton confirmar accion (`Si, quitar`)

## Diseño UI

<div class="modal" style="max-width:420px">
    <div class="modal-header" style="padding:24px 28px 18px">
      <div>
        <div class="modal-title" style="font-size:18px;font-weight:800">Quitar de reproceso</div>
        <div class="modal-subtitle" id="modal-repr-subtitle">¿Confirmas que deseas quitar este CUIT del reproceso?</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="closeModal('modal-quitar-reproceso')" style="font-size:20px;color:var(--gray-5)">×</button>
    </div>
    <div style="padding:0 28px 20px">
      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:12px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <div style="font-size:13px;color:#991B1B" id="modal-repr-nombre">VOLKSWAGEN ARGENTINA S.A.</div>
      </div>
      <div style="font-size:13px;color:var(--gray-5);margin-top:12px">El CUIT será removido de la lista de reproceso. Esta acción no afecta el historial de cruces.</div>
    </div>
    <div class="modal-footer" style="padding:16px 28px 24px;gap:10px">
      <button class="btn btn-outline" onclick="closeModal('modal-quitar-reproceso')" style="border-radius:999px;padding:10px 24px;font-size:14px">Cancelar</button>
      <button class="btn" id="btn-confirmar-repr" onclick="ejecutarQuitarReproceso()" style="background:#DC2626;color:white;border:none;border-radius:999px;padding:10px 24px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer">Sí, quitar</button>
    </div>
  </div>

## Funcionalidades modal

- El modal debe abrirse al tocar la accion `X` de un item en reproceso.
- El modal no debe renderizar el detalle completo del item, ya que esa informacion ya esta visible en la tabla.
- El subtitulo debe mantenerse como copy fijo:
  - `¿Confirmas que deseas quitar este CUIT del reproceso?`
- La unica informacion dinamica del item que debe renderizarse dentro del modal es la `razón social`, presentada en el bloque de alerta.
- Si el usuario oprime `Sí, quitar`, el item correspondiente debe quitarse del estado mock reactivo de reproceso.
- Al confirmar la accion:
  - el modal debe cerrarse
  - el item debe desaparecer de la tabla
  - el badge del bloque de alerta debe actualizar la cantidad actual
  - si no quedan items, debe renderizarse el estado vacío
- Si el usuario selecciona `Cancelar`, el modal se cierra y no se emite ninguna accion.
- Cuando existan contratos reales, esta accion se reemplazara por una server action conectada al backend.
