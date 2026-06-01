import type {
  IAdminPanelActionState,
  IAdminPanelCreateUserActionData
} from '@/modules/admin-panel/data/models/AdminPanel'

export const INITIAL_CREATE_ADMIN_USER_STATE: IAdminPanelActionState<IAdminPanelCreateUserActionData> =
  {
    success: null,
    message: null,
    errors: null,
    data: null
  }
