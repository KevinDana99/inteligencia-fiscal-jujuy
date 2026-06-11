'use client'

import { useCallback, useState } from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../../data/models/Configuration'
import {
  cloneIntimationTemplateColumns,
  getAvailableIntimationColumns,
  getIntimationColumnOptionById
} from '../../utils'
import type { IntimationTemplateColumn } from './useIntimationTemplate'

type UseIntimationTemplateColumnPickerParams = {
  initialColumns: IntimationTemplateColumn[]
  currentColumns: IntimationTemplateColumn[]
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
}

export function useIntimationTemplateColumnPicker({
  initialColumns,
  currentColumns,
  updateConfig
}: UseIntimationTemplateColumnPickerParams) {
  const [columnPickerDraft, setColumnPickerDraft] = useState<
    IntimationTemplateColumn[]
  >(() => cloneIntimationTemplateColumns(initialColumns))
  const [columnPickerOpened, setColumnPickerOpened] = useState(false)
  const [selectedAvailableColumnId, setSelectedAvailableColumnId] = useState<
    string | null
  >(null)
  const [selectedVisibleColumnId, setSelectedVisibleColumnId] = useState<
    string | null
  >(null)

  const resetPickerSelection = useCallback(() => {
    setSelectedAvailableColumnId(null)
    setSelectedVisibleColumnId(null)
  }, [])

  const resetDraftFromCurrentColumns = useCallback(() => {
    setColumnPickerDraft(cloneIntimationTemplateColumns(currentColumns))
  }, [currentColumns])

  const openColumnPicker = useCallback(() => {
    resetDraftFromCurrentColumns()
    resetPickerSelection()
    setColumnPickerOpened(true)
  }, [resetDraftFromCurrentColumns, resetPickerSelection])

  const closeColumnPicker = useCallback(() => {
    setColumnPickerOpened(false)
    resetDraftFromCurrentColumns()
    resetPickerSelection()
  }, [resetDraftFromCurrentColumns, resetPickerSelection])

  const confirmColumnPicker = useCallback(() => {
    updateConfig({
      intimacion: {
        columnas_seleccionadas: columnPickerDraft.map((column) => column.id)
      }
    })

    setColumnPickerOpened(false)
    resetPickerSelection()
  }, [columnPickerDraft, resetPickerSelection, updateConfig])

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

    const option = getIntimationColumnOptionById(selectedAvailableColumnId)

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

  return {
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnId,
    selectedVisibleColumnId,
    availableColumns: getAvailableIntimationColumns(columnPickerDraft),
    openColumnPicker,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn
  }
}
