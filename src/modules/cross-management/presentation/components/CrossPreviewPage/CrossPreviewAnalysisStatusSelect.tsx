import type {
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_STATUS_OPTIONS } from '../../constants/crossPreviewStatus'
import { useCrossPreviewStatusSelect } from '../../hooks/cross-preview/useCrossPreviewStatusSelect'
import type { CrossPreviewStatus } from '../../hooks/useCrossPreview'

interface CrossPreviewAnalysisStatusSelectProps {
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  row: ICrossPreviewAnalysisRow
  status: CrossPreviewStatus
}

export function CrossPreviewAnalysisStatusSelect({
  onRequestStatusChange,
  row,
  status
}: CrossPreviewAnalysisStatusSelectProps) {
  const { className, handleStatusChange } = useCrossPreviewStatusSelect({
    onRequestStatusChange,
    row,
    status
  })

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      className={className}
    >
      <option value="estado">{CROSS_PREVIEW_STATUS_OPTIONS.estado}</option>
      <option value="relevante">{CROSS_PREVIEW_STATUS_OPTIONS.relevante}</option>
      <option value="reproceso">{CROSS_PREVIEW_STATUS_OPTIONS.reproceso}</option>
    </select>
  )
}
