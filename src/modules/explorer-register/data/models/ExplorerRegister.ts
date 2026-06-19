export type ExplorerRegisterDataType = "texto" | "numero" | string;
export type ExplorerRegisterFilterInputType =
  | "multiseleccion"
  | "texto"
  | "switch"
  | string;
export type ExplorerRegisterValuesOrigin = "fijo" | "datos" | "libre" | string;
export type ExplorerRegisterPeriodOrigin =
  | "defecto36Meses"
  | "explicito"
  | string;
export type ExplorerRegisterCellValue = string | number | null;

export interface IExplorerRegisterColumn {
  code: string;
  name: string;
  dataType: ExplorerRegisterDataType;
  fixed: boolean;
}

export interface IExplorerRegisterFilter {
  code: string;
  name: string;
  inputType: ExplorerRegisterFilterInputType;
  temporal: boolean;
  available: boolean;
  unavailableReason: string | null;
  allowedValues: string[];
  relatedColumns: string[];
  valuesOrigin: ExplorerRegisterValuesOrigin;
  dependencies: string[];
}

export interface IExplorerRegisterCatalog {
  fixedColumns: IExplorerRegisterColumn[];
  availableColumns: IExplorerRegisterColumn[];
  filters: IExplorerRegisterFilter[];
}

export interface IExplorerRegisterExploreFilter {
  code: string;
  values: string[];
}

export interface IExplorerRegisterExplorePayload {
  page: number;
  itemsPerPage: number;
  columns: string[];
  filters: IExplorerRegisterExploreFilter[];
  startDate?: string;
  endDate?: string;
}

export interface IExplorerRegisterAppliedCriteria {
  startDate: string | null;
  endDate: string | null;
  filters: string[];
  periodOrigin: ExplorerRegisterPeriodOrigin;
}

export interface IExplorerRegisterRow {
  cuit: string;
  businessName: string;
  values: Record<string, ExplorerRegisterCellValue>;
}

export interface IExplorerRegisterExploreData {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  columns: IExplorerRegisterColumn[];
  appliedCriteria: IExplorerRegisterAppliedCriteria;
  rows: IExplorerRegisterRow[];
}

export interface IExplorerRegisterQueryResult<TData> {
  data: TData | null;
  error?: string;
  code?: string;
  status?: number;
}

export type ExplorerRegisterBatchContributorTypeOption = {
  value: string;
  label: string;
};
