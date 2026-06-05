import type {
  ICrossManagementListData,
  ICrossManagementListParams,
  ICrossResultsListData,
  ICrossResultsListParams
} from '../models/CrossManagement'

export interface ICrossManagementQueryPort {
  listExecutions(params?: ICrossManagementListParams): Promise<ICrossManagementListData>
  listResults(
    executionId: number,
    params?: ICrossResultsListParams
  ): Promise<ICrossResultsListData>
}

export type ICrossManagementSource = ICrossManagementQueryPort
