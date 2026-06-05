'use client'

import { useCallback, useMemo, useState } from 'react'
import { useConfig } from '../contexts'
import type { ReportType } from '../../data/models/Configuration'

export type DashboardConfigurationTab = 'intimacion' | 'informe'

type DashboardConfigurationState = {
  activeTab: DashboardConfigurationTab
}

const DEFAULT_STATE: DashboardConfigurationState = {
  activeTab: 'intimacion'
}

const DEFAULT_REPORT: ReportType = {
  titulo: 'INFORME DE INVESTIGACIÓN',
  cuerpo:
    'Se eleva para su conocimiento y consideración, informe sobre la situación fiscal del contribuyente abajo descripto, solicitando el cargo al Dpto. Inspecciones y Verificaciones, conforme a los fundamentos, datos y periodos fiscales que se indican a continuación:'
}

export function useDashboardConfiguration() {
  const { configuration, updateConfig } = useConfig()
  const [state, setState] = useState(DEFAULT_STATE)
  const [successOpened, setSuccessOpened] = useState(false)

  const activeTab = state.activeTab
  const informe = useMemo(
    () => configuration?.configuracion.informe ?? DEFAULT_REPORT,
    [configuration]
  )

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
      if (!configuration) {
        return
      }

      updateConfig({
        configuracion: {
          informe: {
            [field]: value
          }
        }
      })
    },
    [configuration, updateConfig]
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
