'use client'

import { useCallback, useState } from 'react'

export type DashboardConfigurationTab = 'intimacion' | 'informe'

type DashboardConfigurationState = {
  activeTab: DashboardConfigurationTab
  informe: {
    titulo: string
    cuerpo: string
  }
}

const DEFAULT_STATE: DashboardConfigurationState = {
  activeTab: 'intimacion',
  informe: {
    titulo: 'INFORME DE INVESTIGACIÓN',
    cuerpo:
      'Se eleva para su conocimiento y consideración, informe sobre la situación fiscal del contribuyente abajo descripto, solicitando el cargo al Dpto. Inspecciones y Verificaciones, conforme a los fundamentos, datos y periodos fiscales que se indican a continuación:'
  }
}

export function useDashboardConfiguration() {
  const [state, setState] = useState(DEFAULT_STATE)
  const [successOpened, setSuccessOpened] = useState(false)

  const activeTab = state.activeTab

  const updateTab = useCallback((tab: DashboardConfigurationTab) => {
    setState((current) => ({
      ...current,
      activeTab: tab
    }))
  }, [])

  const updateInforme = useCallback(
    (field: keyof DashboardConfigurationState['informe'], value: string) => {
      setState((current) => ({
        ...current,
        informe: {
          ...current.informe,
          [field]: value
        }
      }))
    },
    []
  )

  const confirmChanges = useCallback(() => {
    setSuccessOpened(true)
  }, [])

  const closeSuccess = useCallback(() => {
    setSuccessOpened(false)
  }, [])

  return {
    state,
    activeTab,
    successOpened,
    updateTab,
    updateInforme,
    confirmChanges,
    closeSuccess
  }
}
