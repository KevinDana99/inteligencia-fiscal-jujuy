import type {
  IIntimationDocumentFormat,
  IIntimationSpreadsheetCellValue
} from '../../../models/CrossManagement'

export interface ApiGenerateIntimationDocumentRequestDto {
  contribuyente: {
    id: string
    cuit: string
    razonSocial?: string | null
  }
  formato: IIntimationDocumentFormat
  snapshotIntimacion?: {
    asunto: string
    saludo: string
    cuerpo: string
    fuenteInformacion?: string | null
    fechaCorte: string
    columnasSeleccionadas: string[]
  } | null
  filasPlanilla: Array<Record<string, IIntimationSpreadsheetCellValue>>
}

export type ApiGenerateIntimationDocumentResponseDto =
  | string
  | {
      documentoId?: string | null
      documentId?: string | null
      id?: string | null
      urlDescarga?: string | null
      downloadUrl?: string | null
      url?: string | null
    }
