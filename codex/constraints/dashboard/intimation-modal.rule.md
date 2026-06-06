## Rule Modal Generacion Exportables

Estas reglas implementan `codex/specs/dashboard/intimation-modal.spec.md`.

### Alcance

1. Esta feature corresponde al segundo modal del flujo `Generar intimación` dentro de `cross-management`.
2. El modal se abre por encima del modal de configuración de intimación.
3. El modal base de configuración no debe cerrarse al abrir este segundo modal.

### Arquitectura

1. Usar Mantine UI para la estructura del modal y controles de navegación.
2. Complementar con CSS Modules solo para el layout y estilos finos que Mantine no cubra.
3. Mantener la lógica dentro del módulo consumidor hasta que exista el provider general de configuración.
4. Reutilizar la configuración actual de la intimación como source of truth temporal.

### Regla de negocio

1. El frontend no genera documentos.
2. `PDF` y `DOCX` son generados por backend.
3. El frontend solo:
   - solicita preview
   - visualiza preview PDF
   - descarga PDF
   - descarga DOCX
4. No debe existir preview de DOCX.

### Preview PDF

1. La visualización PDF debe prepararse para usar `embedpdf` headless.
2. Para esta etapa sin contratos reales, puede existir una implementación mock/placeholder del viewer.
3. La preview es por contribuyente activo dentro de un lote.
4. La barra de paginación superior debe navegar entre contribuyentes del lote.
5. El nombre y CUIT visibles deben corresponder al contribuyente activo.

### Descargas

1. `Descargar PDF` descarga el lote completo.
2. `Descargar Word` descarga el lote completo.
3. El contribuyente activo solo afecta la preview visible, no el alcance del archivo descargado.

### Estado

1. La configuración de intimación debe conservarse al abrir este modal.
2. La configuración debe seguir intacta al cerrar este modal y volver al modal anterior.
3. Deben contemplarse estados de:
   - loading de preview
   - error de preview
   - loading de descarga PDF
   - loading de descarga DOCX
   - error de descarga

### Integración futura

1. No implementar todavía contratos backend reales.
2. No integrar librerías de generación DOCX en frontend.
3. La implementación debe quedar preparada para reemplazar el mock por:
   - server actions
   - source REST
   - provider general de configuración
