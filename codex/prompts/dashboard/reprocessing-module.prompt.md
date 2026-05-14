## Prompt Reprocessing Module

Implementá el modulo de `Reproceso` dentro del dashboard privado siguiendo la spec `codex/specs/dashboard/reprocessing-module.spec.md` y las reglas de `codex/constraints/dashboard/reprocessing-module.rule.md`.

### Objetivo

Construir la pantalla de `CUITs en reproceso` con:

1. bloque de alerta superior con cantidad actual en reproceso
2. tabla de CUITs en reproceso
3. navegación desde cada fila a `Padrón Unificado`
4. acción para quitar un CUIT de reproceso
5. estado reactivo local basado en mock
6. estado vacío cuando no existan elementos

### Requisitos de implementación

1. Usar Mantine UI como base para:
   - alert/card/banner
   - tabla
   - textos
   - badges
   - botones
   - layout
2. Usar CSS Modules solo para estilos específicos que no salgan directo de Mantine.
3. Mantener la arquitectura modular del proyecto:
   - `data`
   - `presentation`
4. Resolver la iteración actual sobre data mock local.
5. Evitar duplicar estado derivado innecesariamente:
   - el badge debe leer la cantidad actual directamente desde el estado del modulo

### Comportamiento esperado

1. Al hacer click en una fila, debe redirigir al CUIT correspondiente dentro de `Padrón Unificado`.
2. La acción `X` no debe disparar la navegación de la fila.
3. Al tocar `X`, el CUIT debe dejar de estar en reproceso sobre data mock y desaparecer de la tabla.
4. El badge de la alerta debe actualizarse automáticamente a partir del estado actual.
5. Si la lista queda vacía, debe mostrarse:
   - `No se encontraron CUITs en reproceso`

### Resultado esperado

Entregar una implementación funcional del módulo de reproceso, visualmente alineada a la referencia `reprocessing.png`, lista para futura conexión con contrato real sin reestructurar la capa de presentación.
