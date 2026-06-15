export type InformeDocumentGenerationFormat = 'Pdf' | 'Docx';
export type DocumentDownloadFormat = 'pdf' | 'docx';
export type DocumentCellValue = string | number | boolean | null;

export interface IInformeContributorData {
  razonSocial: string;
  cuit: string;
  domicilioFiscal: string;
  domicilioFiscalElectronico: boolean;
  emailInformado: string;
  riesgoFiscal: string;
  actividadesDeclaradas: string[];
}

export interface IInformeFiscalActionData {
  origenPedido: string;
  periodo: string | null;
  origenOI: string | null;
  programa: string | null;
  tipoInstruccion: string | null;
  impuestoNeto: string | null;
  impuestosAVerificar: string;
}

export interface IInformeSelectedCross {
  nombre: string;
  columnasSeleccionadas: {
    claves: string[];
    filas: Array<Record<string, DocumentCellValue>>;
  };
}

export interface IGenerateInformeDocumentPayload {
  contribuyenteId: string;
  formato: InformeDocumentGenerationFormat;
  destinatario: string | null;
  titulo: string | null;
  datosContribuyente: IInformeContributorData;
  datosAccionFiscalizadora: IInformeFiscalActionData;
  crucesSeleccionados: IInformeSelectedCross[];
}

export type IGenerateInformeDocumentsPayload = Omit<
  IGenerateInformeDocumentPayload,
  'formato'
>;

export interface IGeneratedDocument {
  documentoId: string;
  urlDescarga: string;
}

export interface IGeneratedInformeDocuments {
  pdf: IGeneratedDocument;
  docx: IGeneratedDocument;
}

export interface IDownloadedDocumentFile {
  base64: string;
  contentType: string;
  fileName: string;
  formato: DocumentDownloadFormat;
}

export interface IDocumentsCommandResult<TData = null> {
  success: boolean;
  data: TData | null;
  error?: string;
  code?: string;
  status?: number;
}
