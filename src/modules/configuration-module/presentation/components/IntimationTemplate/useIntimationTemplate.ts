'use client'

import { useCallback, useState } from 'react'
import { DEFAULT_CONFIGURATION } from '../../constants'
import { useConfig } from '../../hooks'
import { getIntimationColumnLabel, INTIMATION_COLUMN_OPTIONS } from '../../utils'

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

function cloneState(state: IntimationTemplateState): IntimationTemplateState {
  return {
    ...state,
    columnas: state.columnas.map((column) => ({ ...column }))
  }
}

function mapConfigurationToTemplateState(
  currentConfiguration: typeof DEFAULT_CONFIGURATION
): IntimationTemplateState {
  return {
    asunto: currentConfiguration.intimacion.asunto,
    saludo: currentConfiguration.intimacion.saludo,
    cuerpo: currentConfiguration.intimacion.cuerpo,
    fuenteInformacion: currentConfiguration.intimacion.fuente_informacion ?? '',
    fechaCorte: currentConfiguration.intimacion.pie,
    columnas: currentConfiguration.intimacion.columnas_seleccionadas.map(
        (columnId) => ({
          id: columnId,
          value: getIntimationColumnLabel(columnId)
        })
      )
  }
}

export function useIntimationTemplate(
  initialState?: IntimationTemplateState
) {
  const { configuration, updateConfig } = useConfig()
  const [columnPickerDraft, setColumnPickerDraft] = useState<IntimationTemplateColumn[]>(
    () =>
      cloneState(
        initialState ?? mapConfigurationToTemplateState(DEFAULT_CONFIGURATION)
      ).columnas
  )
  const [columnPickerOpened, setColumnPickerOpened] = useState(false)
  const [selectedAvailableColumnId, setSelectedAvailableColumnId] = useState<
    string | null
  >(null)
  const [selectedVisibleColumnId, setSelectedVisibleColumnId] = useState<
    string | null
  >(null)
  const isProviderBacked = true

  const state: IntimationTemplateState =
    mapConfigurationToTemplateState(configuration)

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

  const openColumnPicker = useCallback(() => {
    setColumnPickerDraft(state.columnas.map((column) => ({ ...column })))
    setSelectedAvailableColumnId(null)
    setSelectedVisibleColumnId(null)
    setColumnPickerOpened(true)
  }, [state.columnas])

  const closeColumnPicker = useCallback(() => {
    setColumnPickerOpened(false)
    setColumnPickerDraft(state.columnas.map((column) => ({ ...column })))
    setSelectedAvailableColumnId(null)
    setSelectedVisibleColumnId(null)
  }, [state.columnas])

  const confirmColumnPicker = useCallback(() => {
    updateConfig({
      intimacion: {
        columnas_seleccionadas: columnPickerDraft.map((column) => column.id)
      }
    })

    setColumnPickerOpened(false)
    setSelectedAvailableColumnId(null)
    setSelectedVisibleColumnId(null)
  }, [columnPickerDraft, updateConfig])

  const selectAvailableColumn = useCallback((optionId: string) => {
    setSelectedAvailableColumnId(optionId)
    setSelectedVisibleColumnId(null)
  }, [])

  const selectVisibleColumn = useCallback((columnId: string) => {
    setSelectedVisibleColumnId(columnId)
    setSelectedAvailableColumnId(null)
  }, [])

  const addSelectedColumn = useCallback(() => {
    if (!selectedAvailableColumnId) {
      return
    }

    const option = INTIMATION_COLUMN_OPTIONS.find(
      (item) => item.id === selectedAvailableColumnId
    )

    if (!option) {
      return
    }

    setColumnPickerDraft((current) => {
      if (current.some((column) => column.id === option.id)) {
        return current
      }

      return [
        ...current,
        {
          id: option.id,
          value: option.label
        }
      ]
    })
    setSelectedAvailableColumnId(null)
  }, [selectedAvailableColumnId])

  const removeSelectedColumn = useCallback(() => {
    if (!selectedVisibleColumnId) {
      return
    }

    setColumnPickerDraft((current) =>
      current.filter((column) => column.id !== selectedVisibleColumnId)
    )
    setSelectedVisibleColumnId(null)
  }, [selectedVisibleColumnId])

  const updateColumn = useCallback(
    (_columnId: string, _value: string) => {
      return
    },
    []
  )

  const removeColumn = useCallback(
    (columnId: string) => {
      updateConfig({
        intimacion: {
          columnas_seleccionadas: state.columnas
            .filter((column) => column.id !== columnId)
            .map((column) => column.id)
        }
      })
    },
    [state.columnas, updateConfig]
  )

  const visibleColumns = state.columnas

  const availableColumns = INTIMATION_COLUMN_OPTIONS.filter(
    (option) => !columnPickerDraft.some((column) => column.id === option.id)
  )

  return {
    state,
    isProviderBacked,
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnId,
    selectedVisibleColumnId,
    availableColumns,
    visibleColumns,
    updateField,
    openColumnPicker,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn,
    updateColumn,
    removeColumn
  }
}

export type IntimationTemplateController = ReturnType<
  typeof useIntimationTemplate
>
