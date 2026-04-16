export interface IAuthUser {
  userName: string;
  email: string;
  role: 'user' | 'admin';
}

export interface IAuthSession {
  isAuthenticated: boolean;
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
  userName: string;
  email: string;
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

export interface IIamActionError {
  error: string;
}
