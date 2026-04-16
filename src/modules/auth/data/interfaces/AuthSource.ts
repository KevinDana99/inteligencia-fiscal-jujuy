import type {
  ICommandResult,
  IAuthSession,
  IIamRefreshSessionRequest,
  IIamRefreshSessionResponse,
  IIamSessionResponse,
  IIamSignInRequest
} from '../models/Auth';

export interface IAuthQueryPort {
  getSession(): Promise<IAuthSession | null>;
}

export interface IAuthCommandPort {
  signIn(params: IIamSignInRequest): Promise<IIamSessionResponse>;
  signOut(refreshToken?: string): Promise<ICommandResult>;
  refreshSession(params: IIamRefreshSessionRequest): Promise<IIamRefreshSessionResponse>;
}

export interface IAuthSource extends IAuthQueryPort, IAuthCommandPort {}
