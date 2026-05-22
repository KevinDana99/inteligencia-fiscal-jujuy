'use server'

import type { IUnifiedRegisterItems } from '../../models/UnifiedRegister'
import { createServerUnifiedRegisterSource } from '../../data-access'

export async function getUnifiedRegisterAction(): Promise<IUnifiedRegisterItems> {
  const source = await createServerUnifiedRegisterSource()
  return source.listUnifiedRegister()
}
