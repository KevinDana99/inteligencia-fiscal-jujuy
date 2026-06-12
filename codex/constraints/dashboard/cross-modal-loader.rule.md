## Rule Cross Modal Loader

Implementar el modal de loading para `Gestión de Cruces` siguiendo la referencia de `codex/specs/dashboard/cross-modal-loader.spec.md`, pero sin conectarlo todavía a ningún flujo de negocio.

## Alcance

1. En esta etapa solo se crea el componente.
2. No se debe montar todavía desde:
   - `CrossPreviewModals`
   - `IntimationExportModal`
   - `useCrossPreviewModals`
   - ni desde ningún otro flujo del módulo.
3. No se debe disparar todavía al accionar un cruce ni al generar documentos.

## Ubicación obligatoria

1. El componente debe vivir dentro de:
   - `src/modules/cross-management/presentation/components`
2. Debe respetar la convención del módulo:

```text
src/modules/cross-management/presentation/components/CrossModalLoader/
├── CrossModalLoader.module.css
└── index.tsx
```

## Base técnica

1. Usar Mantine UI como base para:
   - modal
   - layout
   - tipografía
2. Si una pieza visual no se resuelve bien con Mantine, complementar con JSX y CSS Modules.
3. No introducir librerías nuevas.

## UI obligatoria

1. Overlay fullscreen con:
   - fondo semitransparente
   - blur suave
   - centrado vertical y horizontal
2. Caja central con:
   - fondo blanco
   - radio redondeado
   - sombra marcada
   - ancho fijo aproximado al de la spec
   - padding interno amplio
3. Loader visual circular al centro.
4. Texto:
   - `Procesando cruce...`
   - centrado horizontalmente

## Comportamiento

1. El modal no debe cerrarse por:
   - click fuera
   - tecla escape
2. No debe mostrar botón de cierre.
3. Debe exponer una prop `opened` para control externo.
4. Puede exponer `message` opcional, pero el default debe ser:
   - `Procesando cruce...`

## Arquitectura

1. Mantener la implementación dentro de `cross-management`.
2. No mover este loader a `src/components/core` en esta etapa.
3. No agregar lógica de negocio dentro del componente.
4. El componente debe quedar listo para ser reutilizado más adelante en el flujo de cruce.
