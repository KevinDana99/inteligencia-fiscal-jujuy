import type { IntimationTemplateState } from '@/modules/configuration-module/presentation/hooks/intimation-template'
import type {
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentFormat,
  IIntimationSpreadsheetRow
} from '../../data/models/CrossManagement'
import type { IntimationExportContributor } from '../hooks/intimation-export/useIntimationExportModal'
import { INTIMATION_DOCUMENT_DOWNLOAD_ERRORS } from '../constants/intimationDocumentDownload'
import { resolveIntimationExportColumnValue } from './resolveIntimationExportColumnValue'

interface BuildIntimationDocumentPayloadParams {
  contributor: IntimationExportContributor | undefined
  format: IIntimationDocumentFormat
  templateState: IntimationTemplateState
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function resolveContributorId(contributor: IntimationExportContributor) {
  return contributor.taxpayerId ?? contributor.id
}

function buildSpreadsheetRows(
  contributor: IntimationExportContributor,
  columnIds: string[]
): IIntimationSpreadsheetRow[] {
  return [
    Object.fromEntries(
      columnIds.map((columnId) => [
        columnId,
        resolveIntimationExportColumnValue(contributor, columnId)
      ])
    )
  ]
}

export function buildIntimationDocumentPayload({
  contributor,
  format,
  templateState
}: BuildIntimationDocumentPayloadParams): IGenerateIntimationDocumentPayload {
  if (!contributor) {
    throw new Error(INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.missingContributor)
  }

  const contributorId = resolveContributorId(contributor)

  if (!UUID_PATTERN.test(contributorId)) {
    console.error({
      action: 'buildIntimationDocumentPayload.missing_contributor_id',
      contributorRowId: contributor.id,
      taxpayerId: contributor.taxpayerId,
      cuit: contributor.cuit,
      hasValues: Boolean(Object.keys(contributor.values).length)
    })

    throw new Error(INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.missingContributorId)
  }

  const columnIds = templateState.columnas.map((column) => column.id)

  if (!columnIds.length) {
    throw new Error(INTIMATION_DOCUMENT_DOWNLOAD_ERRORS.missingColumns)
  }

  return {
    contribuyente: {
      id: contributorId,
      cuit: contributor.cuit,
      razonSocial: contributor.businessName || null
    },
    formato: format,
    snapshotIntimacion: {
      asunto: templateState.asunto,
      saludo: templateState.saludo,
      cuerpo: templateState.cuerpo,
      fuenteInformacion: templateState.fuenteInformacion || null,
      fechaCorte: templateState.fechaCorte,
      columnasSeleccionadas: columnIds
    },
    filasPlanilla: buildSpreadsheetRows(contributor, columnIds)
  }
}
