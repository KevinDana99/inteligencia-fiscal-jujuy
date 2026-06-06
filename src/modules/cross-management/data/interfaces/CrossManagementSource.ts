import type {
  ICrossManagementListData,
  ICrossManagementListParams,
  ICrossPlanillaData,
  ICrossPlanillaRequestParams,
  ICrossResumenData,
  ICrossResumenRequestParams,
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

export type ICrossManagementSource = ICrossManagementQueryPort
