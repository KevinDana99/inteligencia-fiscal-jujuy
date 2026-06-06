## Rules New Crossing Management Preview

### Objetivo

Implementar la nueva vista de `/gestion-de-cruces/vista-previa-cruce/[crossId]` en base a `codex/specs/dashboard/new-crossing-management.spec.md`, usando data mock local en esta iteración.

### Alcance

1. Esta iteración solo debe implementar la vista de preview/detalle del cruce.
2. No debe reemplazar ni reescribir el listado principal de `/gestion-de-cruces`.
3. No debe implementar todavía el modal `Generar intimación`.
4. No debe implementar todavía la reutilización con la template de configuración ni el provider de configuración.
5. El botón `Generar intimación` debe existir visualmente en la vista `Resumen`, pero sin comportamiento final de modal en esta etapa.

### Reglas de arquitectura

1. La implementación debe respetar la arquitectura actual del proyecto.
2. Debe priorizar Mantine UI para componentes.
3. Si Mantine no cubre una necesidad puntual de estructura o estilo, se puede complementar con JSX y CSS Modules.
4. Los íconos deben salir de Tabler Icons.
5. La data de esta iteración debe ser mock local y vivir dentro del dominio `cross-management`.

### Reglas de datos

1. La data base del cruce debe ser la misma para ambas tabs:
   - `Planilla`
   - `Resumen`
2. Ambas tabs deben representar esa misma data con estructuras visuales distintas.
3. La implementación mock debe seguir literalmente el ejemplo visual de la spec para:
   - header del cruce
   - indicadores
   - tabla `Planilla`
   - tabla de `Resumen`
   - tabla `Análisis sistémico por CUIT`

### Reglas de UI

1. La pantalla debe incluir un header compartido entre tabs con:
   - botón volver a `Gestión de Cruces`
   - toggle `Planilla / Resumen`
   - card informativa `Cruce en curso`
2. La tab `Planilla` debe mostrar:
   - indicadores previos a la tabla
   - título `Planilla de datos`
   - buscador `Buscar CUIT o razón social...`
   - tabla principal
3. La tab `Resumen` debe mostrar:
   - botón `Generar intimación` visible arriba a la derecha
   - tabla de resumen
   - tabla `Análisis sistémico por CUIT`
   - buscador `Buscar CUIT o razón social...`

### Reglas funcionales

1. El toggle de tabs debe cambiar entre `Planilla` y `Resumen`.
2. Cada tab debe tener su propio buscador.
3. Cada buscador debe filtrar solo la tabla visible de su propia tab.
4. El filtro debe buscar por:
   - `CUIT`
   - `razón social`
5. Al cambiar de tab, el buscador de la tab a la que se entra debe resetearse.
6. No deben implementarse todavía filtros avanzados por columna ni exportables reales.
7. El botón `Generar intimación` no debe abrir modal todavía en esta iteración.

### Restricciones

1. No conectar contratos backend en esta iteración.
2. No introducir persistencia localStorage/cookies.
3. No mover todavía la template de intimación a un componente reutilizable en esta etapa.
4. No tocar el módulo de configuración en esta iteración para resolver esta vista.

### Validación

1. La ruta `/gestion-de-cruces/vista-previa-cruce/[crossId]` debe renderizar la nueva vista completa.
2. La tab `Planilla` debe renderizar tabla y buscador funcional.
3. La tab `Resumen` debe renderizar ambas tablas y su buscador funcional.
4. Ambos buscadores deben filtrar por `CUIT` y `razón social`.
5. Al cambiar de tab, el buscador visible debe resetearse.
6. `npm run build` debe pasar.
