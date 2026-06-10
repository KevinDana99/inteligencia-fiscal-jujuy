'use server'

import { createServerCrossManagementSource } from '../../data-access'
import type {
  ICrossManagementCommandResult,
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentGeneratedSummary
} from '../../models/CrossManagement'
import { resolveCrossManagementActionError } from '../shared/resolveCrossManagementActionError'

export async function generateIntimationDocumentAction(
  payload: IGenerateIntimationDocumentPayload
): Promise<ICrossManagementCommandResult<IIntimationDocumentGeneratedSummary>> {
  try {
    console.info({
      action: 'generateIntimationDocumentAction.start',
      format: payload.formato,
      hasContributorId: Boolean(payload.contribuyente.id),
      rowsCount: payload.filasPlanilla.length,
      selectedColumnsCount:
        payload.snapshotIntimacion?.columnasSeleccionadas.length ?? 0
    })

    const source = await createServerCrossManagementSource()
    const data = await source.generateIntimationDocument(payload)

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
