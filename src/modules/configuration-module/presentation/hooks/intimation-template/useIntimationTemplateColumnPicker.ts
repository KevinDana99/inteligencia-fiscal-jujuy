'use client'

import { useCallback, useState } from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../../data/models/Configuration'
import {
  cloneIntimationTemplateColumns,
  getAvailableIntimationColumns,
  getIntimationColumnOptionById,
  reorderIntimationTemplateColumns
} from '../../utils'
import type { IntimationColumnOption } from '../../constants'
import type { IntimationTemplateColumn } from './useIntimationTemplate'

type UseIntimationTemplateColumnPickerParams = {
  initialColumns: IntimationTemplateColumn[]
  currentColumns: IntimationTemplateColumn[]
  columnOptions?: IntimationColumnOption[]
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
  clearColumnsError: () => void
}

export function useIntimationTemplateColumnPicker({
  initialColumns,
  currentColumns,
  columnOptions,
  updateConfig,
  clearColumnsError
}: UseIntimationTemplateColumnPickerParams) {
  const [columnPickerDraft, setColumnPickerDraft] = useState<
    IntimationTemplateColumn[]
  >(() => cloneIntimationTemplateColumns(initialColumns))
  const [columnPickerOpened, setColumnPickerOpened] = useState(false)
  const [selectedAvailableColumnIds, setSelectedAvailableColumnIds] = useState<
    string[]
  >([])
  const [selectedVisibleColumnIds, setSelectedVisibleColumnIds] = useState<
    string[]
  >([])
  const [draggingDraftColumnId, setDraggingDraftColumnId] = useState<
    string | null
  >(null)
  const [dragOverDraftColumnId, setDragOverDraftColumnId] = useState<
    string | null
  >(null)

  const resetPickerSelection = useCallback(() => {
    setSelectedAvailableColumnIds([])
    setSelectedVisibleColumnIds([])
    setDraggingDraftColumnId(null)
    setDragOverDraftColumnId(null)
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
    clearColumnsError()
    updateConfig({
      intimacion: {
        columnas_seleccionadas: columnPickerDraft.map((column) => column.id)
      }
    })

    setColumnPickerOpened(false)
    resetPickerSelection()
  }, [clearColumnsError, columnPickerDraft, resetPickerSelection, updateConfig])

  const selectAvailableColumn = useCallback((optionId: string) => {
    setSelectedAvailableColumnIds((currentIds) =>
      toggleSelectedColumnId(currentIds, optionId)
    )
    setSelectedVisibleColumnIds([])
  }, [])

  const selectVisibleColumn = useCallback((columnId: string) => {
    setSelectedVisibleColumnIds((currentIds) =>
      toggleSelectedColumnId(currentIds, columnId)
    )
    setSelectedAvailableColumnIds([])
  }, [])

  const addSelectedColumn = useCallback(() => {
    if (selectedAvailableColumnIds.length === 0) {
      return
    }

    const selectedOptions = selectedAvailableColumnIds
      .map((columnId) => getIntimationColumnOptionById(columnId, columnOptions))
      .filter((option): option is IntimationColumnOption => Boolean(option))

    if (selectedOptions.length === 0) {
      return
    }

    setColumnPickerDraft((current) => {
      const currentIds = new Set(current.map((column) => column.id))
      const nextColumns = selectedOptions
        .filter((option) => !currentIds.has(option.id))
        .map((option) => ({
          id: option.id,
          value: option.label
        }))

      return [...current, ...nextColumns]
    })
    setSelectedAvailableColumnIds([])
  }, [columnOptions, selectedAvailableColumnIds])

  const removeSelectedColumn = useCallback(() => {
    if (selectedVisibleColumnIds.length === 0) {
      return
    }

    const selectedIds = new Set(selectedVisibleColumnIds)
    setColumnPickerDraft((current) =>
      current.filter((column) => !selectedIds.has(column.id))
    )
    setSelectedVisibleColumnIds([])
  }, [selectedVisibleColumnIds])

  const reorderDraftColumn = useCallback(
    (sourceColumnId: string, targetColumnId: string) => {
      setColumnPickerDraft((currentColumns) =>
        reorderIntimationTemplateColumns(
          currentColumns,
          sourceColumnId,
          targetColumnId
        )
      )
      setSelectedAvailableColumnIds([])
      setSelectedVisibleColumnIds([sourceColumnId])
    },
    []
  )

  return {
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnIds,
    selectedVisibleColumnIds,
    draggingDraftColumnId,
    dragOverDraftColumnId,
    availableColumns: getAvailableIntimationColumns(
      columnPickerDraft,
      columnOptions
    ),
    openColumnPicker,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn,
    reorderDraftColumn,
    setDraggingDraftColumnId,
    setDragOverDraftColumnId
  }
}

function toggleSelectedColumnId(currentIds: string[], columnId: string) {
  if (currentIds.includes(columnId)) {
    return currentIds.filter((currentId) => currentId !== columnId)
  }

  return [...currentIds, columnId]
}
