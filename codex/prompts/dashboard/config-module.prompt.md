# Config Module Prompt

## Objetivo

Implementar el modulo de configuracion del dashboard privado segun la spec `codex/specs/dashboard/config-module.spec.md` y las reglas `codex/constraints/dashboard/config-module.rule.md`.

## Referencias obligatorias

- `codex/specs/dashboard/config-module.spec.md`
- `codex/constraints/dashboard/config-module.rule.md`
- la skill `create-frontend-architecture`

## Contexto actual

- El proyecto usa Next.js 16 App Router.
- La UI debe construirse con Mantine UI.
- El modulo vive en `/configuracion`.
- El modulo pertenece al dashboard privado y no tiene relacion con `/admin`.
- Esta iteracion usa solo state local de React.
- No existe contrato backend para persistencia aun.
- La preview del PDF debe abrirse en una pestaña nueva del navegador y renderizar el documento activo fuera de la aplicacion.

## Alcance

La implementacion debe:

1. Crear la pagina privada `/configuracion` dentro del dashboard.
2. Montar una pantalla de configuracion con:
   - header compartido
   - tabs `Intimacion` e `Informe de analisis`
   - preview de documento
   - footer de acciones
3. Hacer que `Intimacion` sea el tab activo por defecto.
4. Hacer que `Informe de analisis` muestre por ahora una view simple con un titulo.
5. Mantener todos los inputs editables con sus default values iniciales.
6. Abrir el PDF en una nueva pestaña del navegador usando el documento visible como fuente.
7. Mostrar un modal de exito al confirmar cambios.
8. No persistir datos en cookies ni localStorage.

## Reglas de implementacion

1. Usar Mantine como base para toda la UI.
2. Usar CSS Modules solo para ajustes visuales que no se resuelvan bien con props de Mantine.
3. Reutilizar `globals/icons` si ya existe el mapeo necesario; si no, usar Tabler Icons.
4. Mantener la pantalla dentro de la ruta `/configuracion` y no crear dependencias con `/admin`.
5. Usar state local para el formulario y el cambio de tabs.
6. La configuracion inicial debe salir de defaults definidos en la spec.
7. El PDF preview debe abrirse en una pestaña externa al flujo de la aplicacion.
8. El modal de exito no debe persistir nada, solo confirmar visualmente la accion.

## Estructura esperada

1. `src/modules/dashboard-layout/`
   - modulo de presentacion y estado de configuracion del dashboard
2. `app/(private)/configuracion/page.tsx`
   - ruta privada que monta el modulo
3. Componentes de presentacion:
   - `DashboardConfigurationPage`
   - subcomponentes que ayuden a separar tabs, preview y acciones si hace falta
4. Hook de presentacion:
   - `useDashboardConfiguration` o equivalente

## Comportamiento funcional

1. `Intimacion` debe mostrar la vista completa del documento.
2. `Informe de analisis` debe mostrar una vista simple con un titulo.
3. El header debe compartirse entre tabs.
4. El resto del contenido debe cambiar segun la tab activa.
5. `Previsualizar PDF` debe abrir en una pestaña nueva la version PDF del documento activo.
6. `Confirmar cambios` debe mostrar un modal de exito con un copy del tipo:
   - `Se guardaron los cambios correctamente`
7. No debe haber persistencia cliente.

## Modelo minimo de estado

La implementacion debe poder representarse con un state local equivalente a:

```ts
type ConfigTab = 'intimacion' | 'informe';

type ConfigState = {
  activeTab: ConfigTab;
  intimacion: {
    asunto: string;
    saludo: string;
    cuerpo: string;
    cierre: string;
    piePlanilla: string;
    columnas: string[];
  };
  informe: {
    titulo: string;
  };
};
```

## Criterios de implementacion

1. No implementar persistencia backend real.
2. No implementar localStorage ni cookies.
3. No redirigir a `/admin/configuracion`.
4. No crear una ruta interna para el PDF preview dentro del dashboard.
5. El contenido visible de la preview debe ser el origen del PDF.
6. Mantener el tab `Intimacion` como default.
7. Mantener `Informe de analisis` como tab simple y navegable.

## Validacion

1. `/configuracion` debe renderizar dentro del dashboard privado.
2. `Intimacion` debe quedar activa por defecto.
3. `Informe de analisis` debe mostrar solo un titulo simple.
4. `Previsualizar PDF` debe abrir una pestaña nueva con el documento renderizado.
5. `Confirmar cambios` debe mostrar un modal de exito.
6. No debe persistirse nada en cliente.
