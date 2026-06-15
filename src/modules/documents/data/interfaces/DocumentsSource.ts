import type {
  DocumentDownloadFormat,
  IDownloadedDocumentFile,
  IGeneratedDocument,
  IGenerateInformeDocumentPayload
} from '../models/Documents';

export interface IDocumentsSource {
  generateInformeDocument(
    payload: IGenerateInformeDocumentPayload
  ): Promise<IGeneratedDocument>;
  downloadDocument(
    documentoId: string,
    formato: DocumentDownloadFormat
  ): Promise<IDownloadedDocumentFile>;
}
