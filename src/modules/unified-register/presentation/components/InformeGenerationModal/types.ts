import type { UseInformeGenerationReturn } from '../../hooks/useInformeGeneration';

export type InformeGenerationReport = UseInformeGenerationReturn;

export interface InformeGenerationModalProps {
  opened: boolean;
  report: InformeGenerationReport;
  onClose: () => void;
}
