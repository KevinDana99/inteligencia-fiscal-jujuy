'use server';

import { createServerDocumentsSource } from '../../data-access';
import type {
  DocumentDownloadFormat,
  IDocumentsCommandResult,
  IDownloadedDocumentFile
} from '../../models/Documents';
import { resolveDocumentsActionError } from '../shared/resolveDocumentsActionError';

export async function downloadDocumentAction(
  documentoId: string,
  formato: DocumentDownloadFormat
): Promise<IDocumentsCommandResult<IDownloadedDocumentFile>> {
  try {
    const source = await createServerDocumentsSource();
    const data = await source.downloadDocument(documentoId, formato);

    return {
      success: true,
      data
    };
  } catch (error) {
    const resolvedError = resolveDocumentsActionError(
      error,
      'No fue posible descargar el documento.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
