'use client'

import { useMemo } from 'react'
import type { ICrossPreviewPlanRow } from '../../../data/models/CrossManagement'
import { INTIMATION_EXPORT_EMPTY_CONTRIBUTOR } from '../../constants/intimationExportLabels'

export type IntimationExportContributor = Pick<
  ICrossPreviewPlanRow,
  'id' | 'cuit' | 'businessName' | 'cells'
>

interface UseIntimationExportModalParams {
  activeIndex: number
  contributors: IntimationExportContributor[]
}

export function useIntimationExportModal({
  activeIndex,
  contributors
}: UseIntimationExportModalParams) {
  const safeActiveIndex = Math.min(
    Math.max(activeIndex, 0),
    Math.max(contributors.length - 1, 0)
  )
  const currentContributor = contributors[safeActiveIndex]
  const currentPage = contributors.length ? activeIndex + 1 : 0
  const totalPages = contributors.length
  const countLabel = `${contributors.length} intimaciones`
  const paginationLabel = `Contribuyente ${currentPage} de ${totalPages}`
  const contributorLabel =
    currentContributor?.businessName ?? INTIMATION_EXPORT_EMPTY_CONTRIBUTOR
  const cuitLabel = `CUIT: ${currentContributor?.cuit ?? '—'}`

  return useMemo(
    () => ({
      countLabel,
      cuitLabel,
      currentContributor,
      currentPage,
      paginationLabel,
      totalPages,
      contributorLabel
    }),
    [
      countLabel,
      contributorLabel,
      cuitLabel,
      currentContributor,
      currentPage,
      paginationLabel,
      totalPages
    ]
  )
}
