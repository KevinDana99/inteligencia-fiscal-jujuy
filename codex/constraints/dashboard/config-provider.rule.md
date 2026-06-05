## Reglas Config Provider

Estas reglas definen restricciones obligatorias para implementar el provider global de configuracion de exportables del dashboard en base a `codex/specs/dashboard/config-provider.spec.md`.

## Alcance

1. Esta iteracion solo puede tocar el provider global de configuracion de exportables y el wiring minimo necesario para montarlo en el arbol privado.
2. El provider debe servir a los modulos consumidores actuales:
   - `/configuracion`
   - `/gestion-de-cruces`
   - `/vista-previa-padron/[cuit]`
3. No debe introducir persistencia en `localStorage`.
4. No debe mover la logica del provider a `app/`.

## Ubicacion y arquitectura

1. La definicion del provider y de la hook debe vivir dentro de:
   - `src/modules/dashboard-layout/presentation/contexts/`
2. `app/` solo puede encargarse de montar el provider dentro del arbol privado.
3. El provider no debe montarse en `app/(private)/page.tsx`.
4. El punto correcto de montaje debe estar dentro del arbol `app/(private)` usando el layout privado o el gate correspondiente.
5. La implementacion debe respetar la skill de arquitectura frontend del proyecto:
   - `app/` monta
   - `src/modules/...` define

## Estado del provider

1. El estado raiz del provider debe usar el type `ConfigurationType`.
2. `ConfigurationType` debe tener esta forma base:

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

3. Ese mismo objeto debe ser:
   - el estado del provider
   - el valor que devuelve `useConfig`
   - el valor que se setea luego de la request inicial server-side

## API de la hook

1. Debe existir una hook `useConfig`.
2. `useConfig` no debe hacer la request `GET` por si misma.
3. `useConfig` debe exponer como minimo:
   - `configuration`
   - `updateConfig`
   - `setConfig`
4. `configuration` debe representar el estado completo del provider con forma `ConfigurationType`.

## Reglas de `updateConfig`

1. `updateConfig` debe recibir un parametro `newConfig`.
2. `newConfig` debe ser un parcial del objeto raiz del provider.
3. `newConfig` puede incluir actualizaciones parciales dentro de:
   - `configuracion`
   - `intimacion`
   - `informe`
4. `updateConfig` debe mergear contra el estado previo.
5. `updateConfig` solo debe actualizar la key correspondiente dentro de `configuracion`.
6. `updateConfig` debe conservar intacto el resto del objeto general.
7. `updateConfig` no debe reemplazar el estado completo del provider.

## Reglas de `setConfig`

1. `setConfig` debe recibir un objeto completo del type `ConfigurationType`.
2. `setConfig(newConfig: ConfigurationType)` debe reemplazar el estado completo del provider.
3. `setConfig` no debe hacer merge parcial.
4. `setConfig` se usa para:
   - hidratacion inicial
   - refresco completo desde backend

## Hidratacion inicial

1. La configuracion inicial debe resolverse con una request server-side de Next.
2. Esa request inicial debe resolverse en el punto comun del arbol privado donde se monta el provider.
3. El resultado de esa request debe entrar al provider como configuracion inicial.
4. La carga inicial no debe depender de una llamada cliente posterior hecha desde `useConfig`.

## Contratos

1. La obtencion de configuracion debe usar:
   - `GET /api/configuracion/intimacion`
   - `GET /api/configuracion/informe`
2. La actualizacion de configuracion debe usar:
   - `PUT /api/configuracion/intimacion`
   - `PUT /api/configuracion/informe`
3. La generacion de documentos debe usar:
   - `POST /api/documentos/generar`
4. La descarga de documentos debe usar:
   - `GET /api/documentos/{documento_id}/descargar?formato=pdf`
   - `GET /api/documentos/{documento_id}/descargar?formato=docx`

## Regla de slice por documento

1. El provider mantiene la configuracion global completa.
2. Al generar una intimacion, el frontend debe usar solo:
   - `configuration.configuracion.intimacion`
3. Al generar un informe, el frontend debe usar solo:
   - `configuration.configuracion.informe`
4. El frontend no debe enviar el objeto global completo al endpoint de generacion si el backend espera solo el slice correspondiente.
