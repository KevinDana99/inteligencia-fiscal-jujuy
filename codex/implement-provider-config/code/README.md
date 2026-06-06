# Implementación Provider Config

## Resumen

Se implementó un provider global de configuración de exportables y se montó en el árbol privado del dashboard.

## Punto de montaje

- `app/(private)/PrivateLayoutGate.tsx`

## Árbol de código implementado

### 1. Modelo de configuración

- `src/modules/dashboard-layout/data/models/Configuration.ts`

Contiene:

- `IntimationType`
- `ReportType`
- `ConfigurationType`
- `DeepPartial<T>`

### 2. Capa data para configuración

- `src/modules/dashboard-layout/data/interfaces/ConfigurationSource.ts`
- `src/modules/dashboard-layout/data/data-access.ts`
- `src/modules/dashboard-layout/data/actions/queries/getConfigurationAction.ts`
- `src/modules/dashboard-layout/data/sources/rest/dtos/ApiConfigurationDtos.ts`
- `src/modules/dashboard-layout/data/sources/rest/RestConfigurationSource.ts`

Contiene:

- lectura real de:
  - `GET /api/configuracion/intimacion`
  - `GET /api/configuracion/informe`
- combinación de ambas respuestas en `ConfigurationType`

### 2. Provider + hook

- `src/modules/dashboard-layout/presentation/contexts/ConfigContext.tsx`
- `src/modules/dashboard-layout/presentation/contexts/index.ts`

Contiene:

- `ConfigProvider`
- `useConfig`
- `configuration`
- `updateConfig`
- `setConfig`

### 3. Montaje en dashboard-layout

- `src/modules/dashboard-layout/index.tsx`
- `src/modules/dashboard-layout/presentation/components/DashboardLayoutShell/index.tsx`

Cambios:

- `DashboardLayoutModule` ahora recibe `initialConfig`
- `DashboardLayoutShell` monta `ConfigProvider`

### 4. Inyección inicial server-side

- `app/(private)/PrivateLayoutGate.tsx`

Cambios:

- resuelve la configuración real desde backend
- pasa `initialConfig` real al layout del dashboard
- ya no usa fallback local

### 5. Consumo actual del provider

- `src/modules/dashboard-layout/presentation/hooks/useDashboardConfiguration.ts`
- `src/modules/dashboard-layout/presentation/components/DashboardConfigurationPage/index.tsx`

Cambios:

- `Informe de análisis` ya lee y actualiza datos desde `useConfig`

## API implementada de la hook

```ts
useConfig() => {
  configuration,
  updateConfig,
  setConfig
}
```

### `updateConfig`

- recibe un parcial profundo del objeto raíz
- mergea contra el estado previo
- actualiza solo las keys enviadas

### `setConfig`

- recibe un `ConfigurationType`
- reemplaza el estado completo

## Estado actual de integración

### Ya conectado al provider

- `Informe de análisis`

### Montado pero no migrado completo al provider

- `Intimación`

Motivo:

- la UI actual de `IntimationTemplate` todavía no calza limpio 1 a 1 con el shape contractual del provider
- hoy sigue usando su hook local para no forzar una integración inconsistente

## Rutas impactadas

- `/configuracion`
- `/gestion-de-cruces`
- `/vista-previa-padron/[cuit]`

Estas rutas ya quedan bajo el árbol privado donde el provider está montado.

## Próximo paso recomendado

1. reemplazar `DEFAULT_CONFIGURATION` por el `GET` server-side real
1. reemplazar `EMPTY_CONFIGURATION` por el `GET` server-side real
1. migrar `IntimationTemplate` al provider con un shape alineado entre UI y contratos
2. conectar persistencia backend para `setConfig` / `updateConfig`
