# Contratos Gestion de Lotes

Todos los endpoints requieren `Authorization: Bearer <token>` de un usuario Analista Fiscal.

El Super Administrador no tiene acceso a estos recursos, salvo que tambien tenga la marca de Analista Fiscal.

Este documento contiene unicamente los contratos vigentes para frontend:

- `GET /api/lotes`
- `GET /api/lotes/{loteId}`
- `POST /api/lotes/previsualizaciones`
- `POST /api/lotes`

## Reglas generales

- Las rutas publicas cuelgan de `/api/lotes`.
- Los cuerpos JSON usan `camelCase`.
- `id` es un UUID.
- `fechaGeneracion` se serializa como fecha ISO 8601 con offset.
- `regimen` en respuestas puede ser `"Convenio Multilateral"` o `"Regimen Local"`.
- Para crear o previsualizar, el frontend puede enviar `regimen` como `"CM"`, `"Convenio Multilateral"` o `"Regimen Local"`.
- El backend tambien tolera los aliases `"ConvenioMultilateral"`, `"Convenio Multilateral (CM)"` y `"RegimenLocal"`.
- No enviar valores numericos para `regimen`; aunque el enum interno pudiera parsearlos, no forman parte del contrato publico.
- `razonSocial` se retorna como `null` hasta que exista una fuente definida para obtenerla.
- Crear y previsualizar usan `multipart/form-data` porque pueden recibir archivo Excel y CUITs manuales en la misma solicitud.
- El archivo debe enviarse en el campo `archivo` y debe ser `.xlsx`.
- Los CUITs manuales pueden enviarse repitiendo el campo `cuits` o como texto separado por coma, punto y coma, espacios, tabs o saltos de linea.
- Los CUITs invalidos o duplicados se informan en la previsualizacion.
- Al crear un lote, solo se persisten CUITs validos y unicos; los invalidos o duplicados se ignoran.
- Si se envia un archivo invalido, la solicitud falla aunque tambien incluya CUITs manuales validos.

## Cambios internos del modelo

El modelo actual de persistencia incorpora datos internos que no se reciben desde frontend:

- `creado_por_usuario_id` / `CreadoPorUsuarioId`: se toma del token autenticado. En el listado se expone como resumen `creadoPor`.
- `contribuyente_id` / `ContribuyenteId`: reemplaza el CUIT directo en la relacion interna, pero el contrato de carga sigue trabajando con CUITs.
- `lotes_contribuyentes.id`: es interno de persistencia y no se expone.
- `numero`: lo genera PostgreSQL; el frontend no debe enviarlo.

## Tipos comunes

```ts
type Uuid = string;
type FechaIso = string;

type RespuestaError = {
  codigo: string;
  mensaje: string;
  estado: number;
};

type RegimenLote = "Convenio Multilateral" | "Regimen Local";
type RegimenSolicitudLote =
  | "CM"
  | "Convenio Multilateral"
  | "ConvenioMultilateral"
  | "Convenio Multilateral (CM)"
  | "Regimen Local"
  | "RegimenLocal";

type AutorLote = {
  id: Uuid;
  nombre: string;
};

type RespuestaLoteListado = {
  id: Uuid;
  numeroLote: string;
  nombre: string;
  descripcion: string | null;
  regimen: RegimenLote;
  cantidadCuits: number;
  fechaGeneracion: FechaIso;
  creadoPor: AutorLote;
};

type RespuestaCuitLote = {
  cuit: string;
  razonSocial: string | null;
  regimen: RegimenLote;
  orden: number;
};

type RespuestaDetalleLote = {
  id: Uuid;
  numeroLote: string;
  nombre: string;
  descripcion: string | null;
  regimen: RegimenLote;
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  cantidadCuits: number;
  fechaGeneracion: FechaIso;
  creadoPor: AutorLote;
  cuits: RespuestaCuitLote[];
};

type RespuestaResumenLoteCreado = {
  id: Uuid;
  numero: number;
  numeroFormateado: string;
  nombre: string;
  descripcion: string | null;
  regimen: RegimenLote;
  cantidadCuits: number;
  fechaGeneracion: FechaIso;
};
```

## Listar lotes

**Endpoint**

- `GET /api/lotes`

**Query params**

```ts
type SolicitudListarLotes = {
  Busqueda?: string | null;
  FechaDesde?: FechaIso | null;
  FechaHasta?: FechaIso | null;
  Pagina?: number;
  ItemsPagina?: number;
};
```

