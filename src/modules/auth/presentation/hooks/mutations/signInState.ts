import type {
  IAuthActionState,
  IAuthSignInActionData
} from '@/modules/auth/data/models/Auth';

export const INITIAL_SIGN_IN_STATE: IAuthActionState<IAuthSignInActionData> = {
  success: null,
  message: null,
  errors: null,
  data: null
};
