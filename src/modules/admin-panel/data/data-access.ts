import type { IAdminPanelSource } from './interfaces/AdminPanelSource';
import { MockAdminPanelSource } from './sources/mock/MockAdminPanelSource';

export async function createServerAdminPanelSource(): Promise<IAdminPanelSource> {
  return new MockAdminPanelSource();
}
