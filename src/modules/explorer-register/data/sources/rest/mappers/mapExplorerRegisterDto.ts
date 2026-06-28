import type {
  IExplorerRegisterAppliedCriteria,
  IExplorerRegisterCatalog,
  IExplorerRegisterColumn,
  IExplorerRegisterExploreData,
  IExplorerRegisterExplorePayload,
  IExplorerRegisterFilter,
  IExplorerRegisterRow
} from '../../../models/ExplorerRegister';
import type {
  ApiExplorerRegisterAppliedCriteriaDto,
  ApiExplorerRegisterCatalogResponseDto,
  ApiExplorerRegisterColumnDto,
  ApiExplorerRegisterExploreRequestDto,
  ApiExplorerRegisterExploreResponseDto,
  ApiExplorerRegisterFilterDto,
  ApiExplorerRegisterRowDto
} from '../dtos/ExplorerRegisterDtos';

function mapExplorerRegisterColumnDto(
  dto: ApiExplorerRegisterColumnDto,
  fixedFallback: boolean
): IExplorerRegisterColumn {
  return {
    code: dto.codigo,
    name: dto.nombre,
    dataType: dto.tipoDato,
    fixed: dto.fija ?? fixedFallback
  };
}

function mapExplorerRegisterFilterDto(
  dto: ApiExplorerRegisterFilterDto
): IExplorerRegisterFilter {
  return {
    code: dto.codigo,
    name: dto.nombre,
    inputType: dto.tipoEntrada,
    temporal: dto.temporal,
    available: dto.disponible,
    unavailableReason: dto.motivoNoDisponible,
    allowedValues: dto.valoresPermitidos ?? [],
    relatedColumns: dto.columnasRelacionadas ?? [],
    valuesOrigin: dto.origenValores,
    dependencies: dto.dependencias ?? []
  };
}

export function mapExplorerRegisterCatalogDto(
  dto: ApiExplorerRegisterCatalogResponseDto
): IExplorerRegisterCatalog {
  return {
    fixedColumns: dto.columnasFijas.map((column) =>
      mapExplorerRegisterColumnDto(column, true)
    ),
    availableColumns: dto.columnasDisponibles.map((column) =>
      mapExplorerRegisterColumnDto(column, false)
    ),
    filters: dto.filtros.map(mapExplorerRegisterFilterDto)
  };
}

export function mapExplorerRegisterExploreRequestDto(
  payload: IExplorerRegisterExplorePayload
): ApiExplorerRegisterExploreRequestDto {
  const search = payload.search?.trim();

  return {
    pagina: payload.page,
    itemsPagina: payload.itemsPerPage,
    columnas: payload.columns,
    filtros: payload.filters.map((filter) => ({
      codigo: filter.code,
      valores: filter.values
    })),
    ...(payload.startDate ? { fechaInicio: payload.startDate } : {}),
    ...(payload.endDate ? { fechaFin: payload.endDate } : {}),
    ...(search ? { busqueda: search } : {})
  };
}

function mapExplorerRegisterAppliedCriteriaDto(
  dto: ApiExplorerRegisterAppliedCriteriaDto
): IExplorerRegisterAppliedCriteria {
  return {
    startDate: dto.fechaInicio,
    endDate: dto.fechaFin,
    filters: dto.filtros,
    periodOrigin: dto.origenPeriodo
  };
}

function mapExplorerRegisterRowDto(
  dto: ApiExplorerRegisterRowDto
): IExplorerRegisterRow {
  return {
    cuit: dto.cuit,
    businessName: dto.razonSocial,
    values: dto.valores ?? {}
  };
}

export function mapExplorerRegisterExploreResponseDto(
  dto: ApiExplorerRegisterExploreResponseDto
): IExplorerRegisterExploreData {
  return {
    page: dto.pagina,
    itemsPerPage: dto.itemsPagina,
    totalItems: dto.totalItems,
    totalPages: dto.totalPaginas,
    columns: dto.columnas.map((column) =>
      mapExplorerRegisterColumnDto(column, false)
    ),
    appliedCriteria: mapExplorerRegisterAppliedCriteriaDto(
      dto.criterioAplicado
    ),
    rows: dto.filas.map(mapExplorerRegisterRowDto)
  };
}
