import type {
  ICrossPreviewAnalysisRow,
  ICrossPreviewPlanRow
} from '../../data/models/CrossManagement'
import type { IntimationExportContributor } from '../hooks/intimation-export/useIntimationExportModal'

type RankedContributorRow = Pick<
  ICrossPreviewAnalysisRow,
  'taxpayerId' | 'cuit'
>

type ContributorKeySource = {
  cuit: string
  id?: string
  taxpayerId?: string | null
}

function getContributorKeys(row: ContributorKeySource) {
  const cuitKey = row.cuit.replace(/\D/g, '')
  const keys = [row.taxpayerId?.trim(), cuitKey, row.id?.trim()].filter(
    (key): key is string => Boolean(key)
  )

  return Array.from(new Set(keys))
}

function registerContributorKeys(
  keys: string[],
  contributor: IntimationExportContributor,
  contributorsByKey: Map<string, IntimationExportContributor>
) {
  keys.forEach((key) => {
    contributorsByKey.set(key, contributor)
  })
}

function resolveExistingContributor(
  keys: string[],
  contributorsByKey: Map<string, IntimationExportContributor>
) {
  for (const key of keys) {
    const contributor = contributorsByKey.get(key)

    if (contributor) {
      return contributor
    }
  }

  return null
}

function resolveContributorRanking(
  contributor: IntimationExportContributor,
  rankingByContributorKey: Map<string, number>
) {
  const rankings = getContributorKeys(contributor)
    .map((key) => rankingByContributorKey.get(key))
    .filter((rank): rank is number => rank !== undefined)

  return rankings.length ? Math.min(...rankings) : undefined
}

export function groupIntimationExportContributors(
  rows: ICrossPreviewPlanRow[],
  rankingRows: RankedContributorRow[] = []
): IntimationExportContributor[] {
  const contributors: IntimationExportContributor[] = []
  const contributorsByKey = new Map<string, IntimationExportContributor>()
  const rankingByContributorKey = new Map<string, number>()

  rankingRows.forEach((row, index) => {
    getContributorKeys(row).forEach((key) => {
      if (!rankingByContributorKey.has(key)) {
        rankingByContributorKey.set(key, index)
      }
    })
  })

  rows.forEach((row) => {
    const keys = getContributorKeys(row)
    const existingContributor = resolveExistingContributor(keys, contributorsByKey)

    if (existingContributor) {
      existingContributor.planillaRows.push(row)
      registerContributorKeys(keys, existingContributor, contributorsByKey)
      return
    }

    const contributor = {
      ...row,
      planillaRows: [row]
    }

    contributors.push(contributor)
    registerContributorKeys(keys, contributor, contributorsByKey)
  })

  return contributors.sort(
    (firstContributor, secondContributor) => {
      const firstRanking = resolveContributorRanking(
        firstContributor,
        rankingByContributorKey
      )
      const secondRanking = resolveContributorRanking(
        secondContributor,
        rankingByContributorKey
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
