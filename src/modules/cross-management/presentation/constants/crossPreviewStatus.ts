import type { ICrossPreviewAnalysisRow } from '../../data/models/CrossManagement'

export const CROSS_PREVIEW_STATUS_OPTIONS: Record<
  ICrossPreviewAnalysisRow['status'],
  string
> = {
  estado: '— Estado',
  relevante: '✓ Relevante',
  reproceso: '🔴 Reproceso'
}
