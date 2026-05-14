## Rules Reprocessing Module

### Objetivo

Implementar el modulo de reproceso dentro del dashboard privado respetando la referencia visual de `reprocessing.png`, usando Mantine UI como base y manteniendo estado reactivo local sobre data mock en esta iteracion.

### Reglas de arquitectura

1. La implementacion debe vivir dentro de un modulo propio de dashboard y seguir la arquitectura del proyecto basada en `data` y `presentation`.
2. El estado de los CUITs en reproceso debe concentrarse en el modulo y no dispersarse entre componentes.
3. En esta iteracion, el origen de datos debe ser mock.
4. La estructura debe quedar preparada para reemplazar luego la fuente mock por contrato real sin reescribir la capa de presentacion.

### Reglas de UI

1. Se debe priorizar Mantine UI para alerta, tabla, badges, botones, textos y layout.
2. CSS Modules solo debe utilizarse para estilos especificos que Mantine no cubra de forma directa.
3. La alerta superior debe mostrar:
   - titulo `CUITs en reproceso`
   - descripcion explicativa
   - badge con la cantidad actual de CUITs en reproceso
4. La tabla debe mostrar las columnas:
   - `CUIT`
   - `Razón Social`
   - `Fecha`
   - `Marcado por`
   - `Último cruce`
   - `Notas`
   - acción `X`
5. La acción `X` debe ser visualmente destructiva y no debe disparar la navegación de la fila.
6. Si no existen CUITs en reproceso, debe renderizarse el estado vacío:
   `No se encontraron CUITs en reproceso`.

### Reglas funcionales

1. Al hacer click en una fila, el usuario debe ser redirigido al CUIT correspondiente dentro de `Padrón Unificado`.
2. Al hacer click en la acción `X`, el CUIT debe salir de reproceso y desaparecer de la tabla.
3. En esta iteracion, quitar reproceso debe resolverse solo sobre estado mock local.
4. El badge del bloque de alerta debe actualizarse automaticamente al cambiar la lista.
5. Toda parte de la UI que consuma el estado de reproceso debe reflejar inmediatamente los cambios.

### Restricciones

1. No implementar todavia persistencia real a backend.
2. No embutir handlers inline del HTML de referencia en la implementacion final.
3. No romper la integracion futura con Padrón Unificado ni con contrato real.

### Validacion

1. Debe poder navegarse desde una fila al CUIT correspondiente.
2. Debe poder quitarse un CUIT de reproceso con la acción `X`.
3. El badge de la alerta debe mantenerse sincronizado con la cantidad de filas.
4. El estado vacio debe verse correctamente cuando no queden elementos.