Valores por defecto:

- `Pagina`: `1`
- `ItemsPagina`: `10`

Reglas:

- `Pagina` debe ser mayor a `0`.
- `ItemsPagina` debe estar entre `1` y `100`.
- Si se informan `FechaDesde` y `FechaHasta`, `FechaDesde` no puede ser posterior a `FechaHasta`.
- `Busqueda` filtra por nombre.
- Si `Busqueda` es numerica, tambien filtra por numero de lote exacto.
- Solo se listan lotes activos.
- El listado se ordena por `fechaGeneracion` descendente y luego por numero de lote descendente.
- `numeroLote` es el identificador visible del lote para UI y se envia como `string`.
- `creadoPor` representa al usuario que creo el lote; se deriva del token usado al momento de la creacion.

**Type**

```ts
type RespuestaListarLotes = {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  lotes: RespuestaLoteListado[];
};
```

**Request**

```json
null
```

Ejemplo:

- `GET /api/lotes?Busqueda=ANOVA&FechaDesde=2026-04-01T00:00:00.000-03:00&FechaHasta=2026-04-30T23:59:59.999-03:00&Pagina=1&ItemsPagina=10`

**Response 200**

```json
{
  "pagina": 1,
  "itemsPagina": 10,
  "totalItems": 1,
  "totalPaginas": 1,
  "lotes": [
    {
      "id": "019f21f7-3f52-7c51-a70a-4f9cc63c8f35",
      "numeroLote": "623",
      "nombre": "ANOVA-623",
      "descripcion": "Comercio mayorista con variacion negativa",
      "regimen": "Convenio Multilateral",
      "cantidadCuits": 47,
      "fechaGeneracion": "2026-04-12T15:30:00+00:00",
      "creadoPor": {
        "id": "0795e889-9d73-4126-a3d4-5d5441c4c6af",
        "nombre": "Carlos Lopez"
      }
    }
  ]
}
```

**Response 400**

```json
{
  "codigo": "lotes.listar.solicitud_invalida",
  "mensaje": "Los items por pagina deben estar entre 1 y 100.",
  "estado": 400
}
```

Mensajes posibles para `lotes.listar.solicitud_invalida`:

- `La pagina debe ser mayor a cero.`
- `Los items por pagina deben estar entre 1 y 100.`
- `La fecha desde no puede ser posterior a la fecha hasta.`

## Consultar lote

**Endpoint**

- `GET /api/lotes/{loteId}`

**Path params**

```ts
type SolicitudConsultarLote = {
  loteId: Uuid;
};
```

**Query params**

```ts
type SolicitudConsultarLoteQuery = {
  Pagina?: number;
  ItemsPagina?: number;
};
```

Valores por defecto:

- `Pagina`: `1`
- `ItemsPagina`: `10`

Reglas:

- `loteId` debe ser un UUID valido.
- `Pagina` debe ser mayor a `0`.
- `ItemsPagina` debe estar entre `1` y `100`.
- Solo se puede consultar un lote activo.
- `numeroLote` es el identificador visible del lote para UI y se envia como `string`.
- `creadoPor` representa al usuario que creo el lote; se deriva del token usado al momento de la creacion.
- `cantidadCuits` representa el total visual del lote.
- `totalItems` representa el total real de CUITs paginables para el detalle.
- `cuits` contiene solamente los CUITs de la pagina solicitada; `cuits.length` no debe usarse como total del lote.
- `orden` representa la posicion del CUIT dentro de la respuesta.
- No se exponen `contribuyenteId` ni el identificador interno de `lotes_contribuyentes`.

**Type**

```ts
type RespuestaConsultarLote = RespuestaDetalleLote;
```

**Request**

```json
null
```

Ejemplo:

- `GET /api/lotes/019f21f7-3f52-7c51-a70a-4f9cc63c8f35?Pagina=1&ItemsPagina=20`

**Response 200**

