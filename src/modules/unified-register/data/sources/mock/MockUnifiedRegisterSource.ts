import type { IUnifiedRegisterSource } from '../../interfaces/UnifiedRegisterSource'
import type { IUnifiedRegisterItem, IUnifiedRegisterItems } from '../../models/UnifiedRegister'
import { unifiedRegisterItemsFixture } from './fixtures/unifiedRegisterItems'

function normalizeCuit(value: string) {
  return value.replace(/\D/g, '')
}

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
    const normalizedCuit = normalizeCuit(cuit)
    const item = unifiedRegisterItemsFixture.find(
      (entry) => normalizeCuit(entry.cuit) === normalizedCuit
    )

    return item ? cloneItem(item) : null
  }
}
