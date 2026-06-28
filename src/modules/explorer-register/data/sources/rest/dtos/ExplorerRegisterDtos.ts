export type ApiExplorerRegisterCellValueDto = string | number | null;

export interface ApiExplorerRegisterColumnDto {
  codigo: string;
  nombre: string;
  tipoDato: string;
  fija?: boolean;
}

export interface ApiExplorerRegisterFilterDto {
  codigo: string;
  nombre: string;
  tipoEntrada: string;
  temporal: boolean;
  disponible: boolean;
  motivoNoDisponible: string | null;
  valoresPermitidos: string[];
  columnasRelacionadas: string[];
  origenValores: string;
  dependencias: string[];
}

export interface ApiExplorerRegisterCatalogResponseDto {
  columnasFijas: ApiExplorerRegisterColumnDto[];
  columnasDisponibles: ApiExplorerRegisterColumnDto[];
  filtros: ApiExplorerRegisterFilterDto[];
}

export interface ApiExplorerRegisterExploreFilterRequestDto {
  codigo: string;
  valores: string[];
}

export interface ApiExplorerRegisterExploreRequestDto {
  pagina: number;
  itemsPagina: number;
  columnas: string[];
  filtros: ApiExplorerRegisterExploreFilterRequestDto[];
  fechaInicio?: string;
  fechaFin?: string;
  busqueda?: string | null;
}

export interface ApiExplorerRegisterAppliedCriteriaDto {
  fechaInicio: string | null;
  fechaFin: string | null;
  filtros: string[];
  origenPeriodo: string;
}

export interface ApiExplorerRegisterRowDto {
  cuit: string;
  razonSocial: string;
  valores: Record<string, ApiExplorerRegisterCellValueDto>;
}

export interface ApiExplorerRegisterExploreResponseDto {
  pagina: number;
  itemsPagina: number;
  totalItems: number;
  totalPaginas: number;
  columnas: ApiExplorerRegisterColumnDto[];
  criterioAplicado: ApiExplorerRegisterAppliedCriteriaDto;
  filas: ApiExplorerRegisterRowDto[];
}
