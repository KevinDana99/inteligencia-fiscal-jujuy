'use client'

import { useCallback, useState } from 'react'
import type {
  ConfigurationType,
  DeepPartial,
  ReportType
} from '../../../data/models/Configuration'
import {
  type ConfigurationReportValidationErrors,
  validateConfigurationReport
} from '../../utils'

type UseDashboardConfigurationReportParams = {
  informe: ReportType
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
}

export function useDashboardConfigurationReport({
  informe,
  updateConfig
}: UseDashboardConfigurationReportParams) {
  const [errors, setErrors] = useState<ConfigurationReportValidationErrors>({})

  const updateInforme = useCallback(
    (field: keyof ReportType, value: string) => {
      setErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors
        }

        return {
          ...currentErrors,
          [field]: undefined
        }
      })

      updateConfig({
        informe: {
          [field]: value
        }
      })
    },
    [updateConfig]
  )

  const validateInforme = useCallback(() => {
    const result = validateConfigurationReport(informe)

    setErrors(result.errors)

    return result.success
  }, [informe])

  return {
    informe,
    errors,
    updateInforme,
    validateInforme
  }
}
