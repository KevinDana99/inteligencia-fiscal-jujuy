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

export interface ICrossPreviewData extends ICrossManagementItem {
  relevantCountLabel: string
  indicators: ICrossPreviewIndicator[]
  planColumns: string[]
  planRows: ICrossPreviewPlanRow[]
  summaryRows: ICrossPreviewSummaryRow[]
  analysisRows: ICrossPreviewAnalysisRow[]
}
