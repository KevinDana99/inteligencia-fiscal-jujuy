import type {
  IAdminPanelCommandResult,
  IAdminPanelCreateUserInput,
  IAdminPanelData,
  IAdminPanelUpdateUserInput
} from '../../models/AdminPanel';
import type { IAdminPanelSource } from '../../interfaces/AdminPanelSource';
import { ADMIN_PANEL_MOCK_DATA } from './fixtures/adminPanelData';

function cloneAdminPanelData(data: IAdminPanelData): IAdminPanelData {
  return {
    users: data.users.map((user) => ({ ...user }))
  };
}

export class MockAdminPanelSource implements IAdminPanelSource {
  async getAdminPanelData(): Promise<IAdminPanelData> {
    return cloneAdminPanelData(ADMIN_PANEL_MOCK_DATA);
  }

  async getAdminUser(userId: string) {
    const user = ADMIN_PANEL_MOCK_DATA.users.find((item) => item.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    return { ...user };
  }

  async createAdminUser(
    params: IAdminPanelCreateUserInput
  ): Promise<IAdminPanelCommandResult<(typeof ADMIN_PANEL_MOCK_DATA.users)[number]>> {
    return {
      success: true,
      data: {
        id: `${params.firstName.toLowerCase()}-${params.lastName.toLowerCase()}`,
        fullName: `${params.firstName} ${params.lastName}`.trim(),
        email: params.email.toLowerCase(),
        roleLabel: params.roleLabel
      }
    };
  }

  async updateAdminUser(
    params: IAdminPanelUpdateUserInput
  ): Promise<IAdminPanelCommandResult> {
    const user = ADMIN_PANEL_MOCK_DATA.users.find((item) => item.id === params.id);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
        status: 404
      };
    }

    if (user.isAdmin) {
      return {
        success: false,
        error: 'Super admin account cannot be edited',
        status: 409
      };
    }

    return { success: true };
  }

  async deleteAdminUser(userId: string): Promise<IAdminPanelCommandResult> {
    const user = ADMIN_PANEL_MOCK_DATA.users.find((item) => item.id === userId);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
        status: 404
      };
    }

    if (user.isAdmin) {
      return {
        success: false,
        error: 'Super admin account cannot be deleted',
        status: 409
      };
    }

    return { success: true };
  }
}
