## Rules Unified Register

1. La implementación debe seguir la arquitectura modular por feature ya establecida en el proyecto.
2. `Padrón Unificado` debe implementarse como un módulo propio e independiente del shell de navegación:
   - `src/modules/unified-register/`
3. La ruta principal del módulo debe montarse desde el dashboard privado sin mover la responsabilidad de negocio a `dashboard-layout`.
4. El módulo debe mantener la separación entre:
   - `data`
   - `presentation`
5. En esta iteración, la fuente de datos debe ser mock local.
6. El buscador debe operar con filtrado local reactivo sobre la data mock.
7. El buscador debe filtrar únicamente por:
   - `CUIT`
   - `razón social`
8. Cada resultado debe renderizarse como una card clickeable.
9. Al hacer click en una card, la aplicación debe navegar a una subruta dinámica de detalle del CUIT.
10. La subruta dinámica de detalle debe usar el naming:
    - `vista-previa-padron`
11. La estructura objetivo de routing debe ser:
    - `/vista-previa-padron/[cuit]`
12. La pantalla de detalle debe existir como ruta dinámica montada en Next, aunque su diseño final todavía no esté cerrado.
13. El menú de acciones de 3 puntos debe renderizar las opciones visibles en la UI, pero en esta iteración no debe ejecutar ninguna acción funcional.
14. El menú no debe quedar abierto por defecto; el HTML de referencia abierto debe tomarse solo como guía visual.
15. Si la búsqueda no devuelve resultados, debe mostrarse el estado vacío:
    - `No se encontraron resultados para ese CUIT o razón social`
16. La implementación debe priorizar Mantine UI como base de componentes.
17. Los estilos específicos no cubiertos por Mantine deben resolverse sin romper la estructura modular del módulo.
