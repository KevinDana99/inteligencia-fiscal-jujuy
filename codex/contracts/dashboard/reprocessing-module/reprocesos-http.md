# Contratos Gestion de Reprocesos

Todos los endpoints requieren `Authorization: Bearer <token>` de un usuario Analista Fiscal.

El Super Administrador no tiene acceso a estos recursos, salvo que tambien tenga la marca de Analista Fiscal.

Este documento contiene unicamente los contratos vigentes para frontend:

- `GET /api/reprocesos`
- `POST /api/reprocesos`
- `DELETE /api/reprocesos/{contribuyenteId}`

## Reglas generales

- Las rutas publicas cuelgan de `/api/reprocesos`.
- Los cuerpos JSON usan `camelCase`.
- `id`, `contribuyenteId` y `creadoPorUsuarioId` son UUID.
- Las fechas se serializan como fecha ISO 8601 con offset.
- Solo se listan marcas de reproceso activas.
- Marcar un contribuyente crea una marca activa nueva o reactiva una marca inactiva previa.
- Desmarcar un contribuyente realiza baja logica: la fila de `reprocesos` se conserva y `esta_activo` pasa a `false`.
- El backend toma el usuario creador desde el token y no acepta `creadoPorUsuarioId` en el body.
- `descripcion` es opcional; si se envia vacia o con espacios, se guarda como `null`.
- `descripcion` se guarda sin espacios externos y no puede superar 500 caracteres.
- No existe endpoint de detalle de reproceso implementado actualmente.
- No existe endpoint de ejecucion real de reproceso implementado actualmente.

## Cambios internos del modelo

El modelo actual de persistencia incorpora datos internos que no se reciben desde frontend:

- `reprocesos.id` / `Id`: lo genera el dominio al crear la marca o PostgreSQL si la fila se insertara sin id explicito.
- `reprocesos.fecha_creacion` / `FechaCreacion`: se define con la hora actual del backend al crear o reactivar.
- `reprocesos.creado_por_usuario_id` / `CreadoPorUsuarioId`: se toma del token autenticado. En el listado se expone dentro de `autor`.
- `reprocesos.contribuyente_id` / `ContribuyenteId`: referencia al contribuyente marcado.
- `reprocesos.esta_activo` / `EstaActivo`: define si la marca participa del listado y del desmarcado.
- La base actual no define una restriccion unica de marca activa por contribuyente.
- Al reactivar una marca inactiva, se reutiliza el mismo `id` de reproceso y se actualizan `descripcion`, `creado_por_usuario_id`, `fecha_creacion` y `esta_activo`.
- Al desmarcar, se conserva `descripcion`, `creado_por_usuario_id`, `contribuyente_id` y `fecha_creacion`; solo cambia `esta_activo`.

## Tipos comunes

```ts
type Uuid = string;
type FechaIso = string;

type RespuestaError = {
  codigo: string;
  mensaje: string;
  estado: number;
};

type TipoUltimoCruce =
  | "CONTROL_DESVIO_BI_REGIMEN_GRAL"
  | "CONTROL_DESVIO_BI_REGIMEN_CM"
  | "CONTROL_BI_DECLARADA_POR_ACTIVIDAD"
  | "CONTROL_CREDITOS"
  | "CONTROL_SAF"
  | "CONTROL_AGENTES"
  | "DETECCION_CONTRIBUYENTES_NO_INSCRIPTOS"
  | "COMPARACION_BASES_PRESUNTIVAS"
  | "CONTRIBUYENTES_MAS_DOS_INMUEBLES";

type AutorReproceso = {
  creadoPorUsuarioId: Uuid;
  nombre: string;
};

type UltimoCruceReproceso = {
  id: Uuid;
  nombre: TipoUltimoCruce | string;
};

type ContribuyenteReproceso = {
  contribuyenteId: Uuid;
  cuit: string;
  razonSocial: string;
};

type RespuestaReprocesoListado = {
  id: Uuid;
  fechaCreacion: FechaIso;
  descripcion: string | null;
  autor: AutorReproceso;
  ultimoCruce: UltimoCruceReproceso | null;
  contribuyente: ContribuyenteReproceso;
};

type RespuestaReprocesoMarcado = {
  id: Uuid;
  contribuyenteId: Uuid;
  descripcion: string | null;
  estaActivo: boolean;
  fechaCreacionUtc: FechaIso;
};
```

