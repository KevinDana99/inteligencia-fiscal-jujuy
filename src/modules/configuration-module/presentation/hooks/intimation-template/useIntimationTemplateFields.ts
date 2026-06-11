'use client'

import { useCallback, type ChangeEventHandler } from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../../data/models/Configuration'
import type { IntimationTemplateState } from './useIntimationTemplate'

type UseIntimationTemplateFieldsParams = {
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
}

export function useIntimationTemplateFields({
  updateConfig
}: UseIntimationTemplateFieldsParams) {
  const updateField = useCallback(
    (field: keyof IntimationTemplateState, value: string) => {
      switch (field) {
        case 'asunto':
        case 'saludo':
        case 'cuerpo':
          updateConfig({
            intimacion: {
              [field]: value
            }
          })
          return
        case 'fuenteInformacion':
          updateConfig({
            intimacion: {
              fuente_informacion: value
            }
          })
          return
        case 'fechaCorte':
          updateConfig({
            intimacion: {
              pie: value
            }
          })
          return
        default:
          return
      }
    },
    [updateConfig]
  )

  const handleSubjectChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      updateField('asunto', event.currentTarget.value)
    },
    [updateField]
  )

  const handleGreetingChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        updateField('saludo', event.currentTarget.value)
      },
      [updateField]
    )

  const handleBodyChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      updateField('cuerpo', event.currentTarget.value)
    },
    [updateField]
  )

  const handleInformationSourceChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        updateField('fuenteInformacion', event.currentTarget.value)
      },
      [updateField]
    )

  const handleCutoffDateChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        updateField('fechaCorte', event.currentTarget.value)
      },
      [updateField]
    )

  return {
    updateField,
    fieldHandlers: {
      handleSubjectChange,
      handleGreetingChange,
      handleBodyChange,
      handleInformationSourceChange,
      handleCutoffDateChange
    }
  }
}
