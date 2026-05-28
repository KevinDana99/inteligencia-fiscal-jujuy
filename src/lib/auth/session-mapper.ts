import type {
  IAuthUser,
  IAuthSession,
  IIamCurrentContextResponse,
  IIamSessionResponse,
  ISerializedAuthSession
} from '@/modules/auth/data/models/Auth';

export function mapIamSessionResponseToSerializedAuthSession(
  response: IIamSessionResponse
): ISerializedAuthSession {
  const now = Date.now();

  return {
    accessToken: response.token,
    accessTokenExpiresAt: new Date(now + response.expiraEn * 1000).toISOString(),
    refreshToken: response.refrescarToken,
    refreshTokenExpiresAt: new Date(now + response.refrescarTokenExpiraEn * 1000).toISOString()
  };
}

export function mapIamCurrentContextResponseToAuthUser(
  response: IIamCurrentContextResponse
): IAuthUser {
  return {
    autenticado: response.autenticado,
    esquema: response.esquema,
    nombreUsuario: response.nombreUsuario,
    correo: response.correo,
    sujeto: response.sujeto,
    tipoUsuario: response.tipoUsuario
  };
}

export function composeAuthSession(
  serializedSession: ISerializedAuthSession,
  user: IAuthUser
): IAuthSession {
  return {
    accessToken: serializedSession.accessToken,
    accessTokenExpiresAt: serializedSession.accessTokenExpiresAt,
    refreshToken: serializedSession.refreshToken,
    refreshTokenExpiresAt: serializedSession.refreshTokenExpiresAt,
    user
  };
}

export function isSessionExpired(isoDate?: string | null): boolean {
  if (!isoDate) {
    return true;
  }

  return Date.parse(isoDate) <= Date.now();
}
