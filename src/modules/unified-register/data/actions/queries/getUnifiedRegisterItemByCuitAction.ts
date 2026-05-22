'use server'

import type { IUnifiedRegisterItem } from '../../models/UnifiedRegister'
import { createServerUnifiedRegisterSource } from '../../data-access'

export async function getUnifiedRegisterItemByCuitAction(
  cuit: string
): Promise<IUnifiedRegisterItem | null> {
  const source = await createServerUnifiedRegisterSource()
  return source.getUnifiedRegisterItemByCuit(cuit)
}
