import type { IAdminPanelData } from '../../models/AdminPanel';
import type { IAdminPanelSource } from '../../interfaces/AdminPanelSource';
import { ADMIN_PANEL_MOCK_DATA } from './fixtures/adminPanelData';

function cloneAdminPanelData(data: IAdminPanelData): IAdminPanelData {
  return {
    historicalPasswordChanges: data.historicalPasswordChanges,
    users: data.users.map((user) => ({ ...user }))
  };
}

export class MockAdminPanelSource implements IAdminPanelSource {
  async getAdminPanelData(): Promise<IAdminPanelData> {
    return cloneAdminPanelData(ADMIN_PANEL_MOCK_DATA);
  }
}
