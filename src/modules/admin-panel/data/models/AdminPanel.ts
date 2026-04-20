export type AdminPanelSection = 'home' | 'settings';

export interface IAdminPanelUser {
  id: string;
  fullName: string;
  email: string;
  roleLabel: string;
  avatarColor: string;
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
  historicalPasswordChanges: number;
}

export interface IAdminPanelCreateUserInput {
  fullName: string;
  email: string;
  roleLabel: string;
}

export interface IAdminPanelUpdateUserInput extends IAdminPanelCreateUserInput {
  id: string;
}

export interface IModuleQueryResult<TData> {
  data: TData | null;
  error?: string;
}

export type IAdminPanelUsers = IAdminPanelUser[];
