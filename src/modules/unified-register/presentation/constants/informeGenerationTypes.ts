import type { IInformeSelectedCross } from '@/modules/documents';

export type InformeFiscalActionField =
  | 'origenPedido'
  | 'impuestosAVerificar'
  | 'periodo'
  | 'origenOI'
  | 'programa'
  | 'tipoInstruccion'
  | 'impuestoNeto';

export interface InformeGenerationForm {
  titulo: string;
  destinatario: string;
  datosAccionFiscalizadora: Record<InformeFiscalActionField, string>;
}

export interface InformeCrossPreviewColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
}

export interface InformeCrossOption extends IInformeSelectedCross {
  id: string;
  description: string;
  sourceCodes: string[];
  previewTitle: string;
  previewColumns: InformeCrossPreviewColumn[];
  summary: string;
  isReportReady?: boolean;
}
