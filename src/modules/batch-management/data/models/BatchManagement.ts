export interface IBatchManagementCuit {
  id: string
  cuit: string
  businessName: string
  regime: string
}

export interface IBatchManagementItem {
  id: string
  batchNumber: string
  name: string
  description: string
  cuitCount: number
  createdAt: string
  cuits: IBatchManagementCuit[]
}

export type IBatchManagementItems = Array<IBatchManagementItem>
