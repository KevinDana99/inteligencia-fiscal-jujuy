import { Button, Modal } from '@mantine/core'
import { IntimationTemplate } from '@/modules/configuration-module/presentation/components/IntimationTemplate'
import { SendToReprocessingModal } from '@/modules/reprocessing/presentation/components'
import type {
  ICrossPreviewAnalysisRow,
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_INTIMATION_LABEL } from '../../constants/crossPreviewLabels'
import { useCrossPreviewModals } from '../../hooks/cross-preview/useCrossPreviewModals'
import { IntimationExportModal } from '../IntimationExportModal'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewModalsProps {
  activePreviewIndex: number
  contributors: ICrossPreviewPlanRow[]
  exportModalOpened: boolean
  intimationModalOpened: boolean
  onCloseExportModal: () => void
  onCloseIntimationModal: () => void
  onCloseReprocessingModal: () => void
  onConfirmReprocessingModal: () => void
  onGoToNextPreview: () => void
  onGoToPreviousPreview: () => void
  onOpenExportModal: () => void
  pendingReprocessingRow: ICrossPreviewAnalysisRow | null
}

export function CrossPreviewModals({
  activePreviewIndex,
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
  pendingReprocessingRow
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
        contribuyenteId={pendingReprocessingRow?.cuit ?? ''}
        cuit={pendingReprocessingRow?.cuit ?? ''}
        razonSocial={pendingReprocessingRow?.businessName ?? ''}
        onConfirm={handleConfirmReprocessing}
      />
    </>
  )
}
