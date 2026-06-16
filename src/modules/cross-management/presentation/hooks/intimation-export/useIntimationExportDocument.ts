'use client'

import { useMemo } from 'react'
import type { IntimationTemplateState } from '@/modules/configuration-module/presentation/hooks/intimation-template'
import { INTIMATION_EXPORT_EMPTY_VALUE } from '../../constants/intimationExportLabels'
import { resolveIntimationExportColumnValue } from '../../utils/resolveIntimationExportColumnValue'
import type { IntimationExportContributor } from './useIntimationExportModal'

interface UseIntimationExportDocumentParams {
  contributor: IntimationExportContributor | undefined
  templateState: IntimationTemplateState
}

export function useIntimationExportDocument({
  contributor,
  templateState
}: UseIntimationExportDocumentParams) {
  const paragraphs = useMemo(
    () => templateState.cuerpo.split('\n'),
    [templateState.cuerpo]
  )
  const tableRows = useMemo(
    () =>
      (contributor?.planillaRows.length
        ? contributor.planillaRows
        : contributor
          ? [contributor]
          : []
      ).map((row, rowIndex) => ({
        id: `${row.id}-${rowIndex}`,
        cells: templateState.columnas.map((column) => ({
          id: column.id,
          value: resolveIntimationExportColumnValue(row, column.id)
        }))
      })),
    [contributor, templateState.columnas]
  )

  return {
    contributorCuit: contributor?.cuit ?? INTIMATION_EXPORT_EMPTY_VALUE,
    contributorName: contributor?.businessName ?? INTIMATION_EXPORT_EMPTY_VALUE,
    paragraphs,
    shouldShowSource: Boolean(templateState.fuenteInformacion),
    tableRows
  }
}
