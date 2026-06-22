import { Button, Modal } from '@mantine/core'
import type { IntimationColumnOption } from '@/modules/configuration-module/presentation/constants'
import { IntimationTemplate } from '@/modules/configuration-module/presentation/components/IntimationTemplate'
import { SendToReprocessingModal } from '@/modules/reprocessing/presentation/components'
import type { IReprocessingMarkPayload } from '@/modules/reprocessing/data/models/Reprocessing'
import type {
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_INTIMATION_LABEL } from '../../constants/crossPreviewLabels'
import { useCrossPreviewModals } from '../../hooks/cross-preview/useCrossPreviewModals'
import {
  IntimationExportModal,
  type IntimationExportContributor
} from '../IntimationExportModal'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewModalsProps {
  activePreviewIndex: number
  intimationColumnOptions: IntimationColumnOption[]
  contributors: IntimationExportContributor[]
  exportModalOpened: boolean
  intimationModalOpened: boolean
  onCloseExportModal: () => void
  onCloseIntimationModal: () => void
  onCloseReprocessingModal: () => void
  onConfirmReprocessingModal: (
    payload: IReprocessingMarkPayload
  ) => void | Promise<void>
  onGoToNextPreview: () => void
  onGoToPreviousPreview: () => void
  onOpenExportModal: () => void
  pendingReprocessingRow: ICrossPreviewAnalysisRow | null
  reprocessingActionError?: string | null
}

export function CrossPreviewModals({
  activePreviewIndex,
  intimationColumnOptions,
  contributors,
  exportModalOpened,
  intimationModalOpened,
  onCloseExportModal,
  onCloseIntimationModal,
  onCloseReprocessingModal,
  onConfirmReprocessingModal,
  onGoToNextPreview,
  onGoToPreviousPreview,
  onOpenExportModal,
  pendingReprocessingRow,
  reprocessingActionError
}: CrossPreviewModalsProps) {
  const {
    downloadDocx,
    downloadError,
    downloadPdf,
    handleConfirmReprocessing,
    handleIntimationNext,
    intimationTemplate,
    isDocxDownloading,
    isDownloadDisabled,
    isPdfDownloading
  } = useCrossPreviewModals({
    activePreviewIndex,
    intimationColumnOptions,
    contributors,
    onConfirmReprocessingModal,
    onOpenExportModal
  })
  const isIntimationConfigModalVisible =
    intimationModalOpened && !exportModalOpened

  return (
    <>
      <Modal
        opened={isIntimationConfigModalVisible}
        onClose={onCloseIntimationModal}
        centered
        size={640}
        title={CROSS_PREVIEW_INTIMATION_LABEL}
        classNames={{
          overlay: classes.intimationModalOverlay,
          content: classes.intimationModalContent,
          header: classes.intimationModalHeader,
          body: classes.intimationModalBody,
          title: classes.intimationModalTitle,
          close: classes.intimationModalClose
        }}
      >
        <IntimationTemplate
          controller={intimationTemplate}
          footerActions={
            <Button
              className={classes.intimationModalNextButton}
              onClick={handleIntimationNext}
            >
              Siguiente
            </Button>
          }
        />
      </Modal>

      <IntimationExportModal
        opened={exportModalOpened}
        onClose={onCloseExportModal}
        onBack={onCloseExportModal}
        onDownloadPdf={downloadPdf}
        onDownloadDocx={downloadDocx}
        isPdfDownloading={isPdfDownloading}
        isDocxDownloading={isDocxDownloading}
        isDownloadDisabled={isDownloadDisabled}
        downloadError={downloadError}
        contributors={contributors}
        activeIndex={activePreviewIndex}
        onPrevious={onGoToPreviousPreview}
        onNext={onGoToNextPreview}
        templateState={intimationTemplate.state}
      />

      <SendToReprocessingModal
        opened={Boolean(pendingReprocessingRow)}
        onClose={onCloseReprocessingModal}
        contribuyenteId={pendingReprocessingRow?.taxpayerId ?? ''}
        cuit={pendingReprocessingRow?.cuit ?? ''}
        razonSocial={pendingReprocessingRow?.businessName ?? ''}
        error={reprocessingActionError}
        onConfirm={handleConfirmReprocessing}
      />
    </>
  )
}
