import type { IUnifiedRegisterSource } from './interfaces/UnifiedRegisterSource'
import { MockUnifiedRegisterSource } from './sources/mock/MockUnifiedRegisterSource'

export async function createServerUnifiedRegisterSource(): Promise<IUnifiedRegisterSource> {
  return new MockUnifiedRegisterSource()
}
