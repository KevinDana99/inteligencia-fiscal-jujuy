'use client'

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../data/models/Configuration'

type ConfigContextValue = {
  configuration: ConfigurationType
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
  setConfig: (newConfig: ConfigurationType) => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

type ConfigProviderProps = {
  children: ReactNode
  initialConfig: ConfigurationType
}

export function ConfigProvider({
  children,
  initialConfig
}: ConfigProviderProps) {
  const serializedInitialConfig = JSON.stringify(initialConfig, null, 2)

  console.log({
    action: 'ConfigProvider.initialConfig',
    configuration: initialConfig,
    serializedConfiguration: serializedInitialConfig
  })

  const [configuration, setConfiguration] = useState<ConfigurationType>(initialConfig)

  const updateConfig = useCallback((newConfig: DeepPartial<ConfigurationType>) => {
    console.log({
      action: 'ConfigProvider.updateConfig.request',
      payload: newConfig,
      serializedPayload: JSON.stringify(newConfig, null, 2)
    })

    setConfiguration((current) => {
      const nextConfiguration = {
        ...current,
        ...newConfig,
        intimacion: {
          ...current.intimacion,
          ...newConfig.intimacion
        },
        informe: {
          ...current.informe,
          ...newConfig.informe
        }
      }

      console.log({
        action: 'ConfigProvider.updateConfig.response',
        previous: current,
        next: nextConfiguration,
        serializedPrevious: JSON.stringify(current, null, 2),
        serializedNext: JSON.stringify(nextConfiguration, null, 2)
      })

      return nextConfiguration
    })
  }, [])

  const setConfig = useCallback((newConfig: ConfigurationType) => {
    console.log({
      action: 'ConfigProvider.setConfig',
      configuration: newConfig,
      serializedConfiguration: JSON.stringify(newConfig, null, 2)
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

export { ConfigContext }
