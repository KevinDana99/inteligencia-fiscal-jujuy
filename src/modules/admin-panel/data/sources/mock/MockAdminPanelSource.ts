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

let adminPanelMockStore: IAdminPanelData = cloneAdminPanelData(ADMIN_PANEL_MOCK_DATA)

export class MockAdminPanelSource implements IAdminPanelSource {
  async getAdminPanelData(): Promise<IAdminPanelData> {
    return cloneAdminPanelData(adminPanelMockStore);
  }

  async getAdminUser(userId: string) {
    const user = adminPanelMockStore.users.find((item) => item.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    return { ...user };
  }

  async createAdminUser(
    params: IAdminPanelCreateUserInput
  ): Promise<IAdminPanelCommandResult<(typeof ADMIN_PANEL_MOCK_DATA.users)[number]>> {
    const normalizedEmail = params.email.trim().toLowerCase()

    if (adminPanelMockStore.users.some((item) => item.email === normalizedEmail)) {
      return {
        success: false,
        error: 'Ya existe un usuario con el correo informado.',
        code: 'super_administrador.usuarios.crear.correo_duplicado',
        status: 409
      }
    }

    const nextUser = {
      id: `${params.firstName.toLowerCase()}-${params.lastName.toLowerCase()}`,
      fullName: `${params.firstName} ${params.lastName}`.trim(),
      email: normalizedEmail,
      roleLabel: params.roleLabel
    }

    adminPanelMockStore = {
      users: [...adminPanelMockStore.users, nextUser]
    }

    return {
      success: true,
      data: nextUser
    }
  }

  async updateAdminUser(
    params: IAdminPanelUpdateUserInput
  ): Promise<IAdminPanelCommandResult> {
    const user = adminPanelMockStore.users.find((item) => item.id === params.id);

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
    const user = adminPanelMockStore.users.find((item) => item.id === userId);

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
