import { SendToReprocessingModal } from '@/modules/reprocessing/presentation/components';
import type { IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import { InformeGenerationModal } from '../../InformeGenerationModal';
import { InformePreviewModal } from '../../InformePreviewModal';
import type { InformeGenerationController, PreviewController } from '../types';
import { DeleteRecordModal } from './modals/DeleteRecordModal';
import { EditRecordModal } from './modals/EditRecordModal';
import { LotConfirmModal } from './modals/LotConfirmModal';

type PreviewModalsProps = {
  item: IUnifiedRegisterDetail;
  preview: PreviewController;
  report: InformeGenerationController;
  onCloseReport: () => void;
};

export function PreviewModals({
  item,
  preview,
  report,
  onCloseReport
}: PreviewModalsProps) {
  return (
    <>
      <SendToReprocessingModal
        opened={preview.activeHeaderModal === 'reprocessing'}
        onClose={preview.closeHeaderModal}
        contribuyenteId={item.contribuyenteId}
        cuit={item.cuit}
        razonSocial={item.businessName}
        error={preview.reprocessingActionError}
        onConfirm={preview.confirmReprocessing}
      />
      <InformeGenerationModal
        opened={preview.activeHeaderModal === 'report' && report.step === 'form'}
        report={report}
        onClose={onCloseReport}
      />
      <InformePreviewModal
        opened={preview.activeHeaderModal === 'report' && report.step === 'preview'}
        report={report}
        onClose={onCloseReport}
      />
      <LotConfirmModal preview={preview} />
      <DeleteRecordModal preview={preview} />
      <EditRecordModal preview={preview} />
    </>
  );
}
