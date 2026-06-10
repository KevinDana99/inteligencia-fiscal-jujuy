'use client'

import { Modal, Text } from '@mantine/core'
import type { IntimationTemplateState } from '@/modules/configuration-module/presentation/hooks/intimation-template'
import classes from './IntimationExportModal.module.css'
import { IntimationExportContributor, useIntimationExportModal } from '../../hooks/intimation-export/useIntimationExportModal'
import { IntimationExportHeader } from './IntimationExportHeader'
import { IntimationExportPagination } from './IntimationExportPagination'
import { IntimationExportPreviewDocument } from './IntimationExportPreviewDocument'
import { IntimationExportFooter } from './IntimationExportFooter'

type IntimationExportModalProps = {
  activeIndex: number
  contributors: IntimationExportContributor[]
  downloadError?: string | null
  isDocxDownloading?: boolean
  isDownloadDisabled?: boolean
  isPdfDownloading?: boolean
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
  downloadError,
  isDocxDownloading,
  isDownloadDisabled,
  isPdfDownloading,
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
      size='min(1440px, calc(100vw - 20px))'
      classNames={{
        overlay: classes.overlay,
        inner: classes.inner,
        content: classes.content,
        body: classes.body
      }}
    >
      <div className={classes.shell}>
        <IntimationExportHeader countLabel={countLabel} onClose={onClose} />
        <IntimationExportPagination
          contributorLabel={contributorLabel}
          currentPage={currentPage}
          cuitLabel={cuitLabel}
          onNext={onNext}
          onPrevious={onPrevious}
          paginationLabel={paginationLabel}
          totalPages={totalPages}
        />
        <IntimationExportPreviewDocument
          contributor={currentContributor}
          templateState={templateState}
        />
        {downloadError ? (
          <Text className={classes.downloadError} role='alert'>
            {downloadError}
          </Text>
        ) : null}
        <IntimationExportFooter
          isDocxDownloading={isDocxDownloading}
          isDownloadDisabled={isDownloadDisabled}
          isPdfDownloading={isPdfDownloading}
          onBack={onBack}
          onDownloadDocx={onDownloadDocx}
          onDownloadPdf={onDownloadPdf}
        />
      </div>
    </Modal>
  )
}

export type { IntimationExportContributor }
