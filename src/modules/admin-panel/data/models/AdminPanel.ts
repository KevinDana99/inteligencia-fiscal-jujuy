export type AdminPanelSection = 'dashboard' | 'settings';

export interface IAdminPanelUser {
  id: string;
  fullName: string;
  email: string;
  roleLabel: string;
  isAdmin?: boolean;
  isDeleted?: boolean;
}

export interface IAdminPanelMetrics {
  activeUsers: number;
  deletedUsers: number;
  passwordChanges: number;
  distinctRoles: number;
}

export interface IAdminPanelData {
  users: IAdminPanelUsers;
}

export interface IAdminPanelCreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  roleLabel: string;
  password: string;
}

export interface IAdminPanelUpdateUserInput extends IAdminPanelCreateUserInput {
  id: string;
}

export interface IAdminPanelCommandResult<TData = null> {
  success: boolean;
  data?: TData;
  error?: string;
  code?: string;
  status?: number;
}

export interface IModuleQueryResult<TData> {
  data: TData | null;
  error?: string;
}

export type IAdminPanelUsers = IAdminPanelUser[];
