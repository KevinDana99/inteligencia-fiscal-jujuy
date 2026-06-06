'use client'

import { useMemo } from 'react'
import { DEFAULT_CONFIGURATION } from '../../constants'
import { useConfig } from '../useConfig'
import {
  cloneIntimationTemplateState,
  mapConfigurationToTemplateState
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

export function useIntimationTemplate(initialState?: IntimationTemplateState) {
  const { configuration, updateConfig } = useConfig()
  const isProviderBacked = true
  const state = mapConfigurationToTemplateState(configuration)
  const initialColumns = useMemo(
    () =>
      cloneIntimationTemplateState(
        initialState ?? mapConfigurationToTemplateState(DEFAULT_CONFIGURATION)
      ).columnas,
    [initialState]
  )

  const fields = useIntimationTemplateFields({
    updateConfig
  })
  const columns = useIntimationTemplateColumns({
    visibleColumns: state.columnas,
    isProviderBacked,
    updateConfig
  })
  const columnPicker = useIntimationTemplateColumnPicker({
    initialColumns,
    currentColumns: state.columnas,
    updateConfig
  })

  return {
    state,
    isProviderBacked,
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
