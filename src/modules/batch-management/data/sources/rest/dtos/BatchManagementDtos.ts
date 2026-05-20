export type ApiBatchRegime = 'Convenio Multilateral' | 'Regimen Local';
export type ApiBatchRequestRegime =
  | 'CM'
  | 'Convenio Multilateral'
  | 'ConvenioMultilateral'
  | 'Convenio Multilateral (CM)'
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
  id: string;
  numero: number;
  numeroFormateado: string;
  nombre: string;
  descripcion: string | null;
  regimen: ApiBatchRegime;
  cantidadCuits: number;
  fechaGeneracion: string;
}

export interface ApiBatchErrorDto {
  codigo: string;
  mensaje: string;
  estado: number;
}
