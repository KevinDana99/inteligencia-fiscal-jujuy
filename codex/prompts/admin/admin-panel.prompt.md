# Admin Panel Implementation Prompt

## Objetivo

Implementar la feature del admin panel respetando:

- `codex/specs/admin-panel.spec.md`
- `codex/constraints/admin/admin-panel.rule.md`
- `codex/constraints/global.rule.md`
- la arquitectura definida por `create-frontend-architecture`

Esta iteración corresponde a la primera versión funcional del panel de administración. El panel
debe reemplazar el placeholder actual de `/admin` sin reconstruir auth.

## Contexto Actual

- La ruta del panel ya existe en `app/admin/page.tsx`.
- El acceso a `/admin` ya está protegido por el flujo actual de auth y elevación a admin.
- El proyecto usa `Next.js 16` con `App Router`.
- La UI del proyecto usa `Mantine UI`.
- El módulo `auth` ya existe y no debe modificarse para implementar esta feature.
- Hoy `/admin` solo muestra un placeholder server-side.
- Aún no existe contrato backend específico para administración de usuarios.

## Referencias

- Diseño principal: `codex/assets/design/admin/admin-panel.design.png`

## Alcance de la tarea

La implementación debe:

- reemplazar el contenido placeholder actual de `/admin`
- mantener intacto el routing actual
- mantener intacto el flujo actual de auth
- construir una pantalla principal de admin panel
- usar un mock temporal propio del dominio del admin panel
- mostrar navbar, sidebar, widgets, buscador, tabla y modales
- permitir alta, edición y eliminación mock de usuarios
- impedir la eliminación del usuario `admin`
- respetar la referencia visual del panel

## Comportamiento funcional que debe preservarse

1. No romper el flujo actual de acceso a `/admin`.
2. Si no existe sesión `admin`, `/admin` debe seguir derivando al flujo actual de login admin.
3. El admin panel no debe modificar login, logout, sesión, cookies, proxy ni elevación a `admin`.
4. La ruta del panel debe seguir siendo `/admin`.

## Resultado esperado

Al finalizar, el proyecto debe contar con:

- una pantalla funcional de administración en `/admin`
- un módulo específico del admin panel dentro de `src/modules/`
- un mock temporal del dominio de usuarios administrativos
- widgets de métricas históricas mock
- tabla de usuarios con buscador
- modales de alta, edición y eliminación
- restricción explícita para no eliminar al usuario `admin`

## Estructura funcional mínima

### Navbar

Debe mostrar:

- título del panel
- datos del usuario admin autenticado
- acción de logout

### Sidebar

Debe mostrar dos items visuales:

- inicio
- configuración

En esta iteración:

- deben ser interactivos visualmente
- no deben requerir nuevas rutas

### Widgets

Deben existir cuatro métricas:

- usuarios activos
- usuarios eliminados
- contraseñas cambiadas
- cargos / roles

Estas métricas deben resolverse con histórico mock en esta iteración.

### Gestión de usuarios

Debe incluir:

- título `Gestión de usuarios`
- subtítulo `Administrá las cuentas del sistema`
- buscador de usuarios
- botón `Nuevo usuario`
- tabla de usuarios

## Reglas de datos

1. No inventar todavía un contrato backend real.
2. Crear un mock temporal específico del dominio del admin panel.
3. Ese mock debe cubrir:
   - listado de usuarios
   - alta de usuario
   - edición de usuario
   - eliminación de usuario
   - métricas históricas
4. El mock no debe depender únicamente del mock actual de auth.
5. El usuario `admin` del sistema no puede eliminarse.
6. Las restricciones del admin deben respetarse tanto en UI como en la capa de datos mock.

## Reglas de UI

1. La implementación visual debe construirse prioritariamente con primitives de Mantine UI.
2. CSS Modules solo debe usarse cuando Mantine no alcance para resolver el diseño.
3. Todos los elementos visuales deben usar la fuente global de la app.
4. Los íconos deben salir de librerías compatibles con React, por ejemplo `@tabler/icons-react`.
5. No hardcodear SVG como string.
6. No incrustar SVG vía `<img>` para resolver iconografía del panel.
7. Si no existe un ícono razonable, puede omitirse temporalmente antes que romper el estándar del proyecto.

## Reglas funcionales específicas

1. El buscador solo debe buscar usuarios.
2. El buscador no debe incluir filtros en esta iteración.
3. El placeholder del buscador debe reflejar la cantidad de usuarios disponible.
4. La tabla debe tener estas columnas:
   - Usuario
   - Email
   - Cargo
   - Acciones
5. Cada fila debe mostrar usuario, email, cargo y acciones disponibles.
6. Las acciones de crear, editar y eliminar deben abrir modales.
7. El admin debe poder crear usuarios mediante modal.
8. El admin debe poder editar usuarios mediante modal.
9. El admin debe poder eliminar usuarios mediante modal, excepto al usuario `admin`.

## Restricciones

1. No tocar la feature de auth para implementar el admin panel.
2. No crear rutas nuevas para el panel en esta iteración.
3. No eliminar al usuario `admin`.
4. No implementar todavía estados de error específicos del admin panel.
5. No introducir una capa backend definitiva mientras la feature siga usando mock temporal.

## Archivos esperados

La implementación debería concentrarse principalmente en:

- `app/admin/page.tsx`
- `src/modules/admin-panel/**`

Y tocar archivos adicionales solo si son estrictamente necesarios para:

- conectar el módulo al layout real
- instalar o integrar una librería de íconos compatible
- modelar el mock temporal del dominio

## Sugerencia de estructura

```text
src/modules/admin-panel/
├── index.tsx
├── data/
│   ├── data-access.ts
│   ├── interfaces/
│   ├── models/
│   └── sources/
│       └── mock/
├── presentation/
│   ├── components/
│   ├── hooks/
│   └── sections/
└── lib/
```

La estructura exacta puede ajustarse a la arquitectura vigente del repo, pero debe mantener
separación clara entre datos, modelos y presentación.

## Validación final

Antes de cerrar la tarea:

- verificar que `/admin` siga siendo la ruta del panel
- verificar que un usuario sin sesión admin siga entrando al flujo actual de login admin
- verificar que un usuario `admin` pueda ver el panel
- verificar que el mock permita crear, editar y eliminar usuarios
- verificar que el usuario `admin` no pueda eliminarse
- verificar que el buscador filtre usuarios
- verificar que la UI respete la referencia principal del diseño
- correr `bun run lint`
- correr `bun run build`

## Resultado esperado final

El resultado final debe ser un admin panel funcional montado sobre la ruta `/admin`, visualmente
alineado al diseño, desacoplado de auth, y apoyado en un mock temporal del dominio hasta contar
con contrato backend real.
