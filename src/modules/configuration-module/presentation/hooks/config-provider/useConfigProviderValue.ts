'use client'

import { useCallback, useMemo, useState } from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../../data/models/Configuration'
import { mergeConfiguration } from '../../utils'

export type ConfigContextValue = {
  configuration: ConfigurationType
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
  setConfig: (newConfig: ConfigurationType) => void
}

export function useConfigProviderValue(
  initialConfig: ConfigurationType
): ConfigContextValue {
  const [configuration, setConfiguration] =
    useState<ConfigurationType>(initialConfig)

  const updateConfig = useCallback(
    (newConfig: DeepPartial<ConfigurationType>) => {
      setConfiguration((current) => mergeConfiguration(current, newConfig))
    },
    []
  )

  const setConfig = useCallback((newConfig: ConfigurationType) => {
    setConfiguration(newConfig)
  }, [])

  return useMemo(
    () => ({
      configuration,
      updateConfig,
      setConfig
    }),
    [configuration, setConfig, updateConfig]
  )
}
