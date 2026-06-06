'use client'

import { useCallback, useState } from 'react'
import { useConfig } from './useConfig'
import type { ReportType } from '../../data/models/Configuration'

export type DashboardConfigurationTab = 'intimacion' | 'informe'

type DashboardConfigurationState = {
  activeTab: DashboardConfigurationTab
}

const DEFAULT_STATE: DashboardConfigurationState = {
  activeTab: 'intimacion'
}

export function useDashboardConfiguration() {
  const { configuration, updateConfig } = useConfig()
  const [state, setState] = useState(DEFAULT_STATE)
  const [successOpened, setSuccessOpened] = useState(false)

  const activeTab = state.activeTab
  const informe = configuration.informe

  const updateTab = useCallback((tab: DashboardConfigurationTab) => {
    setState((current) => ({
      ...current,
      activeTab: tab
    }))
  }, [])

  const updateInforme = useCallback(
    (
      field: keyof ReportType,
      value: string
    ) => {
      updateConfig({
        informe: {
          [field]: value
        }
      })
    },
    [updateConfig]
  )

  const confirmChanges = useCallback(() => {
    setSuccessOpened(true)
  }, [])

  const closeSuccess = useCallback(() => {
    setSuccessOpened(false)
  }, [])

  return {
    state,
    informe,
    activeTab,
    successOpened,
    updateTab,
    updateInforme,
    confirmChanges,
    closeSuccess
  }
}
