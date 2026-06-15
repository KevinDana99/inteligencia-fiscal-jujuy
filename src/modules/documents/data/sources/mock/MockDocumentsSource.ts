import type { IDocumentsSource } from '../../interfaces/DocumentsSource';
import type {
  DocumentDownloadFormat,
  IDownloadedDocumentFile,
  IGeneratedDocument,
  IGenerateInformeDocumentPayload
} from '../../models/Documents';

const CONTENT_TYPE_BY_FORMAT: Record<DocumentDownloadFormat, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

const DOWNLOAD_FORMAT_BY_GENERATION_FORMAT = {
  Pdf: 'pdf',
  Docx: 'docx'
} as const;

export class MockDocumentsSource implements IDocumentsSource {
  async generateInformeDocument(
    payload: IGenerateInformeDocumentPayload
  ): Promise<IGeneratedDocument> {
    const formato = DOWNLOAD_FORMAT_BY_GENERATION_FORMAT[payload.formato];
    const documentoId = `mock-informe-${formato}-${payload.contribuyenteId}`;

    return {
      documentoId,
      urlDescarga: `/api/documentos/${documentoId}/descargar`
    };
  }

  async downloadDocument(
    documentoId: string,
    formato: DocumentDownloadFormat
  ): Promise<IDownloadedDocumentFile> {
    return {
      base64: Buffer.from(`Documento mock ${documentoId}.${formato}`).toString('base64'),
      contentType: CONTENT_TYPE_BY_FORMAT[formato],
      fileName: `informe_mock.${formato}`,
      formato
    };
  }
}
