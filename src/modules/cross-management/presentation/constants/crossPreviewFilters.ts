import type { ICrossFilterColumnKey } from '../../data/models/CrossManagement'

export interface CrossPreviewAnalysisFilterColumn {
  key: ICrossFilterColumnKey
  label: string
  title: string
}

export const CROSS_PREVIEW_ANALYSIS_FILTERABLE_COLUMNS: CrossPreviewAnalysisFilterColumn[] = [
  { key: 'declaredBase', label: 'B.I. 910', title: 'B.I. 910' },
  { key: 'pretendedBase', label: 'B.I. PRETENDIDA', title: 'B.I. Pretendida' },
  { key: 'difference', label: 'DIFERENCIA', title: 'Diferencia' },
  { key: 'tax', label: 'IMPUESTO ESTIMADO', title: 'Impuesto Estimado' },
  { key: 'netDebt', label: 'NETO A PAGAR', title: 'Neto a Pagar' }
]
