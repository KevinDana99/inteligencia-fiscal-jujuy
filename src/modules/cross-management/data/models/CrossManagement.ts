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

export interface ICrossPreviewData extends ICrossManagementItem {
  relevantCountLabel: string
  indicators: ICrossPreviewIndicator[]
  planColumns: string[]
  planRows: ICrossPreviewPlanRow[]
  summaryRows: ICrossPreviewSummaryRow[]
  analysisRows: ICrossPreviewAnalysisRow[]
}
