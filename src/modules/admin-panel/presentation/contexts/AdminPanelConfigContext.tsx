'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import type { IAdminAllowedDomains } from '../../data/models/AdminPanel'

const ADMIN_PANEL_CONFIG_STORAGE_KEY = 'admin-panel-config'

interface IAdminPanelConfigState {
  whitelist: string[]
}

interface IAdminPanelConfigStorageValue {
  adminConfig: IAdminPanelConfigState
}

interface IAdminPanelConfigContextValue {
  adminConfig: IAdminPanelConfigState
  addAllowedDomain: (domain: string) => void
  removeAllowedDomain: (domain: string) => void
  isEmailAllowed: (email: string) => boolean
  getEmailDomainError: (email: string) => string | null
}

const FALLBACK_ADMIN_PANEL_CONFIG: IAdminPanelConfigState = {
  whitelist: []
}

const AdminPanelConfigContext =
  createContext<IAdminPanelConfigContextValue | null>(null)

function normalizeAllowedDomain(value: string) {
  return value.trim().toLowerCase().replace(/^@/, '')
}

function toWhitelistEntry(value: string) {
  const normalizedDomain = normalizeAllowedDomain(value)
  return normalizedDomain ? `@${normalizedDomain}` : ''
}

function normalizeWhitelist(values: string[]) {
  return Array.from(
    new Set(values.map(toWhitelistEntry).filter(Boolean))
  )
}

function mapAllowedDomainsToConfig(
  allowedDomains: IAdminAllowedDomains
): IAdminPanelConfigState {
  return {
    whitelist: normalizeWhitelist(allowedDomains.map((domain) => domain.domain))
  }
}

function parseStoredAdminPanelConfig(
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

function getInitialAdminPanelConfig(
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

export function AdminPanelConfigProvider({
  children,
  initialAllowedDomains
}: {
  children: ReactNode
  initialAllowedDomains: IAdminAllowedDomains
}) {
  const [adminConfig, setAdminConfig] = useState<IAdminPanelConfigState>(() =>
    getInitialAdminPanelConfig(initialAllowedDomains)
  )

  useEffect(() => {
    const storageValue: IAdminPanelConfigStorageValue = {
      adminConfig
    }

    window.localStorage.setItem(
      ADMIN_PANEL_CONFIG_STORAGE_KEY,
      JSON.stringify(storageValue)
    )
  }, [adminConfig])

  const value = useMemo<IAdminPanelConfigContextValue>(() => {
    const addAllowedDomain = (domain: string) => {
      const nextEntry = toWhitelistEntry(domain)

      if (!nextEntry) {
        return
      }

      setAdminConfig((currentValue) => ({
        ...currentValue,
        whitelist: normalizeWhitelist([...currentValue.whitelist, nextEntry])
      }))
    }

    const removeAllowedDomain = (domain: string) => {
      const entryToRemove = toWhitelistEntry(domain)

      if (!entryToRemove) {
        return
      }

      setAdminConfig((currentValue) => ({
        ...currentValue,
        whitelist: currentValue.whitelist.filter(
          (item) => item !== entryToRemove
        )
      }))
    }

    const isEmailAllowed = (email: string) => {
      const normalizedEmail = email.trim().toLowerCase()

      if (!normalizedEmail || adminConfig.whitelist.length === 0) {
        return false
      }

      return adminConfig.whitelist.some((domain) =>
        normalizedEmail.endsWith(domain)
      )
    }

    const getEmailDomainError = (email: string) => {
      const normalizedEmail = email.trim().toLowerCase()

      if (!normalizedEmail) {
        return null
      }

      if (adminConfig.whitelist.length === 0) {
        return 'No hay dominios permitidos configurados. Agregá al menos uno en Configuración.'
      }

      if (isEmailAllowed(normalizedEmail)) {
        return null
      }

      return 'El email debe terminar con uno de los dominios permitidos configurados.'
    }

    return {
      adminConfig,
      addAllowedDomain,
      removeAllowedDomain,
      isEmailAllowed,
      getEmailDomainError
    }
  }, [adminConfig])

  return (
    <AdminPanelConfigContext.Provider value={value}>
      {children}
    </AdminPanelConfigContext.Provider>
  )
}

export function useAdminPanelConfigContext() {
  const context = useContext(AdminPanelConfigContext)

  if (!context) {
    throw new Error(
      'useAdminPanelConfigContext must be used within AdminPanelConfigProvider'
    )
  }

  return context
}
