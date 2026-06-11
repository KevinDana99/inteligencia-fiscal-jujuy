'use client'

import { useCallback } from 'react'
import type {
  ConfigurationType,
  DeepPartial,
  ReportType
} from '../../../data/models/Configuration'

type UseDashboardConfigurationReportParams = {
  informe: ReportType
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
}

export function useDashboardConfigurationReport({
  informe,
  updateConfig
}: UseDashboardConfigurationReportParams) {
  const updateInforme = useCallback(
    (field: keyof ReportType, value: string) => {
      updateConfig({
        informe: {
          [field]: value
        }
      })
    },
    [updateConfig]
  )

  return {
    informe,
    updateInforme
  }
}
