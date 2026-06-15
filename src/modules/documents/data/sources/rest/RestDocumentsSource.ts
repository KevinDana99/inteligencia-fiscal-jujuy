import type { ApiClientConfig } from '@/lib/api-client';
import type { IDocumentsSource } from '../../interfaces/DocumentsSource';
import type {
  DocumentDownloadFormat,
  IDownloadedDocumentFile,
  IGeneratedDocument,
  IGenerateInformeDocumentPayload
} from '../../models/Documents';
import { DOCUMENT_API_ROUTES } from './constants/documentApiRoutes';
import type { ApiGeneratedDocumentResponseDto } from './dtos/ApiDocumentDtos';
import {
  requestDocumentsFile,
  requestDocumentsJson
} from './utils/documentRestClient';

const CONTENT_TYPE_BY_FORMAT: Record<DocumentDownloadFormat, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

export class RestDocumentsSource implements IDocumentsSource {
  constructor(private readonly config: ApiClientConfig) {}

  async generateInformeDocument(
    payload: IGenerateInformeDocumentPayload
  ): Promise<IGeneratedDocument> {
    const dto = await requestDocumentsJson<
      ApiGeneratedDocumentResponseDto,
      IGenerateInformeDocumentPayload
    >({
      ...this.config,
      method: 'POST',
      path: DOCUMENT_API_ROUTES.informeGenerate,
      body: payload
    });

    return {
      documentoId: dto.documentoId,
      urlDescarga: dto.urlDescarga
    };
  }

  async downloadDocument(
    documentoId: string,
    formato: DocumentDownloadFormat
  ): Promise<IDownloadedDocumentFile> {
    const response = await requestDocumentsFile({
      ...this.config,
      path: DOCUMENT_API_ROUTES.download(documentoId, formato)
    });

    return {
      base64: response.base64,
      contentType: response.contentType || CONTENT_TYPE_BY_FORMAT[formato],
      fileName: response.fileName ?? `informe_${documentoId}.${formato}`,
      formato
    };
  }
}
