## Rules Cross Management

### Objetivo

Implementar el módulo de `Gestión de Cruces` dentro del dashboard privado siguiendo la referencia visual `cross-management.png`, con estado local reactivo sobre data mock en esta iteración y preparado para migración futura a contratos reales.

### Reglas de arquitectura

1. El módulo debe implementarse como un módulo propio, separado de `dashboard-layout`.
2. La estructura debe seguir la arquitectura del proyecto basada en `data` y `presentation`.
3. En esta iteración, el origen de datos debe ser mock local.
4. La implementación debe quedar preparada para reemplazar el filtrado local por request real a backend cuando existan contratos.
5. La pantalla de listado y la futura subruta dinámica de detalle deben pertenecer al mismo dominio de feature.

### Reglas de UI

1. Se debe priorizar Mantine UI para:
   - layout
   - inputs
   - selects
   - tabla
   - badges
   - textos
2. CSS Modules solo debe utilizarse para estilos específicos que Mantine no cubra correctamente.
3. La pantalla debe incluir:
   - título
   - subtítulo
   - buscador por texto
   - filtro por período
   - filtro por rango de días
   - contador de resultados
   - tabla de cruces
4. La tabla debe mostrar las columnas:
   - `Nombre del cruce`
   - `Origen`
   - `Lote / CUIT`
   - `Período`
   - `CUITs`
   - `Fecha`
5. No debe existir distinción visual o funcional entre filas clickeables y no clickeables en esta iteración.
6. La opacidad reducida o el estado deshabilitado de la referencia debe ignorarse por tratarse de un error de diseño.

### Reglas funcionales

1. Todas las filas de la tabla deben ser clickeables.
2. Al hacer click sobre una fila, el usuario debe navegar a una subruta dinámica de Next correspondiente al cruce seleccionado.
3. La ruta de navegación debe resolverse bajo una carpeta de ruta en español y con param dinámico `crossId`.
4. La estructura objetivo de routing debe ser:
   `/gestion-de-cruces/vista-previa-cruce/[crossId]`
5. Esa subruta dinámica debe representar la preview o detalle del cruce.
6. La pantalla detalle debe construirse a partir de los params de navegación.
7. La request de información del cruce se resolverá en esa ruta de detalle.
8. En esta iteración, el buscador y los filtros deben operar con filtrado local reactivo sobre data mock.
9. El texto de búsqueda, el período y el rango de días deben combinarse entre sí.
10. Cualquier cambio en cualquiera de esos controles debe actualizar inmediatamente la tabla.
11. Si no existen resultados, debe mostrarse el estado vacío:
   `No se encontraron cruces asociados`.

### Restricciones

1. No implementar todavía la pantalla final de detalle del cruce más allá de la navegación estructural a la subruta dinámica.
2. No embutir handlers inline del HTML de referencia en la implementación final.
3. No duplicar lógica de filtrado en múltiples componentes; el estado del listado debe estar centralizado en el módulo.

### Validación

1. Debe renderizar el listado de cruces con mock local.
2. Debe poder filtrar por nombre, lote o CUIT.
3. Debe poder combinar filtros de texto, período y rango de días.
4. Debe navegar correctamente a la subruta dinámica al hacer click en una fila.
5. Debe renderizar el estado vacío cuando no haya resultados.
