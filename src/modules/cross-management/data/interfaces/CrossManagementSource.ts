import type {
  ICrossExecutionPayload,
  ICrossExecutionSummary,
  ICrossManagementListData,
  ICrossManagementListParams,
  ICrossPlanillaData,
  ICrossPlanillaRequestParams,
  ICrossResumenData,
  ICrossResumenRequestParams,
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentGeneratedSummary,
  ICrossResultsListData,
  ICrossResultsListParams
} from '../models/CrossManagement'

export interface ICrossManagementQueryPort {
  listExecutions(params?: ICrossManagementListParams): Promise<ICrossManagementListData>
  getPlanilla(
    executionId: number,
    params?: ICrossPlanillaRequestParams
  ): Promise<ICrossPlanillaData>
  getResumen(
    executionId: number,
    params?: ICrossResumenRequestParams
  ): Promise<ICrossResumenData>
  listResults(
    executionId: number,
    params?: ICrossResultsListParams
  ): Promise<ICrossResultsListData>
}

export interface ICrossManagementCommandPort {
  executeCross(payload: ICrossExecutionPayload): Promise<ICrossExecutionSummary>
  generateIntimationDocument(
    payload: IGenerateIntimationDocumentPayload
  ): Promise<IIntimationDocumentGeneratedSummary>
}

export type ICrossManagementSource = ICrossManagementQueryPort &
  ICrossManagementCommandPort
