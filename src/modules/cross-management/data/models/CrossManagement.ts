export interface ICrossManagementItem {
  id: string
  name: string
  source: 'Lote' | 'Padrón'
  sourceRef: string
  period: string
  cuitCount: number
  date: string
}

export type ICrossManagementItems = Array<ICrossManagementItem>

export interface ICrossManagementListParams {
  search?: string | null
  page?: number
  itemsPerPage?: number
}

export interface ICrossManagementListData {
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  items: ICrossManagementItems
}

export interface ICrossResultSource {
  code: string
  sourcePreparationId: string | null
  coverageStatus: string
  required: boolean
}

export interface ICrossResultItem {
  id: string
  executionId: number
  crossCode: string
  crossVersion: string
  taxpayerId: string
  cuit: string
  granularity: string
  period: string
  periodFrom: string
  periodTo: string
  calculationStatus: string
  metrics: Record<string, unknown>
  dynamicDetail: Record<string, unknown>
  sources: ICrossResultSource[]
  nonCalculableFields: string[]
  createdAt: string
}

export interface ICrossResultsListParams {
  page?: number
  itemsPerPage?: number
}

export interface ICrossResultsListData {
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  results: ICrossResultItem[]
}

export interface ICrossPreviewIndicator {
  id: string
  label: string
  tone: 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'darkBlue'
}

export interface ICrossPreviewPlanRow {
  id: string
  cuit: string
  businessName: string
  cells: string[]
}

export interface ICrossPreviewSummaryRow {
  regime: string
  declaredBase: string
  pretendedBase: string
  difference: string
  tax: string
  netDebt: string
}

export interface ICrossPreviewAnalysisRow {
  cuit: string
  businessName: string
  declaredBase: string
  pretendedBase: string
  difference: string
  tax: string
  netDebt: string
  status: 'estado' | 'relevante' | 'reproceso'
}

export type ICrossFilterColumnKey =
  | 'declaredBase'
  | 'pretendedBase'
  | 'difference'
  | 'tax'
  | 'netDebt'

export type ICrossFilterOperator =
  | 'mayor'
  | 'mayor_igual'
  | 'menor'
  | 'menor_igual'
  | 'igual'
  | 'distinto'

export type ICrossFilterConnector = 'Y' | 'O'

export interface ICrossFilterCondition {
  operator: ICrossFilterOperator | ''
  value: string
}

export interface ICrossColumnFilterState {
  connector: ICrossFilterConnector
  primary: ICrossFilterCondition
  secondary: ICrossFilterCondition
}

export type ICrossColumnFilters = Partial<
  Record<ICrossFilterColumnKey, ICrossColumnFilterState>
>

export interface ICrossAnalysisFilterPayload {
  crossId: string
  filters: ICrossColumnFilters
}

export interface ICrossAnalysisFilterData {
  rows: ICrossPreviewAnalysisRow[]
}

export interface ICrossAnalysisFilterQueryResult {
  data: ICrossAnalysisFilterData | null
  error?: string
  code?: string
  status?: number
}

export interface ICrossManagementQueryResult<TData> {
  data: TData | null
  error?: string
  code?: string
  status?: number
}

export interface ICrossPreviewData extends ICrossManagementItem {
  relevantCountLabel: string
  indicators: ICrossPreviewIndicator[]
  planColumns: string[]
  planRows: ICrossPreviewPlanRow[]
  summaryRows: ICrossPreviewSummaryRow[]
  analysisRows: ICrossPreviewAnalysisRow[]
}
