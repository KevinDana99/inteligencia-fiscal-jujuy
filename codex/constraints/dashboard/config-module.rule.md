# Config Module Rules

## Objetivo

Estas reglas definen restricciones obligatorias para implementar el modulo de configuracion del dashboard en base a `codex/specs/dashboard/config-module.spec.md`.

## Alcance general

1. Esta iteracion solo puede tocar el modulo de configuracion del dashboard y su ruta privada asociada.
2. El modulo vive en `/configuracion`.
3. El modulo pertenece al dashboard privado y no tiene relacion con `/admin`.
4. No se debe modificar auth, login, cookies, sesion ni el flujo de permisos para resolver esta pantalla.
5. No se deben crear cookies, localStorage ni persistencia cliente para esta iteracion.

## Arquitectura

1. La implementacion debe seguir la skill `create-frontend-architecture`.
2. La pantalla debe construirse con Next.js 16 App Router y Mantine UI.
3. Si se crea un modulo nuevo, debe respetar la estructura del proyecto:
   - `src/modules/<module-name>/`
   - `data/`
   - `presentation/`
   - `types.ts`
   - `index.tsx`
4. CSS Modules solo debe usarse para medidas, posicionamiento y detalles visuales que no convenga expresar con props de Mantine.
5. No se deben introducir librerias de UI nuevas.

## Ruta y ownership

1. La ruta funcional de esta iteracion debe ser `/configuracion`.
2. El contenido debe renderizar dentro del layout privado del dashboard.
3. La pagina debe resolverse dentro del dominio del dashboard y no dentro del panel admin.
4. La pagina puede quedarse vacia solo mientras se implementa el prompt, pero no debe redirigir a `/admin/configuracion`.

## Reglas funcionales

1. Todos los inputs deben ser editables.
2. Todos los inputs deben arrancar con los defaults definidos en la spec.
3. El estado inicial se arma localmente a partir de esos defaults mientras no exista contrato real.
4. `Intimacion` debe ser el tab activo por defecto.
5. `Informe de analisis` debe existir como tab navegable.
6. `Informe de analisis` por ahora solo debe mostrar un titulo simple y no una vista completa.
7. El header debe compartirse entre tabs.
8. El resto del contenido puede cambiar segun la tab activa.
9. El boton `Previsualizar PDF` debe abrir una nueva pestaña del navegador con el PDF renderizado del documento activo.
10. La preview usada para el PDF debe salir del HTML visible de la pantalla.
11. El PDF no debe renderizarse dentro de la aplicacion como modal o ruta interna.
12. El boton `Confirmar cambios` debe mostrar un modal de exito con un mensaje de confirmacion.
13. La accion de confirmar no debe persistir aun en backend.

## Reglas de estado

1. El estado de la pantalla debe ser local de React durante esta iteracion.
2. El shape minimo del state debe contemplar:
   - `activeTab`
   - `intimacion`
   - `informe`
3. `intimacion` debe contener los campos editables descriptos por la spec.
4. `informe` debe contener al menos el titulo minimo de la vista simple.
5. El state no debe persistirse ni sincronizarse con storage del navegador.

## Reglas visuales

1. La pantalla debe respetar la referencia visual del spec.
2. La tab `Intimacion` debe verse activa por defecto.
3. La tab `Informe de analisis` debe verse disponible pero simple.
4. El preview del documento debe representar el documento final esperado, no una maqueta vacia.
5. El modal de exito debe verse consistente con Mantine y con la paleta del proyecto.

## Validacion

1. `/configuracion` debe cargar dentro del dashboard privado.
2. `Intimacion` debe ser el tab inicial.
3. `Informe de analisis` debe mostrar solo un titulo simple por ahora.
4. `Previsualizar PDF` debe abrir una nueva pestaña con el documento renderizado.
5. `Confirmar cambios` debe mostrar un modal de exito.
6. No debe existir persistencia cliente para la configuracion.
