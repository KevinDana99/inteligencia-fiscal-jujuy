'use server';

import { createServerDocumentsSource } from '../../data-access';
import type {
  IDocumentsCommandResult,
  IGeneratedInformeDocuments,
  IGenerateInformeDocumentsPayload
} from '../../models/Documents';
import { resolveDocumentsActionError } from '../shared/resolveDocumentsActionError';

export async function generateInformeDocumentsAction(
  payload: IGenerateInformeDocumentsPayload
): Promise<IDocumentsCommandResult<IGeneratedInformeDocuments>> {
  try {
    const source = await createServerDocumentsSource();
    const [pdf, docx] = await Promise.all([
      source.generateInformeDocument({
        ...payload,
        formato: 'Pdf'
      }),
      source.generateInformeDocument({
        ...payload,
        formato: 'Docx'
      })
    ]);

    return {
      success: true,
      data: {
        pdf,
        docx
      }
    };
  } catch (error) {
    const resolvedError = resolveDocumentsActionError(
      error,
      'No fue posible generar el informe.'
    );

    return {
      success: false,
      data: null,
      ...resolvedError
    };
  }
}
