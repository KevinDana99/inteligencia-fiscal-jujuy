'use client'

import { createContext, type ReactNode } from 'react'
import type { ConfigurationType } from '../../data/models/Configuration'
import {
  useConfigProviderValue,
  type ConfigContextValue
} from '../hooks/config-provider'

const ConfigContext = createContext<ConfigContextValue | null>(null)

type ConfigProviderProps = {
  children: ReactNode
  initialConfig: ConfigurationType
}

export function ConfigProvider({
  children,
  initialConfig
}: ConfigProviderProps) {
  const value = useConfigProviderValue(initialConfig)

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  )
}

export { ConfigContext }
