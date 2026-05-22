import type { IUnifiedRegisterSource } from '../../interfaces/UnifiedRegisterSource'
import type { IUnifiedRegisterItem, IUnifiedRegisterItems } from '../../models/UnifiedRegister'
import { unifiedRegisterItemsFixture } from './fixtures/unifiedRegisterItems'

function cloneItem(item: IUnifiedRegisterItem): IUnifiedRegisterItem {
  return { ...item }
}

function cloneItems(items: IUnifiedRegisterItems): IUnifiedRegisterItems {
  return items.map(cloneItem)
}

export class MockUnifiedRegisterSource implements IUnifiedRegisterSource {
  async listUnifiedRegister(): Promise<IUnifiedRegisterItems> {
    return cloneItems(unifiedRegisterItemsFixture)
  }

  async getUnifiedRegisterItemByCuit(cuit: string): Promise<IUnifiedRegisterItem | null> {
    const item = unifiedRegisterItemsFixture.find((entry) => entry.cuit === cuit)

    return item ? cloneItem(item) : null
  }
}
