import type { UserRole } from '@/lib/auth/constants'

export interface IAuthUser {
  autenticado: boolean;
  esquema: string | null;
  nombreUsuario: string | null;
  correo: string | null;
  sujeto: string | null;
  tipoUsuario: UserRole | null;
}

export interface IAuthSession {
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  user: IAuthUser;
}

export interface ISerializedAuthSession {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface ICommandResult {
  success: boolean;
  error?: string;
}

export interface IModuleQueryResult<TData> {
  data: TData | null;
  error?: string;
}

export interface IIamSessionResponse {
  token: string;
  expiraEn: number;
  refrescarToken: string;
  refrescarTokenExpiraEn: number;
  usuario: {
    nombreUsuario: string;
    correo: string;
  };
}

export interface IIamSignInRequest {
  correo: string;
  contrasena: string;
}

export interface IIamRefreshSessionRequest {
  refrescarToken: string;
}

export interface IIamSignOutRequest {
  refrescarToken: string;
}

export type IIamRefreshSessionResponse = IIamSessionResponse;

export interface IIamCurrentContextResponse {
  autenticado: boolean;
  esquema: string | null;
  nombreUsuario: string | null;
  correo: string | null;
  sujeto: string | null;
  tipoUsuario: UserRole | null;
}

export interface IIamActionError {
  error: string;
}

export interface IAuthActionStateError {
  code: string;
  message: string;
  statusCode: number;
}

export interface IAuthActionState<TData = unknown> {
  success: boolean | null;
  message: string | null;
  errors: IAuthActionStateError | null;
  data: TData | null;
}

export interface IAuthSignInActionData {
  token: string;
  expiraEn: number;
  refrescarToken: string;
  refrescarTokenExpiraEn: number;
}
