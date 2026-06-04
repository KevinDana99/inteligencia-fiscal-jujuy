import type { IAdminAllowedDomains } from '../../data/models/AdminPanel'
import {
  ADMIN_PANEL_CONFIG_STORAGE_KEY,
  FALLBACK_ADMIN_PANEL_CONFIG
} from '../constants/adminPanelConfig'

export function normalizeAllowedDomain(value: string) {
  return value.trim().toLowerCase().replace(/^@/, '')
}

export function toWhitelistEntry(value: string) {
  const normalizedDomain = normalizeAllowedDomain(value)
  return normalizedDomain ? `@${normalizedDomain}` : ''
}

export function normalizeWhitelist(values: string[]) {
  return Array.from(new Set(values.map(toWhitelistEntry).filter(Boolean)))
}

export function mapAllowedDomainsToConfig(
  allowedDomains: IAdminAllowedDomains
): IAdminPanelConfigState {
  return {
    whitelist: normalizeWhitelist(allowedDomains.map((domain) => domain.domain))
  }
}

export function parseStoredAdminPanelConfig(
  value: string | null
): IAdminPanelConfigState | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<IAdminPanelConfigStorageValue>
    const whitelist = parsed.adminConfig?.whitelist

    if (!Array.isArray(whitelist)) {
      return null
    }

    return {
      whitelist: normalizeWhitelist(
        whitelist.filter((item): item is string => typeof item === 'string')
      )
    }
  } catch {
    return null
  }
}

export function getInitialAdminPanelConfig(
  allowedDomains: IAdminAllowedDomains
): IAdminPanelConfigState {
  const serverConfig = mapAllowedDomainsToConfig(allowedDomains)

  if (typeof window === 'undefined') {
    return serverConfig
  }

  const storedConfig = parseStoredAdminPanelConfig(
    window.localStorage.getItem(ADMIN_PANEL_CONFIG_STORAGE_KEY)
  )

  if (serverConfig.whitelist.length > 0) {
    return serverConfig
  }

  return storedConfig ?? FALLBACK_ADMIN_PANEL_CONFIG
}

export function getPersistedAdminPanelConfigValue(
  adminConfig: IAdminPanelConfigState
): IAdminPanelConfigStorageValue {
  return {
    adminConfig
  }
}

export function isEmailAllowedByConfig(
  adminConfig: IAdminPanelConfigState,
  email: string
) {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail || adminConfig.whitelist.length === 0) {
    return false
  }

  return adminConfig.whitelist.some((domain) => normalizedEmail.endsWith(domain))
}

export function getEmailDomainErrorByConfig(
  adminConfig: IAdminPanelConfigState,
  email: string
) {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    return null
  }

  if (adminConfig.whitelist.length === 0) {
    return 'No hay dominios permitidos configurados. Agregá al menos uno en Configuración.'
  }

  if (isEmailAllowedByConfig(adminConfig, normalizedEmail)) {
    return null
  }

  return 'El email debe terminar con uno de los dominios permitidos configurados.'
}

export interface IAdminPanelConfigState {
  whitelist: string[]
}

export interface IAdminPanelConfigStorageValue {
  adminConfig: IAdminPanelConfigState
}
