import type { IAdminPanelConfigState } from '../utils/adminPanelConfig'

export const ADMIN_PANEL_CONFIG_STORAGE_KEY = 'admin-panel-config'

export const FALLBACK_ADMIN_PANEL_CONFIG: IAdminPanelConfigState = {
  whitelist: []
}