## Listar contribuyentes en reproceso

**Endpoint**

- `GET /api/reprocesos`

**Query params**

```ts
type SolicitudListarReprocesos = {
  busqueda?: string | null;
  pagina?: number;
  itemsPagina?: number;
};
```

Valores por defecto:

- `pagina`: `1`
- `itemsPagina`: `10`

Reglas:

- `pagina` debe ser mayor a `0`.
- `itemsPagina` debe estar entre `1` y `100`.
- `busqueda` vacia o con solo espacios se ignora.
- `busqueda` filtra parcialmente por `cuit` o `razonSocial`.
- La busqueda por `razonSocial` no distingue mayusculas y minusculas.
- Solo se listan reprocesos activos.
- `totalContribuyentes` se calcula despues de aplicar `busqueda` y antes de paginar.
- Aunque el campo se llama `totalContribuyentes`, el valor actual cuenta registros activos de reproceso devueltos por la consulta.
- Si hay busqueda, se priorizan coincidencias exactas, luego coincidencias iniciales y luego coincidencias contenidas.
- Sin busqueda, el listado se ordena por `fechaCreacion` descendente y luego por `id` ascendente.
- `ultimoCruce` puede ser `null` cuando el contribuyente no tiene resultados de cruces previos.

**Type**

```ts
type RespuestaListarReprocesos = {
  pagina: number;
  itemsPagina: number;
  totalContribuyentes: number;
  totalPaginas: number;
  reprocesos: RespuestaReprocesoListado[];
};
```

**Request**

```json
null
```

Ejemplo:

- `GET /api/reprocesos?busqueda=la%20lech&pagina=1&itemsPagina=10`

**Response 200**

```json
{
  "pagina": 1,
  "itemsPagina": 10,
  "totalContribuyentes": 1,
  "totalPaginas": 1,
  "reprocesos": [
    {
      "id": "6c97da7c-2aa9-4d6b-bb3d-f5d9c18f52a3",
      "fechaCreacion": "2026-05-18T15:20:30+00:00",
      "descripcion": "Revisar cruce de base imponible",
      "autor": {
        "creadoPorUsuarioId": "a9fd29ff-a9c9-4f2f-bbd6-1f8050e27fa8",
        "nombre": "Ana Fiscal"
      },
      "ultimoCruce": {
        "id": "9f9c316f-f459-43f0-bc10-791e2d1d7f60",
        "nombre": "CONTROL_DESVIO_BI_REGIMEN_GRAL"
      },
      "contribuyente": {
        "contribuyenteId": "be0f84f1-dcc7-43b5-9ce8-6d0d845f777a",
        "cuit": "30712345678",
        "razonSocial": "La Lechera Anonima"
      }
    }
  ]
}
```

**Response 200 sin resultados**

```json
{
  "pagina": 1,
  "itemsPagina": 10,
  "totalContribuyentes": 0,
  "totalPaginas": 0,
  "reprocesos": []
}
```

**Response 400**

```json
{
  "codigo": "reprocesos.listar.solicitud_invalida",
  "mensaje": "Los items por pagina deben estar entre 1 y 100.",
  "estado": 400
}
```

Mensajes posibles para `reprocesos.listar.solicitud_invalida`:

- `La pagina debe ser mayor a cero.`
- `Los items por pagina deben estar entre 1 y 100.`

## Marcar contribuyente en reproceso

**Endpoint**

- `POST /api/reprocesos`

**Content-Type**

- `application/json`

**Body**

```ts
type SolicitudMarcarContribuyenteEnReproceso = {
  contribuyenteId: Uuid;
  descripcion?: string | null;
};
```

Reglas:

