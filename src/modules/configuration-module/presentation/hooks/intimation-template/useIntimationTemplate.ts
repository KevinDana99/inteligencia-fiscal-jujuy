'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  DEFAULT_CONFIGURATION,
  type IntimationColumnOption
} from '../../constants'
import { useConfig } from '../useConfig'
import {
  cloneIntimationTemplateState,
  mapConfigurationToTemplateState,
  type IntimationTemplateValidationErrors,
  validateIntimationTemplateState
} from '../../utils'
import { useIntimationTemplateColumnPicker } from './useIntimationTemplateColumnPicker'
import { useIntimationTemplateColumns } from './useIntimationTemplateColumns'
import { useIntimationTemplateFields } from './useIntimationTemplateFields'

export type IntimationTemplateColumn = {
  id: string
  value: string
}

export type IntimationTemplateState = {
  asunto: string
  saludo: string
  cuerpo: string
  fuenteInformacion: string
  fechaCorte: string
  columnas: IntimationTemplateColumn[]
}

export type UseIntimationTemplateParams = {
  initialState?: IntimationTemplateState
  columnOptions?: IntimationColumnOption[]
}

export function useIntimationTemplate(
  params?: IntimationTemplateState | UseIntimationTemplateParams
) {
  const { initialState, columnOptions } =
    resolveIntimationTemplateParams(params)
  const { configuration, updateConfig } = useConfig()
  const isProviderBacked = true
  const state = mapConfigurationToTemplateState(configuration, columnOptions)
  const [errors, setErrors] = useState<IntimationTemplateValidationErrors>({})
  const initialColumns = useMemo(
    () =>
      cloneIntimationTemplateState(
        initialState ??
          mapConfigurationToTemplateState(DEFAULT_CONFIGURATION, columnOptions)
      ).columnas,
    [columnOptions, initialState]
  )
  const clearError = useCallback(
    (
      field: keyof Pick<
        IntimationTemplateState,
        'asunto' | 'saludo' | 'cuerpo' | 'fechaCorte'
      >
    ) => {
      setErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors
        }

        return {
          ...currentErrors,
          [field]: undefined
        }
      })
    },
    []
  )
  const clearColumnsError = useCallback(() => {
    setErrors((currentErrors) => {
      if (!currentErrors.columnas) {
        return currentErrors
      }

      return {
        ...currentErrors,
        columnas: undefined
      }
    })
  }, [])
  const validate = useCallback(
    ({ allowedColumns = true }: { allowedColumns?: boolean } = {}) => {
      const result = validateIntimationTemplateState(state, {
        allowedColumns
      })

      setErrors(result.errors)

      return result.success
    },
    [state]
  )

  const fields = useIntimationTemplateFields({
    updateConfig,
    clearError
  })
  const columns = useIntimationTemplateColumns({
    visibleColumns: state.columnas,
    isProviderBacked,
    updateConfig,
    clearColumnsError
  })
  const columnPicker = useIntimationTemplateColumnPicker({
    initialColumns,
    currentColumns: state.columnas,
    columnOptions,
    updateConfig,
    clearColumnsError
  })

  return {
    state,
    errors,
    isProviderBacked,
    validate,
    ...columnPicker,
    visibleColumns: columns.visibleColumns,
    columnRows: columns.columnRows,
    updateField: fields.updateField,
    fieldHandlers: fields.fieldHandlers,
    updateColumn: columns.updateColumn,
    removeColumn: columns.removeColumn
  }
}

export type IntimationTemplateController = ReturnType<
  typeof useIntimationTemplate
>

function resolveIntimationTemplateParams(
  params?: IntimationTemplateState | UseIntimationTemplateParams
): UseIntimationTemplateParams {
  if (!params) {
    return {}
  }

  if ('columnas' in params) {
    return { initialState: params }
  }

  return params
}
