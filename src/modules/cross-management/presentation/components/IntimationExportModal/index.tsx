'use client'

import {
  Modal} from '@mantine/core'
import type { IntimationTemplateState } from '@/modules/configuration-module/presentation/components/IntimationTemplate/useIntimationTemplate'
import classes from './IntimationExportModal.module.css'
import { IntimationExportContributor, useIntimationExportModal } from '../../hooks/intimation-export/useIntimationExportModal'
import { IntimationExportHeader } from './IntimationExportHeader'
import { IntimationExportPagination } from './IntimationExportPagination'
import { IntimationExportContributorBar } from './IntimationExportContributorBar'
import { IntimationExportPreviewDocument } from './IntimationExportPreviewDocument'
import { IntimationExportFooter } from './IntimationExportFooter'

type IntimationExportModalProps = {
  activeIndex: number
  contributors: IntimationExportContributor[]
  onBack: () => void
  onClose: () => void
  onDownloadDocx?: () => void
  onDownloadPdf?: () => void
  onNext: () => void
  onPrevious: () => void
  opened: boolean
  templateState: IntimationTemplateState
}

const COLUMN_CELL_INDEX_BY_ID: Record<string, number> = {
  fact_arca_anio: 4,
  fact_arca_fecha: 5,
  ag_percepcion: 6,
  ag_retencion: 7,
  pago_a_cta: 8,
  mes: 13,
  anio: 14,
  cierre_ej: 15,
  tot_ing_pais: 16,
  ci_decl: 17,
  tot_egr: 18,
  coef_egr: 19,
  nuevo_ci: 20,
  cu_decl: 21,
  ncu: 22,
  bi_total_pais: 23,
  bi_estimada: 24,
  bi_decl_cm03: 25,
  alicuota: 26,
  dif_creditos: 28,
  saf: 29,
  base_imponible_ingresos_brutos: 10,
  base_imponible_informada_por_terceros: 23,
  diferencia_de_base_imponible: 12,
  est_final: 27,
  imp_presuntivo: 27
}

function resolveColumnValue(
  contributor: IntimationExportContributor | undefined,
  columnId: string
) {
  if (!contributor) {
    return '—'
  }

  const index = COLUMN_CELL_INDEX_BY_ID[columnId]

  if (typeof index !== 'number') {
    return '—'
  }

  return contributor.cells[index] ?? '—'
}

export function IntimationExportModal({
  activeIndex,
  contributors,
  onBack,
  onClose,
  onDownloadDocx,
  onDownloadPdf,
  onNext,
  onPrevious,
  opened,
  templateState
}: IntimationExportModalProps) {
  const {
    contributorLabel,
    countLabel,
    cuitLabel,
    currentContributor,
    currentPage,
    paginationLabel,
    totalPages
  } = useIntimationExportModal({ activeIndex, contributors })

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered={false}
      withinPortal
      classNames={{
        overlay: classes.overlay,
        content: classes.content,
        body: classes.body
      }}
    >
      <div className={classes.shell}>
        <IntimationExportHeader countLabel={countLabel} onClose={onClose} />
        <IntimationExportPagination
          currentPage={currentPage}
          onNext={onNext}
          onPrevious={onPrevious}
          paginationLabel={paginationLabel}
          totalPages={totalPages}
        />
        <IntimationExportContributorBar
          contributorLabel={contributorLabel}
          cuitLabel={cuitLabel}
        />
        <IntimationExportPreviewDocument
          contributor={currentContributor}
          templateState={templateState}
        />
        <IntimationExportFooter
          onBack={onBack}
          onDownloadDocx={onDownloadDocx}
          onDownloadPdf={onDownloadPdf}
        />
      </div>
    </Modal>
  )
}

export type { IntimationExportContributor }
