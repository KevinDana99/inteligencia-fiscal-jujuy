import { AUTH_MOCK_USERS } from './constants';
import type {
  IAuthSession,
  IIamSessionResponse,
  ISerializedAuthSession
} from '@/modules/auth/data/models/Auth';

function resolveUserRole(email: string): 'user' | 'admin' {
  return email === AUTH_MOCK_USERS.admin.email ? 'admin' : 'user';
}

export function mapIamSessionResponseToAuthSession(
  response: IIamSessionResponse
): IAuthSession {
  const now = Date.now();

  return {
    isAuthenticated: true,
    accessToken: response.token,
    accessTokenExpiresAt: new Date(now + response.expiraEn * 1000).toISOString(),
    refreshToken: response.refrescarToken,
    refreshTokenExpiresAt: new Date(
      now + response.refrescarTokenExpiraEn * 1000
    ).toISOString(),
    user: {
      userName: response.usuario.nombreUsuario,
      email: response.usuario.correo,
      role: resolveUserRole(response.usuario.correo)
    }
  };
}

export function serializeAuthSession(
  session: IAuthSession
): ISerializedAuthSession | null {
  if (
    !session.accessToken ||
    !session.accessTokenExpiresAt ||
    !session.refreshToken ||
    !session.refreshTokenExpiresAt
  ) {
    return null;
  }

  return {
    accessToken: session.accessToken,
    accessTokenExpiresAt: session.accessTokenExpiresAt,
    refreshToken: session.refreshToken,
    refreshTokenExpiresAt: session.refreshTokenExpiresAt,
    userName: session.user.userName,
    email: session.user.email
  };
}

export function mapSerializedSessionToAuthSession(
  serializedSession: ISerializedAuthSession | null
): IAuthSession | null {
  if (!serializedSession) {
    return null;
  }

  return {
    isAuthenticated: true,
    accessToken: serializedSession.accessToken,
    accessTokenExpiresAt: serializedSession.accessTokenExpiresAt,
    refreshToken: serializedSession.refreshToken,
    refreshTokenExpiresAt: serializedSession.refreshTokenExpiresAt,
    user: {
      userName: serializedSession.userName,
      email: serializedSession.email,
      role: resolveUserRole(serializedSession.email)
    }
  };
}

export function isSessionExpired(isoDate?: string | null): boolean {
  if (!isoDate) {
    return true;
  }

  return Date.parse(isoDate) <= Date.now();
}
