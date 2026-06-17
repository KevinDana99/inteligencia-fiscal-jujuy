'use server'

import { createServerCrossManagementSource } from '../../data-access'
import type {
  ICrossManagementCommandResult,
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentGeneratedSummary
} from '../../models/CrossManagement'
import { normalizeIntimationDocumentPayload } from '../../utils/normalizeIntimationDocumentPayload'
import { resolveCrossManagementActionError } from '../shared/resolveCrossManagementActionError'
import util from 'util'

export async function generateIntimationDocumentAction(
  payload: IGenerateIntimationDocumentPayload
): Promise<ICrossManagementCommandResult<IIntimationDocumentGeneratedSummary>> {
  try {
    const normalizedPayload = normalizeIntimationDocumentPayload(payload)

    console.info({
      action: 'generateIntimationDocumentAction.start',
      format: normalizedPayload.formato,
      hasContributorId: Boolean(normalizedPayload.contribuyente.id),
      rowsCount: normalizedPayload.filasPlanilla.length,
      selectedColumnsCount: normalizedPayload.columnasSeleccionadas.length
    })

    const source = await createServerCrossManagementSource()
    const data = await source.generateIntimationDocument(normalizedPayload)

    console.info({
      action: 'generateIntimationDocumentAction.success',
      documentId: data.documentId,
      hasDownloadUrl: Boolean(data.downloadUrl)
    })

    return {
      success: true,
      data
    }
  } catch (error) {
    const resolvedError = resolveCrossManagementActionError(
      error,
      'No fue posible generar la intimación.'
    )

    console.error({
      action: 'generateIntimationDocumentAction.error',
      error: resolvedError.error,
      code: resolvedError.code,
      status: resolvedError.status
    })

    return {
      success: false,
      data: null,
      ...resolvedError
    }
  }
}
