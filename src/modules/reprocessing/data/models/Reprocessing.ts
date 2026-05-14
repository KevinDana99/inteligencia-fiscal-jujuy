export interface IReprocessingItem {
  id: string
  cuit: string
  businessName: string
  date: string
  markedBy: string
  lastCross: string
  notes: string
  isReprocessing: boolean
}

export type IReprocessingItems = Array<IReprocessingItem>
