## Cross Modal Loader

## Requisitos

1. Usar siempre Mantine UI para componentes. Si una pieza no se resuelve con Mantine, complementar con JSX y CSS Modules.
2. Usar siempre Mantine UI para estilos. Si una pieza no se resuelve con props de Mantine, complementar con CSS Modules.
3. Para iconos mapeados usar `globals/icons` si ya existe el mapeo. Si no existe, usar Tabler Icons como libreria base.
4. No salirse nunca de la arqui actual.
5. Implementar el modal de loading aqui: `src/modules/cross-management/presentation/components`

## Diseño UI

<div id="loader-modal" onclick="this.style.display='none'" style="display: flex; position: fixed; inset: 0px; z-index: 9999; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px); align-items: center; justify-content: center; cursor: pointer;">
    <div style="background:white;border-radius:14px;padding:36px 40px;width:320px;display:flex;flex-direction:column;align-items:center;gap:18px;box-shadow:0 20px 60px rgba(0,0,0,.18);cursor:default" onclick="event.stopPropagation()">
      <div style="width:56px;height:56px">
        <svg width="56" height="56" viewBox="0 0 56 56" style="animation:loader-spin 1.2s linear infinite">
          <circle cx="28" cy="28" r="22" fill="none" stroke="#DBEAFE" stroke-width="5"></circle>
          <circle cx="28" cy="28" r="22" fill="none" stroke="#2563EB" stroke-width="5" stroke-dasharray="103.67" stroke-dashoffset="25.92" stroke-linecap="round" transform="rotate(-90 28 28)"></circle>
        </svg>
      </div>
      <div style="text-align:center">
        <div style="font-size:14px;font-weight:600;color:#1E293B">Procesando cruce...</div>
      </div>
    </div>
  </div>
