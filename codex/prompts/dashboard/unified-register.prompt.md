## Prompt Unified Register

Implementá el módulo `Padrón Unificado` siguiendo la arquitectura modular del proyecto y las definiciones de:

- `codex/specs/dashboard/unified-register.spec.md`
- `codex/constraints/dashboard/unified-register.rule.md`

### Objetivo

Construir la pantalla principal de `Padrón Unificado` como un módulo independiente, con búsqueda local reactiva sobre data mock y navegación hacia una subruta dinámica de detalle por `CUIT`.

### Alcance de esta iteración

1. Crear el módulo:
   - `src/modules/unified-register/`
2. Montar la pantalla principal desde la ruta privada correspondiente del dashboard.
3. Implementar un buscador con placeholder:
   - `Buscar por CUIT o razón social...`
4. Filtrar localmente sobre mock por:
   - `CUIT`
   - `razón social`
5. Renderizar los resultados como cards clickeables con:
   - número de CUIT
   - razón social
   - actividad
   - régimen
   - estado
   - badge de nivel de riesgo
   - menú de 3 puntos
6. Al hacer click en una card, navegar a la subruta dinámica:
   - `/vista-previa-padron/[cuit]`
7. Crear la ruta dinámica y una pantalla base de detalle para el `CUIT`, aun si el diseño final de esa vista todavía no está definido.
8. Renderizar el menú de 3 puntos en la UI, pero sin comportamiento funcional real en esta iteración.
9. Si la búsqueda no devuelve resultados, mostrar:
   - `No se encontraron resultados para ese CUIT o razón social`

### Restricciones

1. Priorizar Mantine UI como base de componentes.
2. Mantener la separación entre `data` y `presentation`.
3. No implementar todavía la lógica final de:
   - `Ver análisis completo`
   - `Agregar a lote`
   - `Marcar reproceso`
4. El HTML de referencia con el menú abierto debe usarse solo como guía visual; la implementación real debe abrir/cerrar el menú normalmente.

### Resultado esperado

Al finalizar, debe existir:

- un módulo funcional de `Padrón Unificado`
- búsqueda local reactiva sobre mock
- cards clickeables
- ruta dinámica `vista-previa-padron/[cuit]`
- estado vacío consistente
