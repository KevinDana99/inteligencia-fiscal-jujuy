'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import type { IAdminAllowedDomains } from '../../data/models/AdminPanel'
import { ADMIN_PANEL_CONFIG_STORAGE_KEY } from '../constants/adminPanelConfig'
import {
  getEmailDomainErrorByConfig,
  getInitialAdminPanelConfig,
  getPersistedAdminPanelConfigValue,
  isEmailAllowedByConfig,
  normalizeWhitelist,
  toWhitelistEntry,
  type IAdminPanelConfigState
} from '../utils/adminPanelConfig'

const AdminPanelConfigContext =
  createContext<IAdminPanelConfigContextValue | null>(null)

export function AdminPanelConfigProvider({
  children,
  initialAllowedDomains
}: AdminPanelConfigProviderProps) {
  const value = useAdminPanelConfigProvider(initialAllowedDomains)

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

function useAdminPanelConfigProvider(
  initialAllowedDomains: IAdminAllowedDomains
): IAdminPanelConfigContextValue {
  const [adminConfig, setAdminConfig] = useState<IAdminPanelConfigState>(() =>
    getInitialAdminPanelConfig(initialAllowedDomains)
  )

  useEffect(() => {
    const storageValue = getPersistedAdminPanelConfigValue(adminConfig)

    window.localStorage.setItem(
      ADMIN_PANEL_CONFIG_STORAGE_KEY,
      JSON.stringify(storageValue)
    )
  }, [adminConfig])

  const addAllowedDomain = useCallback((domain: string) => {
    const nextEntry = toWhitelistEntry(domain)

    if (!nextEntry) {
      return
    }

    setAdminConfig((currentValue) => ({
      ...currentValue,
      whitelist: normalizeWhitelist([...currentValue.whitelist, nextEntry])
    }))
  }, [])

  const removeAllowedDomain = useCallback((domain: string) => {
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
  }, [])

  const isEmailAllowed = useCallback(
    (email: string) => isEmailAllowedByConfig(adminConfig, email),
    [adminConfig]
  )

  const getEmailDomainError = useCallback(
    (email: string) => getEmailDomainErrorByConfig(adminConfig, email),
    [adminConfig]
  )

  return useMemo(
    () => ({
      allowedDomains: initialAllowedDomains,
      adminConfig,
      addAllowedDomain,
      removeAllowedDomain,
      isEmailAllowed,
      getEmailDomainError
    }),
    [
      addAllowedDomain,
      adminConfig,
      getEmailDomainError,
      initialAllowedDomains,
      isEmailAllowed,
      removeAllowedDomain
    ]
  )
}

interface AdminPanelConfigProviderProps {
  children: ReactNode
  initialAllowedDomains: IAdminAllowedDomains
}

interface IAdminPanelConfigContextValue {
  allowedDomains: IAdminAllowedDomains
  adminConfig: IAdminPanelConfigState
  addAllowedDomain: (domain: string) => void
  removeAllowedDomain: (domain: string) => void
  isEmailAllowed: (email: string) => boolean
  getEmailDomainError: (email: string) => string | null
}
