import type { IUnifiedRegisterItems, IUnifiedRegisterItem } from '../models/UnifiedRegister'

export interface IUnifiedRegisterSource {
  listUnifiedRegister(): Promise<IUnifiedRegisterItems>
  getUnifiedRegisterItemByCuit(cuit: string): Promise<IUnifiedRegisterItem | null>
}
