## Spec Modal Reproceso

- Referencia visual: `codex/assets/design/dashboard/reprocessing-module/reprocessing-modal.png` si existe. Si no existe, usar la captura validada en conversación como referencia funcional.

## Requisitos

1. Todos los componentes deben usar Mantine UI. Si no existe componente adecuado para una integración puntual, se puede usar JSX base.
2. Para estilos puntuales no cubiertos por Mantine, usar CSS Modules.
3. No debe salirse de la arquitectura ni de los patrones de diseño del repo.
4. Para íconos se debe usar Tabler Icons. Si hiciera falta un icono mapeado, agregarlo en `src/globals/Icons` y reutilizarlo desde allí.
5. El modal pertenece al dominio `reprocessing`, aunque debe poder reutilizarse desde otros módulos.
6. No debe implementarse como componente `shared` genérico.

## Ownership y ubicación

- El modal debe vivir dentro de `src/modules/reprocessing/`.
- Debe diseñarse para ser consumido desde otros módulos por props.
- El owner funcional del componente es `reprocessing`.

## Propósito funcional

- Es un modal para enviar un caso a reproceso.
- En esta iteración no debe conectarse todavía al flujo real entre módulos ni a contratos backend.
- Debe quedar listo visual y estructuralmente para que luego se conecte a un provider/server action sin reestructurarlo.

## Props mínimas esperadas

- `contribuyenteId`
- `cuit`
- `razonSocial`

## Información visible en UI

Visualmente solo debe renderizar:

- badge: `🔴 En Reproceso`
- título: `Agregar descripción`
- subtítulo dinámico: `30-50401884-5 — VOLKSWAGEN ARGENTINA S.A.`

`contribuyenteId` no se muestra, pero debe existir como prop para la futura integración.

## Estructura

- Header
  - badge `🔴 En Reproceso`
  - título `Agregar descripción`
  - subtítulo `<cuit> — <razonSocial>`
  - botón cerrar

- Body
  - label `Motivo / Descripción (opcional)`
  - textarea
  - hint `Esta descripción aparecerá en la pantalla de Reproceso.`
  - alert `⚠️ El CUIT quedará marcado como pendiente de investigación profunda.`

- Footer
  - botón `Cancelar`
  - botón `Confirmar reproceso`

## Diseño y UI

```html
<div class="modal" style="width:480px">
  <div class="modal-header">
    <div>
      <div class="modal-title" style="display:flex;align-items:center;gap:8px">
        <span style="background:#FFF5F5;border:1px solid #FECACA;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;color:#DC2626">🔴 En Reproceso</span>
        Agregar descripción
      </div>
      <div class="modal-subtitle" id="reproceso-modal-cuit">30-50401884-5 — VOLKSWAGEN ARGENTINA S.A.</div>
    </div>
    <button class="btn btn-ghost btn-sm" onclick="cerrarModalReproceso()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  </div>
  <div class="modal-body">
    <div class="form-group">
      <label class="form-label">Motivo / Descripción <span style="color:var(--gray-3);font-weight:400">(opcional)</span></label>
      <textarea id="reproceso-desc-input" class="form-input" rows="3" placeholder="Ej: Pendiente revisión de coeficientes, desvío detectado en período 2024..." style="resize:vertical;min-height:80px"></textarea>
      <div class="form-hint">Esta descripción aparecerá en la pantalla de Reproceso.</div>
    </div>
    <div style="background:#FFF5F5;border:1px solid #FECACA;border-radius:8px;padding:10px 14px;font-size:12.5px;color:#991B1B;display:flex;gap:8px;align-items:center">
      ⚠️ El CUIT quedará marcado como pendiente de investigación profunda.
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-outline" onclick="cerrarModalReproceso()">Cancelar</button>
    <button class="btn btn-primary" style="background:#DC2626" onclick="confirmarReproceso()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
      Confirmar reproceso
    </button>
  </div>
</div>
```

## Comportamiento en esta iteración

- `Cancelar`
  - cierra el modal
  - no hace ninguna otra acción

- `Confirmar reproceso`
  - representa la intención de enviar el caso a reproceso
  - en esta iteración no debe conectarse todavía a contratos ni a un flujo real compartido
  - puede quedar como stub visual / callback desacoplado

## Reglas del textarea

- es opcional
- es multilinea
- conserva saltos de línea
- puede quedar vacío
- no requiere validación dura en esta iteración
- no hace falta definir máximo de caracteres todavía

## Exclusiones de esta iteración

- no conectar todavía con backend
- no conectar todavía con provider global
- no sincronizar todavía estado entre módulos
- no implementar todavía el flujo completo cross-module

## Criterio de reusabilidad

- Debe poder abrirse desde distintos módulos pasando solo props.
- No debe duplicarse dentro de `cross-management` o `unified-register`.
- La futura conexión a provider o server actions debe resolverse desde una única implementación en `reprocessing`.
