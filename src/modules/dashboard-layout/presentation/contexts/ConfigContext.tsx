'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../data/models/Configuration'

type ConfigContextValue = {
  configuration: ConfigurationType | null
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
  setConfig: (newConfig: ConfigurationType | null) => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

type ConfigProviderProps = {
  children: ReactNode
  initialConfig: ConfigurationType | null
}

export function ConfigProvider({
  children,
  initialConfig
}: ConfigProviderProps) {
  console.log({
    action: 'ConfigProvider.initialConfig',
    configuration: initialConfig
  })

  const [configuration, setConfiguration] = useState<ConfigurationType | null>(
    initialConfig
  )

  const updateConfig = useCallback((newConfig: DeepPartial<ConfigurationType>) => {
    console.log({
      action: 'ConfigProvider.updateConfig.request',
      payload: newConfig
    })

    setConfiguration((current) => {
      if (!current) {
        console.log({
          action: 'ConfigProvider.updateConfig.skipped',
          reason: 'configuration-is-null'
        })
        return current
      }

      const nextConfiguration = {
        ...current,
        ...newConfig,
        configuracion: {
          ...current.configuracion,
          ...newConfig.configuracion,
          intimacion: {
            ...current.configuracion.intimacion,
            ...newConfig.configuracion?.intimacion
          },
          informe: {
            ...current.configuracion.informe,
            ...newConfig.configuracion?.informe
          }
        }
      }

      console.log({
        action: 'ConfigProvider.updateConfig.response',
        previous: current,
        next: nextConfiguration
      })

      return nextConfiguration
    })
  }, [])

  const setConfig = useCallback((newConfig: ConfigurationType | null) => {
    console.log({
      action: 'ConfigProvider.setConfig',
      configuration: newConfig
    })

    setConfiguration(newConfig)
  }, [])

  const value = useMemo(
    () => ({
      configuration,
      updateConfig,
      setConfig
    }),
    [configuration, setConfig, updateConfig]
  )

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)

  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }

  return context
}
