import { USER_ROLES } from '@/constants';
import { AUTH_MOCK_USERS } from '@/lib/auth/constants';
import type { IAuthSource } from '../../interfaces/AuthSource';
import type {
  ICommandResult,
  IIamCurrentContextResponse,
  IIamRefreshSessionRequest,
  IIamSessionResponse,
  IIamSignInRequest
} from '../../models/Auth';

function createMockIamSessionResponse(
  seed: string,
  user: {
    userName: string;
    email: string;
    role?: string;
  }
): IIamSessionResponse {
  const normalizedRole = user.role ?? 'user';

  return {
    token: `mock-access-token-${normalizedRole}-${seed}`,
    expiraEn: 300,
    refrescarToken: `mock-refresh-token-${normalizedRole}-${seed}`,
    refrescarTokenExpiraEn: 60 * 60 * 24 * 7,
    usuario: {
      nombreUsuario: user.userName,
      correo: user.email
    }
  };
}

function findMockUser(correo: string, contrasena: string) {
  return Object.values(AUTH_MOCK_USERS).find(
    (user) => user.email === correo && user.password === contrasena
  );
}

function buildMockCurrentContextResponse(token: string): IIamCurrentContextResponse {
  const user = token.includes('admin') ? AUTH_MOCK_USERS.admin : AUTH_MOCK_USERS.user;

  return {
    autenticado: true,
    esquema: 'AuthenticationTypes.Mock',
    nombreUsuario: user.userName,
    correo: user.email,
    sujeto: `mock-subject-${user.role}`,
    tipoUsuario:
      user.role === 'admin' ? USER_ROLES.ADMIN : USER_ROLES.FISCAL_ANALYST
  };
}

export class MockAuthSource implements IAuthSource {
  async signIn(params: IIamSignInRequest): Promise<IIamSessionResponse> {
    const user = findMockUser(params.correo, params.contrasena);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const seed = Math.random().toString(36).slice(2);
    return createMockIamSessionResponse(seed, user);
  }

  async signOut(): Promise<ICommandResult> {
    return { success: true };
  }

  async refreshSession(
    params: IIamRefreshSessionRequest
  ): Promise<IIamSessionResponse> {
    if (!params.refrescarToken.startsWith('mock-refresh-token-')) {
      throw new Error('Invalid refresh token');
    }

    const user =
      params.refrescarToken.includes('admin')
        ? AUTH_MOCK_USERS.admin
        : AUTH_MOCK_USERS.user;

    return createMockIamSessionResponse(Math.random().toString(36).slice(2), user);
  }

  async getCurrentContext(accessToken: string): Promise<IIamCurrentContextResponse> {
    if (!accessToken.startsWith('mock-access-token-')) {
      throw new Error('Unauthorized');
    }

    return buildMockCurrentContextResponse(accessToken);
  }
}
