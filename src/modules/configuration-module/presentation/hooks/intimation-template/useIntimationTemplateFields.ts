'use client'

import { useCallback, type ChangeEventHandler } from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../../data/models/Configuration'
import type { IntimationTemplateState } from './useIntimationTemplate'

type UseIntimationTemplateFieldsParams = {
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
  clearError: (
    field: keyof Pick<
      IntimationTemplateState,
      'asunto' | 'saludo' | 'cuerpo' | 'fechaCorte'
    >
  ) => void
}

export function useIntimationTemplateFields({
  updateConfig,
  clearError
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
      clearError('asunto')
      updateField('asunto', event.currentTarget.value)
    },
    [clearError, updateField]
  )

  const handleGreetingChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        clearError('saludo')
        updateField('saludo', event.currentTarget.value)
      },
      [clearError, updateField]
    )

  const handleBodyChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      clearError('cuerpo')
      updateField('cuerpo', event.currentTarget.value)
    },
    [clearError, updateField]
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
        clearError('fechaCorte')
        updateField('fechaCorte', event.currentTarget.value)
      },
      [clearError, updateField]
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
