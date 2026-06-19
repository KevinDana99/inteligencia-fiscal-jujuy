import type { ICrossPreviewPlanRow } from '../../data/models/CrossManagement'
import type { IntimationExportContributor } from '../hooks/intimation-export/useIntimationExportModal'

function normalizeContributorKey(row: ICrossPreviewPlanRow) {
  return (row.taxpayerId ?? row.cuit.replace(/\D/g, '')) || row.id
}

export function groupIntimationExportContributors(
  rows: ICrossPreviewPlanRow[]
): IntimationExportContributor[] {
  const groups = new Map<string, IntimationExportContributor>()

  rows.forEach((row) => {
    const key = normalizeContributorKey(row)
    const existingContributor = groups.get(key)

    if (existingContributor) {
      existingContributor.planillaRows.push(row)
      return
    }

    groups.set(key, {
      ...row,
      planillaRows: [row]
    })
  })

  return Array.from(groups.values())
}
