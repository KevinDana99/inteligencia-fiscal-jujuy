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

export interface IAdminAllowedDomain {
  id: number;
  domain: string;
}

export type IAdminAllowedDomains = IAdminAllowedDomain[];

export interface IAdminPanelCreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  roleLabel: string;
  password: string;
}

export interface IAdminPanelUpdateUserInput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleLabel: string;
  newPassword?: string | null;
  confirmPassword?: string | null;
}

export interface IAdminPanelCommandResult<TData = null> {
  success: boolean;
  data?: TData;
  error?: string;
  code?: string;
  status?: number;
}

export interface IAdminPanelActionStateError {
  code: string;
  message: string;
  statusCode: number;
}

export interface IAdminPanelActionState<TData = unknown> {
  success: boolean | null;
  message: string | null;
  errors: IAdminPanelActionStateError | null;
  data: TData | null;
}

export interface IAdminPanelCreateUserActionData {
  usuarioId: string;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  activo: boolean;
  esSuperAdministrador: boolean;
}

export interface IModuleQueryResult<TData> {
  data: TData | null;
  error?: string;
}

export type IAdminPanelUsers = IAdminPanelUser[];