```json
{
  "id": "019f21f7-3f52-7c51-a70a-4f9cc63c8f35",
  "numeroLote": "623",
  "nombre": "ANOVA-623",
  "descripcion": "Comercio mayorista con variacion negativa",
  "regimen": "Convenio Multilateral",
  "pagina": 1,
  "itemsPagina": 20,
  "totalItems": 10000,
  "totalPaginas": 500,
  "cantidadCuits": 10000,
  "fechaGeneracion": "2026-04-12T15:30:00+00:00",
  "creadoPor": {
    "id": "0795e889-9d73-4126-a3d4-5d5441c4c6af",
    "nombre": "Carlos Lopez"
  },
  "cuits": [
    {
      "cuit": "30701234568",
      "razonSocial": null,
      "regimen": "Convenio Multilateral",
      "orden": 1
    }
  ]
}
```

**Response 400**

```json
{
  "codigo": "lotes.consultar.solicitud_invalida",
  "mensaje": "El identificador del lote no es valido.",
  "estado": 400
}
```

**Response 404**

```json
{
  "codigo": "lotes.consultar.no_encontrado",
  "mensaje": "No se encontro el lote solicitado.",
  "estado": 404
}
```

## Previsualizar carga de CUITs

**Endpoint**

- `POST /api/lotes/previsualizaciones`

**Content-Type**

- `multipart/form-data`

**Campos form-data**

```ts
type SolicitudPrevisualizarCargaLote = {
  archivo?: File | null;
  regimen?: RegimenSolicitudLote | null;
  cuits?: string[] | string | null;
};
```

Reglas:

- `regimen` es opcional en previsualizacion.
- Si se informa `regimen`, debe ser un valor permitido.
- Debe enviarse al menos una fuente: `archivo` o `cuits`.
- Si se envia `archivo`, debe tener nombre terminado en `.xlsx` y contenido valido.
- Si el archivo es invalido o esta vacio, responde `400` aunque existan CUITs manuales.
- Si solo se envian CUITs manuales, `nombreArchivo` vuelve `null`.
- `cantidadImportable` es igual a `cantidadValidos`.

**Type**

```ts
type EstadoCuitPrevisualizado = "valido" | "invalido" | "duplicado";

type RespuestaCuitPrevisualizado = {
  registro: number;
  cuitOriginal: string;
  cuitNormalizado: string | null;
  razonSocial: string | null;
  estado: EstadoCuitPrevisualizado;
  motivo: string | null;
};

type RespuestaPrevisualizacionLote = {
  nombreArchivo: string | null;
  registrosEncontrados: number;
  cantidadValidos: number;
  cantidadInvalidos: number;
  cantidadDuplicados: number;
  cantidadImportable: number;
  registros: RespuestaCuitPrevisualizado[];
};
```

**Request form-data**

```text
archivo: cuits.xlsx
regimen: CM
cuits: 30-70123456-8, 99-00000000-0
```

**Response 200**

```json
{
  "nombreArchivo": "cuits.xlsx",
  "registrosEncontrados": 4,
  "cantidadValidos": 2,
  "cantidadInvalidos": 1,
  "cantidadDuplicados": 1,
  "cantidadImportable": 2,
  "registros": [
    {
      "registro": 1,
      "cuitOriginal": "30-70123456-8",
      "cuitNormalizado": "30701234568",
      "razonSocial": null,
      "estado": "valido",
      "motivo": null
    },
    {
      "registro": 2,
      "cuitOriginal": "99-00000000-0",
      "cuitNormalizado": null,
      "razonSocial": null,
      "estado": "invalido",
      "motivo": "El CUIT no tiene un formato valido."
    },
    {
      "registro": 3,
      "cuitOriginal": "30-70123456-8",
      "cuitNormalizado": "30701234568",
      "razonSocial": null,
      "estado": "duplicado",
      "motivo": "El CUIT esta duplicado en la carga."
    },
    {
      "registro": 4,
      "cuitOriginal": "20-28456789-8",
      "cuitNormalizado": "20284567898",
      "razonSocial": null,
      "estado": "valido",
      "motivo": null
    }
  ]
}
```

**Response 400**

```json
{
  "codigo": "lotes.previsualizar.sin_fuentes",
  "mensaje": "Debe informar al menos una fuente de CUITs.",
  "estado": 400
}
```

Codigos posibles:

| Estado | Codigo | Mensaje |
| --- | --- | --- |
| 400 | `lotes.previsualizar.solicitud_invalida` | Mensaje de validacion, por ejemplo `El regimen informado no esta permitido.` |
| 400 | `lotes.previsualizar.archivo_invalido` | `El archivo informado no es valido.` |
| 400 | `lotes.previsualizar.sin_fuentes` | `Debe informar al menos una fuente de CUITs.` |
| 400 | `lotes.previsualizar.sin_cuits` | `No se encontraron CUITs para previsualizar.` |

