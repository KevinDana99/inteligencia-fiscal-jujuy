'use client'

import { useCallback, type ChangeEventHandler } from 'react'
import type { ReportType } from '../../../data/models/Configuration'

type UseConfigurationReportFormParams = {
  informe: ReportType
  onChange: (field: keyof ReportType, value: string) => void
}

export function useConfigurationReportForm({
  informe,
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
      onChange: handleTitleChange
    },
    bodyInput: {
      value: informe.cuerpo,
      onChange: handleBodyChange
    }
  }
}
