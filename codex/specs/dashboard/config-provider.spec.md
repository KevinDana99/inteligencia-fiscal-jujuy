## Dashboard Config Provider

- ref: `Plan de implementacion del config provider`

## Diseño de implementacion

- Se debe implementar un provider que se pueda reutilizar desde `Padron unificado modulo`, `Gestion de cruces modulo`
- El provider no debe definirse dentro de `app/`.
- Siguiendo la arquitectura del proyecto, la definicion del provider y de la hook debe vivir dentro de:
  - `src/modules/dashboard-layout/presentation/contexts/`
- `app/` solo debe encargarse de montar el provider dentro del arbol privado.

## Objeto de Configuracion

```json
{
  "configuracion": {
    "intimacion": {
      "asunto": "string",
      "saludo": "string",
      "cuerpo": "string",
      "pie": "string",
      "fuente_informacion": "string | null", // opcional
      "columnas_seleccionadas": ["string"]
    },
    "informe": {
      "titulo": "string",
      "cuerpo": "string"
    }
  }
}
```

## Hooks

- Debe existir un hook que se llame `useConfig`.
- La hook `useConfig` no debe hacer la request `GET` por si misma. La configuracion inicial debe llegar al provider desde la request inicial server-side de Next.
- La hook `useConfig` debe devolver el estado de la config a traves del provider de `ConfigProvider`.
- La hook `useConfig` debe estar dentro del provider y devolver los metodos y propiedades del mismo.
- La hook debe devolver como estado el objeto raiz completo del provider, cuyo type se llamara `ConfigurationType` y cuya forma base es:

```json
{
  "configuracion": {
    "intimacion": {
      "asunto": "string",
      "saludo": "string",
      "cuerpo": "string",
      "pie": "string",
      "fuente_informacion": "string | null", // opcional
      "columnas_seleccionadas": ["string"]
    },
    "informe": {
      "titulo": "string",
      "cuerpo": "string"
    }
  }
}
```

- La hook `useConfig` debe devolver un metodo para updatear `updateConfig` la configuracion dinamicamente. (Esto se usara para las pantallas donde se generan los exportables).
- La hook `useConfig` debe devolver tambien un metodo `setConfig`.
- El metodo `updateConfig` recibe un parametro llamado `newConfig`.
- `newConfig` debe ser un parcial del objeto raiz del provider.
- `newConfig` puede incluir actualizaciones parciales dentro de:
  - `configuracion`
  - `intimacion`
  - `informe`
- `updateConfig` debe mergear contra el estado previo y actualizar solo la key correspondiente dentro de `configuracion`, conservando intacto el resto del objeto general.
- `setConfig` debe recibir un objeto completo del type `ConfigurationType`.
- `setConfig(newConfig: ConfigurationType)` reemplaza el estado completo del provider.
- `setConfig` no debe hacer merge parcial.
- `setConfig` se usa para:
  - hidratacion inicial
  - refresco completo desde backend

## Alcance

- No debe persistir en local storage
- Este objeto se actualiza con la configuracion del backend.

## Funcionalidad

- Al cargar la pagina, la configuracion inicial se setea en el estado del provider a partir de una request inicial server-side de Next.
- Al usarse de `Gestion de cruces` en donde generas intimacion o usarse desde `Padron unificado` donde generas un informe, deberia poder usarse el provider para cambiar el estado general.
- El provider debe montarse en un nivel compartido del arbol privado del dashboard para que lo puedan consumir:
  - `/configuracion`
  - `/gestion-de-cruces`
  - `/vista-previa-padron/[cuit]`
- El punto correcto de montaje esta dentro del arbol `app/(private)`, usando el layout privado / gate correspondiente y no `app/(private)/page.tsx`.
- El `GET` inicial de configuracion debe resolverse server-side en ese punto comun del arbol privado antes de hidratar el provider.
- El provider debe recibir esa configuracion inicial y exponerla a los modulos hijos a traves de `useConfig`.

## Contratos

# Contratos intimación/informe

### **1. Obtener Configuración por Tipo**

- **Método:** `GET`
- **Ruta:** `/api/configuracion/intimacion` _(o _`/api/configuracion/informe`_)_
- **Response (200 OK):**

```text
{
  "asunto": "PRESUNTA DIFERENCIA DE BASE IMPONIBLE", // string
  "saludo": "Estimado Contribuyente,", // string
  "cuerpo": "Por medio de la presente nos dirigimos a Ud. a los fines de notificarle.\n\nSegún la información obrante en poder de esta Dirección, se ha detectado una presunta diferencia en la base imponible declarada.\n\nSe intima a regularizar la situación en un plazo de 10 días hábiles.", // string (usa \n para saltos de línea/párrafos)
  "pie": "Fecha de corte 11/2025.", // string (texto libre que va abajo de la planilla)
  "fuente_informacion": "ARCA", // string | null (opcional)
  "columnas_seleccionadas": [
        "anio",
        "base_imponible_ingresos_brutos"
    ]
}
```

### **2. Actualizar Configuración por Tipo**

- **Método:** `PUT`
- **Ruta:** `/api/configuracion/intimacion` _(o _`/api/configuracion/informe`_)_
- **Request Body:** (El mismo JSON de arriba)
- **Response (204 No Content)**

### **3. Generar Documento (Intimación o Informe)**

- **Método:** `POST`
- **Ruta:** `/api/documentos/generar`
- **Request Body:**

```text
{
  "contribuyente_id": "d6c60e56-f594-48c3-b351-5c369afce906", // uuid
  "tipo_documento": "Intimacion", // string (Valores permitidos: "Intimacion", "Informe")
  "formato": "Pdf", // string (Valores permitidos: "Pdf", "Docx")
  "configuracion": { // object (Opcional). Si viene null, el backend usa la config global de la DB para ese tipo_documento
    "asunto": "PRESUNTA DIFERENCIA DE BASE IMPONIBLE",
    "saludo": "Estimado Contribuyente,",
    "cuerpo": "Texto puntual solo para este PDF...",
    "pie": "Fecha de corte 11/2025.",
    "fuente_informacion": "ARCA",
    "columnas_seleccionadas": [
        "anio",
        "base_imponible_ingresos_brutos"
    ]
  }
}
```

- **Response (201 Created):**

```text
{
  "documento_id": "d6c60e56-f594-48c3-b351-5c369afce906", // uuid (ID del registro en la tabla de docs)
  "url_descarga": "/api/documentos/d6c60e56-f594-48c3-b351-5c369afce906/descargar" // string (Ruta para pedir el archivo)
}
```

### **4. Descargar Documento**

- **Método:** `GET`
- **Ruta:** `/api/documentos/{documento_id}/descargar?formato=pdf` _(o _`?formato=docx`_)_
- **Headers:** `Authorization: Bearer <token>` (Como es un archivo binario, el front tiene que mandar el token en el header, no en la URL).
- **Response (200 OK):**
  - **NO devuelve un JSON.**
  - Devuelve un **Stream/Binario** (Blob).
  - **Headers de la respuesta HTTP clave:**
    - `Content-Type: application/pdf` (o `application/vnd.openxmlformats-officedocument.wordprocessingml.document` para docx)
    - `Content-Disposition: inline; filename="intimacion_42.pdf"`.
