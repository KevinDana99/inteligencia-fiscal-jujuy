## Prompt Cross Modal Loader

Implementar el componente `CrossModalLoader` para `Gestión de Cruces` siguiendo:

- `codex/specs/dashboard/cross-modal-loader.spec.md`
- `codex/constraints/dashboard/cross-modal-loader.rule.md`

## Objetivo

Crear el componente visual de loading modal para el módulo `cross-management`, dejándolo listo para uso futuro, pero sin conectarlo todavía a ningún flujo.

## Alcance

1. Crear únicamente el componente.
2. No montarlo todavía desde ninguna pantalla, modal o hook.
3. No dispararlo todavía al generar documentos ni al procesar un cruce.

## Estructura obligatoria

```text
src/modules/cross-management/presentation/components/CrossModalLoader/
├── CrossModalLoader.module.css
└── index.tsx
```

## Requisitos de implementación

1. Usar Mantine UI para la base del modal y la tipografía.
2. Complementar con CSS Modules para:
   - overlay
   - caja
   - spinner custom si hace falta
   - espaciado fino
3. El componente debe aceptar:
   - `opened: boolean`
   - `message?: string`
4. El texto default debe ser:
   - `Procesando cruce...`

## Reglas visuales

1. Overlay fullscreen con blur y fondo oscuro translúcido.
2. Caja central blanca con:
   - radio redondeado
   - sombra visible
   - ancho cercano a `320px`
   - padding vertical y horizontal amplio
3. Loader circular centrado.
4. Texto centrado debajo del loader.

## Reglas de comportamiento

1. Sin botón de cierre.
2. Sin cierre por click outside.
3. Sin cierre por escape.
4. Debe ser un componente puramente visual y controlado por props.

## Arquitectura

1. Mantener el componente dentro de `src/modules/cross-management/presentation/components`.
2. No introducir lógica de negocio.
3. No reutilizar todavía `PageLoader` ni `LoadingModal` de `core` para esta pieza.
4. No cablear este componente en esta tarea.

## Criterio de entrega

1. El componente existe y compila dentro del módulo.
2. Respeta la referencia visual de la spec.
3. Queda listo para ser montado en una futura tarea dentro del flujo real de cruces.
