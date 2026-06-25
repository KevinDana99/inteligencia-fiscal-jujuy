import type {
  ICrossPreviewAnalysisRow,
  ICrossPreviewPlanRow
} from '../../data/models/CrossManagement'
import type { IntimationExportContributor } from '../hooks/intimation-export/useIntimationExportModal'

type RankedContributorRow = Pick<
  ICrossPreviewAnalysisRow,
  'taxpayerId' | 'cuit'
>

function normalizeContributorKey(row: {
  cuit: string
  id?: string
  taxpayerId?: string | null
}) {
  const taxpayerKey = row.taxpayerId?.trim()

  if (taxpayerKey) {
    return taxpayerKey
  }

  return row.cuit.replace(/\D/g, '') || row.id?.trim() || ''
}

export function groupIntimationExportContributors(
  rows: ICrossPreviewPlanRow[],
  rankingRows: RankedContributorRow[] = []
): IntimationExportContributor[] {
  const groups = new Map<string, IntimationExportContributor>()
  const rankingByContributorKey = new Map<string, number>()

  rankingRows.forEach((row, index) => {
    const key = normalizeContributorKey(row)

    if (key && !rankingByContributorKey.has(key)) {
      rankingByContributorKey.set(key, index)
    }
  })

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

  return Array.from(groups.values()).sort(
    (firstContributor, secondContributor) => {
      const firstRanking = rankingByContributorKey.get(
        normalizeContributorKey(firstContributor)
      )
      const secondRanking = rankingByContributorKey.get(
        normalizeContributorKey(secondContributor)
      )

      if (firstRanking === undefined && secondRanking === undefined) {
        return 0
      }

      if (firstRanking === undefined) {
        return 1
      }

      if (secondRanking === undefined) {
        return -1
      }

      return firstRanking - secondRanking
    }
  )
}
