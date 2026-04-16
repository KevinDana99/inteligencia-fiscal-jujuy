import { AUTH_MOCK_USERS } from './constants';
import { mapIamSessionResponseToAuthSession } from './session-mapper';
import type {
  IAuthSession,
  IIamRefreshSessionRequest,
  IIamSessionResponse,
} from '@/modules/auth/data/models/Auth';

const isMockEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';
};

function buildMockSessionResponse(
  refreshToken: string,
  email: string = AUTH_MOCK_USERS.user.email,
  userName: string = AUTH_MOCK_USERS.user.userName
): IIamSessionResponse {
  const tokenSeed = Math.random().toString(36).slice(2);

  return {
    token: `mock-access-token-${tokenSeed}`,
    expiraEn: 300,
    refrescarToken: refreshToken.startsWith('mock-refresh-token-')
      ? refreshToken
      : `mock-refresh-token-${tokenSeed}`,
    refrescarTokenExpiraEn: 60 * 60 * 24 * 7,
    usuario: {
      nombreUsuario: userName,
      correo: email
    }
  };
}

export async function refreshAuthSession(
  params: IIamRefreshSessionRequest & {
    email?: string;
    userName?: string;
  }
): Promise<IAuthSession | null> {
  if (!params.refrescarToken) {
    return null;
  }

  if (isMockEnabled()) {
    const mockUser =
      params.email === AUTH_MOCK_USERS.admin.email
        ? AUTH_MOCK_USERS.admin
        : AUTH_MOCK_USERS.user;

    return mapIamSessionResponseToAuthSession(
      buildMockSessionResponse(
        params.refrescarToken,
        params.email ?? mockUser.email,
        params.userName ?? mockUser.userName
      )
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const response = await fetch(`${baseUrl}/api/iam/autenticacion/renovar-sesion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      refrescarToken: params.refrescarToken
    })
  });

  if (!response.ok) {
    return null;
  }

  const sessionResponse = (await response.json()) as IIamSessionResponse;
  return mapIamSessionResponseToAuthSession(sessionResponse);
}
