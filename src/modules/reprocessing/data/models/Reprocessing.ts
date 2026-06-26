export interface IReprocessingItem {
  id: string
  contribuyenteId: string
  cuit: string
  businessName: string
  createdAt: string
  date: string
  markedByUserId: string
  markedBy: string
  lastCrossId: string | null
  lastCross: string
  notes: string
  isReprocessing: boolean
}

export type IReprocessingItems = Array<IReprocessingItem>

export interface IReprocessingListParams {
  search?: string | null
  page?: number
  itemsPerPage?: number
}

export interface IReprocessingListData {
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  items: IReprocessingItems
}

export interface IReprocessingMarkPayload {
  cuit: string
  description?: string | null
}

export interface IReprocessingMarkedSummary {
  id: string
  contribuyenteId: string
  description: string | null
  isActive: boolean
  createdAtUtc: string
}

export interface IReprocessingCommandResult<TData = null> {
  success: boolean
  data: TData | null
  error?: string
  code?: string
  status?: number
}

export interface IReprocessingQueryResult<TData> {
  data: TData | null
  error?: string
  code?: string
  status?: number
}