- `contribuyenteId` es obligatorio y debe ser un UUID valido.
- El contribuyente debe existir en la tabla `contribuyentes`.
- `descripcion` es opcional y no puede superar 500 caracteres.
- `descripcion` se guarda sin espacios externos.
- Si `descripcion` viene vacia o con espacios, se guarda como `null`.
- El backend toma el usuario creador desde el token y no acepta `creadoPorUsuarioId` en el body.
- Si existe una marca inactiva para el contribuyente, se reactiva la mas reciente y responde `200 OK`.
- Si no existe marca inactiva para el contribuyente, se crea una marca nueva y responde `201 Created`.
- El endpoint no es idempotente frente a reenvios: la implementacion actual no responde `409 Conflict` por una marca activa existente.
- No se devuelve `fueReactivado`; ese dato es interno del caso de uso.
- No se define respuesta de conflicto por marca activa existente.

**Request**

```json
{
  "contribuyenteId": "be0f84f1-dcc7-43b5-9ce8-6d0d845f777a",
  "descripcion": "Revisar cruce de base imponible"
}
```

**Response 201**

Se devuelve cuando se crea una marca nueva.

```json
{
  "id": "6c97da7c-2aa9-4d6b-bb3d-f5d9c18f52a3",
  "contribuyenteId": "be0f84f1-dcc7-43b5-9ce8-6d0d845f777a",
  "descripcion": "Revisar cruce de base imponible",
  "estaActivo": true,
  "fechaCreacionUtc": "2026-05-18T15:20:30+00:00"
}
```

**Response 200**

Se devuelve cuando se reactiva una marca inactiva existente.

```json
{
  "id": "6c97da7c-2aa9-4d6b-bb3d-f5d9c18f52a3",
  "contribuyenteId": "be0f84f1-dcc7-43b5-9ce8-6d0d845f777a",
  "descripcion": null,
  "estaActivo": true,
  "fechaCreacionUtc": "2026-05-18T15:20:30+00:00"
}
```

**Response 400**

```json
{
  "codigo": "reprocesos.marcar.solicitud_invalida",
  "mensaje": "El contribuyente informado no es valido.",
  "estado": 400
}
```

**Response 404**

```json
{
  "codigo": "reprocesos.marcar.contribuyente_no_encontrado",
  "mensaje": "No existe el contribuyente informado.",
  "estado": 404
}
```

Mensajes posibles para `reprocesos.marcar.solicitud_invalida`:

- `El contribuyente informado no es valido.`
- `El usuario autenticado no es valido.`
- `La descripcion del reproceso no puede superar 500 caracteres.`

## Desmarcar contribuyente en reproceso

**Endpoint**

- `DELETE /api/reprocesos/{contribuyenteId}`

**Path params**

```ts
type SolicitudDesmarcarContribuyenteEnReproceso = {
  contribuyenteId: Uuid;
};
```

Reglas:

- `contribuyenteId` debe ser un UUID valido.
- El contribuyente debe existir en la tabla `contribuyentes`.
- El contribuyente debe tener una marca activa de reproceso.
- La operacion no borra la fila; solo deja `estaActivo` en `false`.
- La operacion no devuelve cuerpo exitoso.

**Request**

```json
null
```

Ejemplo:

- `DELETE /api/reprocesos/be0f84f1-dcc7-43b5-9ce8-6d0d845f777a`

**Response 204**

```text
Sin cuerpo.
```

**Response 400**

```json
{
  "codigo": "reprocesos.desmarcar.solicitud_invalida",
  "mensaje": "El contribuyente informado no es valido.",
  "estado": 400
}
```

**Response 404 por contribuyente inexistente**

```json
{
  "codigo": "reprocesos.desmarcar.contribuyente_no_encontrado",
  "mensaje": "No existe el contribuyente informado.",
  "estado": 404
}
```

**Response 404 por marca activa inexistente**

```json
{
  "codigo": "reprocesos.desmarcar.marca_activa_no_encontrada",
  "mensaje": "El contribuyente informado no tiene una marca de reproceso activa.",
  "estado": 404
}
```

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
