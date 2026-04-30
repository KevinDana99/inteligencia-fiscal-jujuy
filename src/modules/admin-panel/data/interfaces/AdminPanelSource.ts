import type {
  IAdminPanelCommandResult,
  IAdminPanelCreateUserInput,
  IAdminPanelData,
  IAdminPanelUpdateUserInput,
  IAdminPanelUser
} from '../models/AdminPanel';

export interface IAdminPanelQueryPort {
  getAdminPanelData(): Promise<IAdminPanelData>;
  getAdminUser(userId: string): Promise<IAdminPanelUser>;
}

export interface IAdminPanelCommandPort {
  createAdminUser(
    params: IAdminPanelCreateUserInput
  ): Promise<IAdminPanelCommandResult<IAdminPanelUser>>;
  updateAdminUser(
    params: IAdminPanelUpdateUserInput
  ): Promise<IAdminPanelCommandResult>;
  deleteAdminUser(userId: string): Promise<IAdminPanelCommandResult>;
}

export interface IAdminPanelSource extends IAdminPanelQueryPort, IAdminPanelCommandPort {}
