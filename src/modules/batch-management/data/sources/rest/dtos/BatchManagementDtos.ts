export type ApiBatchRegime =
  | 'Convenio Multilateral'
  | 'Regimen Local'
  | 'No inscripto';
export type ApiBatchRequestRegime =
  | 'Convenio Multilateral'
  | 'ConvenioMultilateral'
  | 'Regimen Local'
  | 'RegimenLocal';

export interface ApiBatchAuthorDto {
  id: string;
  nombre: string;
}

export interface ApiBatchListItemDto {
  id: string;
  numeroLote: string;
  nombre: string;
  descripcion: string | null;
  regimen: ApiBatchRegime;
  cantidadCuits: number;
  fechaGeneracion: string;
  creadoPor: ApiBatchAuthorDto;
}

export interface ApiBatchListResponseDto {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  lotes: ApiBatchListItemDto[];
}

export interface ApiBatchCuitDto {
  cuit: string;
  razonSocial: string | null;
  RazonSocial?: string | null;
  razon_social?: string | null;
  regimen: ApiBatchRegime;
  orden: number;
}

export interface ApiBatchDetailResponseDto {
  id: string;
  numeroLote: string;
  nombre: string;
  descripcion: string | null;
  regimen: ApiBatchRegime;
  fechaGeneracion: string;
  creadoPor: ApiBatchAuthorDto;
  cuits: ApiBatchCuitDto[];
  cantidadCuits: number;
}

export type ApiPreviewStatusDto = 'valido' | 'invalido' | 'duplicado';

export interface ApiBatchPreviewRecordDto {
  registro: number;
  cuitOriginal: string;
  cuitNormalizado: string | null;
  razonSocial: string | null;
  RazonSocial?: string | null;
  razon_social?: string | null;
  estado: ApiPreviewStatusDto;
  motivo: string | null;
}

export interface ApiBatchPreviewResponseDto {
  nombreArchivo: string | null;
  registrosEncontrados: number;
  cantidadValidos: number;
  cantidadInvalidos: number;
  cantidadDuplicados: number;
  cantidadImportable: number;
  registros: ApiBatchPreviewRecordDto[];
}

export interface ApiBatchCreateResponseDto {
  id?: string | null;
  numero?: number | null;
  numeroFormateado?: string | null;
  numeroLote?: string | null;
  nombre: string;
  descripcion: string | null;
  regimen: ApiBatchRegime;
  cantidadCuits: number;
  fechaGeneracion: string;
  creadoPor?: ApiBatchAuthorDto | null;
}

export interface ApiBatchContributorRequestDto {
  cuit: string;
  razonSocial: string | null;
  regimen: string | null;
}

export interface ApiAddContributorToBatchRequestDto {
  loteId: string;
  contribuyente: ApiBatchContributorRequestDto;
}

export interface ApiExecuteBatchCrossRequestDto {
  versionCruce: string;
  tipoOrigen: 'por_lote';
  loteId: string;
  contribuyenteId: null;
  periodoInicio: string;
  periodoFin: string;
  parametros: Record<string, string | null>;
}

export interface ApiExecuteBatchCrossResponseDto {
  ejecucionId: number;
  codigoCruce: string;
  versionCruce: string;
  estado: string;
  claveIdempotencia: string;
  fechaSolicitud: string;
}

export interface ApiBatchAvailableCrossDto {
  id?: string | number | null;
  codigoCruce?: string | null;
  codigo?: string | null;
  code?: string | null;
  clave?: string | null;
  nombreCruce?: string | null;
  nombre?: string | null;
  name?: string | null;
  etiqueta?: string | null;
  titulo?: string | null;
  descripcion?: string | null;
  versionCruce?: string | number | null;
  version?: string | number | null;
  versionActual?: string | number | null;
  periodicidad?: string | null;
  tipoPeriodicidad?: string | null;
  frecuencia?: string | null;
  granularidad?: string | null;
  periodo?: string | null;
  tipoPeriodo?: string | null;
}

export type ApiBatchAvailableCrossesResponseDto =
  | ApiBatchAvailableCrossDto[]
  | {
      crucesMensuales?: ApiBatchAvailableCrossDto[] | null;
      CrucesMensuales?: ApiBatchAvailableCrossDto[] | null;
      crucesAnuales?: ApiBatchAvailableCrossDto[] | null;
      CrucesAnuales?: ApiBatchAvailableCrossDto[] | null;
      cruces?: ApiBatchAvailableCrossDto[] | null;
      items?: ApiBatchAvailableCrossDto[] | null;
      data?: ApiBatchAvailableCrossDto[] | { cruces?: ApiBatchAvailableCrossDto[] | null } | null;
      resultados?: ApiBatchAvailableCrossDto[] | null;
    };

export interface ApiBatchErrorDto {
  codigo: string;
  mensaje: string;
  estado: number;
}
