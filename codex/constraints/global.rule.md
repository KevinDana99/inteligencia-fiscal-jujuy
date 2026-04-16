# Global Rules

## Objetivo

Estas reglas aplican a todo el proyecto salvo que una regla específica de una feature indique una restricción adicional más estricta.

## Arquitectura

1. Todos los archivos y directorios fuera de `codex/` deben respetar la arquitectura definida por la skill `create-frontend-architecture`.
2. Las features deben organizarse usando la estructura modular del proyecto cuando aplique, priorizando `src/modules/<feature>`.
3. La lógica de negocio no debe vivir directamente dentro de componentes de UI cuando corresponde a hooks, capa de datos o server-side.
4. Los contratos externos deben mapearse a modelos internos antes de llegar a la capa de presentación.

## Lenguaje

1. Todos los nombres de archivos y directorios fuera de `codex/` deben estar en inglés.
2. El código fuente fuera de `codex/` debe usar inglés para identificadores, funciones, tipos, exports y nombres técnicos.
3. Los comentarios en código fuera de `codex/` deben escribirse en inglés, salvo que exista una razón funcional explícita para usar otro idioma.

## UI

1. Todos los componentes, páginas y elementos de interfaz deben usar Mantine como librería UI por defecto.
2. No se deben mezclar múltiples librerías UI en una misma feature salvo requerimiento explícito.
3. Se deben priorizar componentes y theming de Mantine antes de introducir estilos custom innecesarios.
4. Todos los componentes y paginas deben estar adaptadas a diseño responsivo.

## Datos e Integración

1. La capa de presentación no debe consumir directamente contratos externos sin pasar por la capa de datos correspondiente.
2. El acceso a datos debe seguir la arquitectura del proyecto y no resolverse directamente dentro de componentes de interfaz.
3. Las responsabilidades server-side deben mantenerse del lado servidor cuando Next.js provea una solución nativa para ello.

## Flujo de Trabajo

1. `codex/specs/` define los requerimientos y contratos funcionales de cada feature.
2. `codex/constraints/` define restricciones obligatorias de implementación.
3. `codex/prompts/` define el plan táctico de implementación.
4. `codex/history/` documenta qué se implementó al cerrar una feature.

## Prohibiciones

- No crear estructura de carpetas arbitraria fuera del patrón definido por la arquitectura del proyecto.
- No mezclar responsabilidades de datos, presentación y lógica de negocio sin justificación clara.
- No introducir librerías UI paralelas como solución por defecto.
- No dejar contratos externos crudos expuestos directamente a presentation.
