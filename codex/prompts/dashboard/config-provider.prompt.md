Implementar el provider global de configuracion de exportables del dashboard segun la spec `codex/specs/dashboard/config-provider.spec.md` y las reglas `codex/constraints/dashboard/config-provider.rule.md`.

## Objetivo

Construir un provider global reutilizable para la configuracion de exportables que pueda ser consumido desde:

- `/configuracion`
- `/gestion-de-cruces`
- `/vista-previa-padron/[cuit]`

La implementacion debe dejar lista la base de estado compartido y de hidratacion inicial server-side sin introducir `localStorage`.

## Requisitos funcionales

1. Crear un provider de configuracion global de exportables.
2. Crear la hook `useConfig`.
3. El provider debe manejar un estado raiz con type `ConfigurationType`.
4. La forma base del estado debe ser:

```json
{
  "configuracion": {
    "intimacion": {
      "asunto": "string",
      "saludo": "string",
      "cuerpo": "string",
      "pie": "string",
      "fuente_informacion": "string | null",
      "columnas_seleccionadas": ["string"]
    },
    "informe": {
      "titulo": "string",
      "cuerpo": "string"
    }
  }
}
```

5. `useConfig` debe exponer como minimo:
   - `configuration`
   - `updateConfig`
   - `setConfig`

## Reglas de API de la hook

1. `configuration` debe representar el estado completo del provider.
2. `updateConfig(newConfig)`:
   - recibe un parcial del objeto raiz
   - puede incluir updates parciales dentro de `configuracion`, `intimacion` o `informe`
   - debe mergear contra el estado previo
   - no debe reemplazar el estado completo
3. `setConfig(newConfig: ConfigurationType)`:
   - recibe un objeto completo
   - reemplaza el estado completo
   - no debe hacer merge parcial
   - se usa para hidratacion inicial y refresh completo

## Hidratacion inicial

1. `useConfig` no debe hacer fetch por si misma.
2. La configuracion inicial debe resolverse con una request server-side de Next.
3. Esa request debe resolverse en el punto comun del arbol privado donde se monta el provider.
4. El resultado debe entrar al provider como `initialConfig`.

## Ubicacion y arquitectura

1. La definicion del provider y de la hook debe vivir dentro de:
   - `src/modules/dashboard-layout/presentation/contexts/`
2. `app/` solo debe encargarse de montar el provider.
3. El provider no debe definirse dentro de `app/`.
4. El provider no debe montarse en `app/(private)/page.tsx`.
5. El punto correcto de montaje debe estar dentro del arbol `app/(private)` usando el layout privado o el gate correspondiente.

## Contratos a contemplar

1. Obtener configuracion:
   - `GET /api/configuracion/intimacion`
   - `GET /api/configuracion/informe`
2. Actualizar configuracion:
   - `PUT /api/configuracion/intimacion`
   - `PUT /api/configuracion/informe`
3. Generar documento:
   - `POST /api/documentos/generar`
4. Descargar documento:
   - `GET /api/documentos/{documento_id}/descargar?formato=pdf`
   - `GET /api/documentos/{documento_id}/descargar?formato=docx`

## Regla de uso por documento

1. El provider mantiene la configuracion global completa.
2. Al generar una intimacion, debe usarse solo:
   - `configuration.configuracion.intimacion`
3. Al generar un informe, debe usarse solo:
   - `configuration.configuracion.informe`

## Instrucciones de implementacion

1. Crear o actualizar los types necesarios para `ConfigurationType`.
2. Implementar el context provider del modulo.
3. Implementar la hook `useConfig`.
4. Montar el provider en el arbol privado comun del dashboard.
5. Preparar el wiring para recibir `initialConfig` server-side.
6. No introducir `localStorage`.
7. No mover la logica del provider fuera del modulo `dashboard-layout`.

## Validacion esperada

1. El provider debe quedar disponible para los modulos privados consumidores.
2. `useConfig` debe poder leer el estado global.
3. `updateConfig` debe hacer merge parcial correcto.
4. `setConfig` debe reemplazar el estado completo.
5. La implementacion debe quedar lista para enchufar contratos reales sin reestructurar la API del provider.
