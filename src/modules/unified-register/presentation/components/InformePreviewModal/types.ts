import type { UseInformeGenerationReturn } from '../../hooks/useInformeGeneration';

export type InformePreviewReport = UseInformeGenerationReturn;
export type InformePreviewPayload = NonNullable<InformePreviewReport['previewPayload']>;

export interface InformePreviewModalProps {
  opened: boolean;
  report: InformePreviewReport;
  onClose: () => void;
}
