import type { ICrossPreviewPlanRow } from '../../data/models/CrossManagement'
import { INTIMATION_EXPORT_COLUMN_CELL_INDEX_BY_ID } from '../constants/intimationExportColumns'
import { INTIMATION_EXPORT_EMPTY_VALUE } from '../constants/intimationExportLabels'

type IntimationExportContributor = Pick<
  ICrossPreviewPlanRow,
  'id' | 'cuit' | 'businessName' | 'cells' | 'values'
>

export function resolveIntimationExportColumnValue(
  contributor: IntimationExportContributor | undefined,
  columnId: string
) {
  if (!contributor) {
    return INTIMATION_EXPORT_EMPTY_VALUE
  }

  const valueByKey = contributor.values[columnId]

  if (valueByKey) {
    return valueByKey
  }

  const index = INTIMATION_EXPORT_COLUMN_CELL_INDEX_BY_ID[columnId]

  if (typeof index !== 'number') {
    return INTIMATION_EXPORT_EMPTY_VALUE
  }

  return contributor.cells[index] ?? INTIMATION_EXPORT_EMPTY_VALUE
}
