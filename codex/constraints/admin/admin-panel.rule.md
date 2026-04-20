# Admin Panel Rules

## Objetivo

Estas reglas definen restricciones obligatorias para implementar el panel de administración en este proyecto.

## Acceso y Routing

1. El admin panel debe vivir en la ruta existente `/admin`.
2. No se debe modificar el routing actual para implementar esta feature.
3. La implementación debe reemplazar el contenido actual de `app/admin/page.tsx` sin mover la ruta a otro segmento.
4. Solo el único usuario con rol `admin` puede acceder al contenido del panel.
5. Si no existe sesión `admin`, debe mantenerse el flujo actual de acceso a `/admin` y elevación al login admin.
6. La feature del admin panel no debe modificar la implementación actual de auth.
7. La feature del admin panel no debe alterar el flujo actual de login, logout, sesión, cookies, proxy ni elevación a `admin`.

## Datos y Mock

1. Hasta que exista contrato backend real, el admin panel debe usar un mock temporal propio del dominio.
2. El mock del admin panel no debe depender únicamente del mock actual de autenticación.
3. El mock debe cubrir como mínimo:
   - listado de usuarios
   - alta de usuario
   - edición de usuario
   - eliminación de usuario
   - métricas históricas del panel
4. Las métricas históricas deben resolverse con datos mock en esta iteración.
5. La implementación debe quedar preparada para iterarse luego contra un contrato backend real.

## Reglas Funcionales

1. El panel debe mostrar un navbar con título, datos del usuario admin autenticado y acción de logout.
2. El panel debe mostrar un sidebar con dos items visuales:
   - inicio
   - configuración
3. En esta iteración el sidebar no debe forzar la creación de nuevas rutas.
4. El panel debe mostrar cuatro widgets de métricas:
   - usuarios activos
   - usuarios eliminados
   - contraseñas cambiadas
   - cargos / roles
5. El panel debe mostrar una tabla de usuarios con las columnas:
   - usuario
   - email
   - cargo
   - acciones
6. El buscador solo debe buscar usuarios.
7. El buscador no debe incluir filtros en esta iteración.
8. El placeholder del buscador debe reflejar la cantidad de usuarios disponibles.
9. Las acciones de crear, editar y eliminar deben resolverse mediante modales.
10. El usuario `admin` no puede ser eliminado.
11. El alcance funcional del rol `admin` dentro de esta pantalla se limita a lectura y modificación.
12. Las restricciones del admin deben mantenerse tanto en UI como en la capa de datos mock temporal.

## Diseño e Iconografía

1. La implementación visual debe respetar como referencia principal `codex/assets/design/admin/admin-panel.design.png`.
2. La UI debe construirse prioritariamente con componentes de Mantine UI.
3. CSS Modules solo debe usarse cuando Mantine no alcance para resolver el diseño.
4. Todos los elementos visuales del panel deben usar la fuente global de la aplicación.
5. Los íconos deben provenir de librerías compatibles con React, por ejemplo `@tabler/icons-react` o equivalente.
6. No se deben hardcodear SVG como string, incrustar SVG vía `<img>` ni crear assets SVG ad hoc para resolver iconos del panel.
7. Si no existe un ícono razonable en librería, puede omitirse temporalmente antes que incorporar un SVG fuera del estándar del proyecto.

## Estados

1. En esta iteración no se deben implementar pantallas de error específicas del admin panel.
2. Debe priorizarse la pantalla principal del diseño.
3. Los estados de error específicos del panel podrán iterarse en una fase posterior.

## Prohibiciones

- No crear nuevas rutas del admin panel en esta iteración.
- No tocar la feature de auth para implementar el admin panel.
- No eliminar al usuario `admin`.
- No inventar un contrato backend definitivo mientras el dominio siga en modo mock temporal.
- No resolver iconografía del panel con SVG incrustados como assets `img`.
