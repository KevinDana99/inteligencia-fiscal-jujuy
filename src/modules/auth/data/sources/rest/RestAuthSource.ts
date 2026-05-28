import { ApiClientError, getJson, postJson } from '@/lib/api-client';
import type { ApiClientConfig } from '@/lib/api-client';
import type { IAuthSource } from '../../interfaces/AuthSource';
import type {
  IIamCurrentContextResponse,
  ICommandResult,
  IIamRefreshSessionRequest,
  IIamRefreshSessionResponse,
  IIamSessionResponse,
  IIamSignInRequest
} from '../../models/Auth';
import type {
  ApiIamCurrentContextResponseDto,
  ApiIamRefreshSessionRequestDto,
  ApiIamSessionResponseDto,
  ApiIamSignInRequestDto,
  ApiIamSignOutRequestDto
} from './dtos/IamDtos';

export class RestAuthSource implements IAuthSource {
  constructor(private readonly config: ApiClientConfig) {}

  async signIn(params: IIamSignInRequest): Promise<IIamSessionResponse> {
    const payload: ApiIamSignInRequestDto = {
      correo: params.correo,
      contrasena: params.contrasena
    };

    try {
      return await postJson<ApiIamSessionResponseDto, ApiIamSignInRequestDto>(
        '/api/iam/autenticacion/inicio-sesion',
        payload,
        this.config
      );
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        throw new Error('Invalid credentials');
      }

      throw new Error('Unable to sign in');
    }
  }

  async signOut(refreshToken?: string): Promise<ICommandResult> {
    if (!refreshToken) {
      return { success: true };
    }

    const payload: ApiIamSignOutRequestDto = {
      refrescarToken: refreshToken
    };

    try {
      await postJson<null, ApiIamSignOutRequestDto>(
        '/api/iam/autenticacion/cerrar-sesion',
        payload,
        this.config
      );

      return { success: true };
    } catch {
      return { success: false, error: 'Unable to sign out' };
    }
  }

  async refreshSession(
    params: IIamRefreshSessionRequest
  ): Promise<IIamRefreshSessionResponse> {
    const payload: ApiIamRefreshSessionRequestDto = {
      refrescarToken: params.refrescarToken
    };

    try {
      return await postJson<
        ApiIamSessionResponseDto,
        ApiIamRefreshSessionRequestDto
      >('/api/iam/autenticacion/renovar-sesion', payload, this.config);
    } catch {
      throw new Error('Unable to refresh session');
    }
  }

  async getCurrentContext(accessToken: string): Promise<IIamCurrentContextResponse> {
    try {
      return await getJson<ApiIamCurrentContextResponseDto>(
        '/api/iam/autenticacion/contexto-actual',
        {
          ...this.config,
          token: accessToken
        }
      );
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        throw new Error('Unauthorized');
      }

      throw new Error('Unable to fetch current context');
    }
  }
}
