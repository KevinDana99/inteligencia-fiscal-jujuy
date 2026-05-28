import type {
  ICommandResult,
  IIamCurrentContextResponse,
  IIamRefreshSessionRequest,
  IIamRefreshSessionResponse,
  IIamSessionResponse,
  IIamSignInRequest
} from '../models/Auth';

export interface IAuthCommandPort {
  signIn(params: IIamSignInRequest): Promise<IIamSessionResponse>;
  signOut(refreshToken?: string): Promise<ICommandResult>;
  refreshSession(params: IIamRefreshSessionRequest): Promise<IIamRefreshSessionResponse>;
  getCurrentContext(accessToken: string): Promise<IIamCurrentContextResponse>;
}

export type IAuthSource = IAuthCommandPort;
