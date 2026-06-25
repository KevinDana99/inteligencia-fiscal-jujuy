export type ICrossAvailableView = 'resumen' | 'planilla'

export interface ICrossManagementItem {
  id: string
  name: string
  source: 'Lote' | 'Padrón'
  sourceRef: string
  period: string
  cuitCount: number
  date: string
  status: string
  viewsAvailable: ICrossAvailableView[]
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

export type ICrossDynamicColumnType = 'string' | 'numero' | 'fecha'

export type ICrossFilterOperator =
  | 'mayorQue'
  | 'mayorOIgualQue'
  | 'menorQue'
  | 'menorOIgualQue'
  | 'igualA'
  | 'distintoDe'
  | 'contiene'
  | 'noContiene'
  | 'empiezaCon'
  | 'terminaCon'
  | 'esNulo'
  | 'noEsNulo'
  | 'posteriorA'
  | 'posteriorOIgualA'
  | 'anteriorA'
  | 'anteriorOIgualA'

export type ICrossFilterConnector = 'Y' | 'O'

export type ICrossFilterColumnKey = string

export interface ICrossDynamicColumn {
  key: string
  type: ICrossDynamicColumnType
  label: string
  isFilterable: boolean
  allowedOperators: ICrossFilterOperator[]
}

export interface ICrossDynamicValuesRow {
  texts: Record<string, string | null>
  dates: Record<string, string | null>
  metrics: Record<string, number | null>
}

export interface ICrossPaginationData {
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface ICrossPlanillaRequestParams {
  page?: number
  itemsPerPage?: number
  search?: string | null
}

export interface ICrossPlanillaSchema {
  columns: ICrossDynamicColumn[]
}

export interface ICrossPlanillaRow extends ICrossDynamicValuesRow {
  cuit: string
  businessName: string | null
  taxpayerId: string | null
}

export interface ICrossPlanillaData extends ICrossPaginationData {
  schema: ICrossPlanillaSchema | null
  rows: ICrossPlanillaRow[]
}

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

export interface ICrossResumenFilterCondition {
  operator: ICrossFilterOperator
  value: string
}

export interface ICrossResumenColumnFilter {
  field: string
  connector: ICrossFilterConnector
  conditions: ICrossResumenFilterCondition[]
}

export interface ICrossResumenSectionRequestParams {
  page?: number
  itemsPerPage?: number
  search?: string | null
  columnFilters?: ICrossResumenColumnFilter[]
}

export interface ICrossResumenRequestParams {
  page?: number
  itemsPerPage?: number
  search?: string | null
  columnFilters?: ICrossResumenColumnFilter[]
  sections?: Record<string, ICrossResumenSectionRequestParams>
}

export interface ICrossResumenMetadata {
  executionId: number | null
  crossCode: string | null
  crossVersion: string | null
  title: string | null
  subtitle: string | null
  batchOrCuit: string | null
  period: string | null
  totalCuits: number
  relevantCuits: number | null
}

export interface ICrossResumenBlock {
  key: string
  title: string
  columns: ICrossDynamicColumn[]
  rows: ICrossDynamicValuesRow[]
}

export interface ICrossAnalysisRow extends ICrossDynamicValuesRow {
  cuit: string
  businessName: string | null
  taxpayerId?: string | null
  relevanceStatus: string | null
}

export interface ICrossAnalysisData extends ICrossPaginationData {
  rows: ICrossAnalysisRow[]
}

export type ICrossResumenSectionType = 'resumen' | 'grilla'

export interface ICrossResumenSection {
  key: string
  title: string
  type: ICrossResumenSectionType
  columns: ICrossDynamicColumn[]
  summaryRows: ICrossDynamicValuesRow[] | null
  grid: ICrossAnalysisData | null
}

export interface ICrossResumenData {
  metadata: ICrossResumenMetadata
  sections: ICrossResumenSection[]
  summaryBlocks: ICrossResumenBlock[] | null
  analysisSchema: ICrossPlanillaSchema | null
  analysis: ICrossAnalysisData
}

export interface ICrossPreviewIndicator {
  id: string
  label: string
  tone: 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'darkBlue'
}

export interface ICrossPreviewPlanRow {
  id: string
  taxpayerId: string | null
  cuit: string
  businessName: string
  values: Record<string, string>
  cells: string[]
}

export interface ICrossPreviewSummaryRow {
  id: string
  values: Record<string, string>
}

export interface ICrossPreviewSummaryBlock {
  id: string
  title: string
  columns: ICrossDynamicColumn[]
  rows: ICrossPreviewSummaryRow[]
}

export interface ICrossPreviewAnalysisRow {
  id: string
  cuit: string
  businessName: string
  taxpayerId?: string | null
  values: Record<string, string>
  status: 'estado' | 'relevante' | 'reproceso'
}

export interface ICrossPreviewResumenSummarySection {
  id: string
  title: string
  type: 'resumen'
  columns: ICrossDynamicColumn[]
  rows: ICrossPreviewSummaryRow[]
}

export interface ICrossPreviewResumenGridSection {
  id: string
  title: string
  type: 'grilla'
  columns: ICrossDynamicColumn[]
  rows: ICrossPreviewAnalysisRow[]
  pagination: ICrossPaginationData
}

export type ICrossPreviewResumenSection =
  | ICrossPreviewResumenSummarySection
  | ICrossPreviewResumenGridSection

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

export interface ICrossManagementCommandResult<TData = null> {
  success: boolean
  data: TData | null
  error?: string
  code?: string
  status?: number
}

export type ICrossExecutionOriginType = 'por_lote' | 'individual'

export interface ICrossExecutionPayload {
  crossCode: string
  crossVersion: string
  originType: ICrossExecutionOriginType
  batchId?: string | null
  contributorId?: string | null
  periodFrom: string
  periodTo: string
  parameters?: Record<string, string | null>
}

export interface ICrossExecutionSummary {
  executionId: number
  crossCode: string
  crossVersion: string
  status: string
  idempotencyKey: string
  requestedAt: string
}

export type IIntimationDocumentFormat = 'Pdf' | 'Docx'

export type IIntimationSpreadsheetCellValue = string | number | boolean

export type IIntimationSpreadsheetRow = Record<
  string,
  IIntimationSpreadsheetCellValue
>

export interface IIntimationDocumentContributorPayload {
  id: string
  cuit: string
  razonSocial?: string | null
}

export interface IIntimationDocumentSnapshot {
  asunto: string
  saludo: string
  cuerpo: string
  fuenteInformacion?: string | null
  fechaCorte: string
}

export interface IGenerateIntimationDocumentPayload {
  contribuyente: IIntimationDocumentContributorPayload
  formato: IIntimationDocumentFormat
  snapshotIntimacion?: IIntimationDocumentSnapshot | null
  columnasSeleccionadas: string[]
  filasPlanilla: IIntimationSpreadsheetRow[]
}

export interface IIntimationDocumentGeneratedSummary {
  documentId: string
  downloadUrl: string
}

export interface ICrossPreviewData extends ICrossManagementItem {
  executionId: number
  relevantCountLabel: string
  indicators: ICrossPreviewIndicator[]
  planColumns: ICrossDynamicColumn[]
  planRows: ICrossPreviewPlanRow[]
  planPagination: ICrossPaginationData
  resumenSections: ICrossPreviewResumenSection[]
  summaryBlocks: ICrossPreviewSummaryBlock[]
  analysisColumns: ICrossDynamicColumn[]
  analysisRows: ICrossPreviewAnalysisRow[]
  analysisPagination: ICrossPaginationData
}
