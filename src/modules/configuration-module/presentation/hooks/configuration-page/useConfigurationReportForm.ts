'use client'

import { useCallback, type ChangeEventHandler } from 'react'
import type { ReportType } from '../../../data/models/Configuration'
import type { ConfigurationReportValidationErrors } from '../../utils'

type UseConfigurationReportFormParams = {
  informe: ReportType
  errors: ConfigurationReportValidationErrors
  onChange: (field: keyof ReportType, value: string) => void
}

export function useConfigurationReportForm({
  informe,
  errors,
  onChange
}: UseConfigurationReportFormParams) {
  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onChange('titulo', event.currentTarget.value)
    },
    [onChange]
  )

  const handleBodyChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      onChange('cuerpo', event.currentTarget.value)
    },
    [onChange]
  )

  return {
    titleInput: {
      value: informe.titulo,
      onChange: handleTitleChange,
      error: errors.titulo
    },
    bodyInput: {
      value: informe.cuerpo,
      onChange: handleBodyChange,
      error: errors.cuerpo
    }
  }
}
