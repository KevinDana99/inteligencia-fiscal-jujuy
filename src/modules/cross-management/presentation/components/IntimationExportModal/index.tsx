'use client'

import { Modal } from '@mantine/core'
import type { IntimationTemplateState } from '@/modules/dashboard-layout/presentation/components/IntimationTemplate/useIntimationTemplate'
import {
  useIntimationExportModal,
  type IntimationExportContributor
} from '../../hooks/intimation-export/useIntimationExportModal'
import { IntimationExportContributorBar } from './IntimationExportContributorBar'
import { IntimationExportFooter } from './IntimationExportFooter'
import { IntimationExportHeader } from './IntimationExportHeader'
import { IntimationExportPagination } from './IntimationExportPagination'
import { IntimationExportPreviewDocument } from './IntimationExportPreviewDocument'
import classes from './IntimationExportModal.module.css'

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