## Crear lote

**Endpoint**

- `POST /api/lotes`

**Content-Type**

- `multipart/form-data`

**Campos form-data**

```ts
type SolicitudCrearLote = {
  nombre: string;
  descripcion?: string | null;
  regimen: RegimenSolicitudLote;
  archivo?: File | null;
  cuits?: string[] | string | null;
};
```

Reglas:

- `nombre` es obligatorio y no puede superar 120 caracteres.
- `descripcion` es opcional y no puede superar 500 caracteres.
- `regimen` es obligatorio.
- Debe enviarse al menos una fuente: `archivo` o `cuits`.
- Si se envia `archivo`, debe tener nombre terminado en `.xlsx` y contenido valido.
- Si el archivo es invalido o esta vacio, responde `400` aunque existan CUITs manuales.
- El nombre del lote no puede repetirse entre lotes activos.
- `nombre` y `descripcion` se guardan sin espacios externos.
- Si `descripcion` viene vacia o con espacios, se guarda como `null`.
- El backend toma el usuario creador desde el token y no acepta `creadoPorUsuarioId` en el form-data.
- El backend genera `id`, `numero`, `numeroFormateado` y `fechaGeneracion`.
- Solo se persisten CUITs validos y unicos.
- Si no queda ningun CUIT valido para importar, responde `400`.

**Request form-data**

```text
nombre: ANOVA-623
descripcion: Comercio mayorista con variacion negativa
regimen: CM
archivo: cuits.xlsx
cuits: 30-61234567-4, 20-28456789-8
```

**Response 201**

```json
{
  "id": "019f21f7-3f52-7c51-a70a-4f9cc63c8f35",
  "numero": 623,
  "numeroFormateado": "623",
  "nombre": "ANOVA-623",
  "descripcion": "Comercio mayorista con variacion negativa",
  "regimen": "Convenio Multilateral",
  "cantidadCuits": 3,
  "fechaGeneracion": "2026-04-12T15:30:00+00:00"
}
```

**Response 400**

```json
{
  "codigo": "lotes.crear.sin_cuits_validos",
  "mensaje": "El lote debe contener al menos un CUIT valido.",
  "estado": 400
}
```

**Response 409**

```json
{
  "codigo": "lotes.crear.nombre_duplicado",
  "mensaje": "Ya existe un lote con el nombre informado.",
  "estado": 409
}
```

Codigos posibles:

| Estado | Codigo | Mensaje |
| --- | --- | --- |
| 400 | `lotes.crear.solicitud_invalida` | Mensaje de validacion, por ejemplo `El nombre del lote es obligatorio.` |
| 400 | `lotes.crear.archivo_invalido` | `El archivo informado no es valido.` |
| 400 | `lotes.crear.sin_fuentes` | `Debe informar al menos una fuente de CUITs.` |
| 400 | `lotes.crear.sin_cuits_validos` | `El lote debe contener al menos un CUIT valido.` |
| 400 | `lotes.crear.regimen_invalido` | `El regimen informado no esta permitido para la creacion de lotes.` |
| 400 | `lotes.crear.no_se_pudo_crear` | `No se pudo crear el lote con los datos informados.` |
| 409 | `lotes.crear.nombre_duplicado` | `Ya existe un lote con el nombre informado.` |

Mensajes posibles para `lotes.crear.solicitud_invalida`:

- `El nombre del lote es obligatorio.`
- `El nombre del lote no puede superar 120 caracteres.`
- `La descripcion del lote no puede superar 500 caracteres.`
- `El regimen es obligatorio.`
- `El regimen informado no esta permitido.`
- `El usuario autenticado no es valido.`

## Errores transversales

**Type**

```ts
type RespuestaError = {
  codigo: string;
  mensaje: string;
  estado: number;
};
```

**Response 401**

```json
{
  "codigo": "autenticacion.no_autorizado",
  "mensaje": "La solicitud requiere un token valido o credenciales correctas.",
  "estado": 401
}
```

**Response 403**

```json
{
  "codigo": "autorizacion.prohibido",
  "mensaje": "El usuario autenticado no tiene permisos suficientes para acceder a este recurso.",
  "estado": 403
}
```
