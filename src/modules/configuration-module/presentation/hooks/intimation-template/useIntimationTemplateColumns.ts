'use client'

import {
  useCallback,
  useMemo,
  useState,
  type DragEventHandler,
  type MouseEventHandler
} from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../../data/models/Configuration'
import { reorderIntimationTemplateColumns } from '../../utils'
import type { IntimationTemplateColumn } from './useIntimationTemplate'

type UseIntimationTemplateColumnsParams = {
  visibleColumns: IntimationTemplateColumn[]
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
  clearColumnsError: () => void
}

export type IntimationTemplateColumnRow = {
  id: string
  value: string
  isDragging: boolean
  isDragOver: boolean
  dragHandleLabel: string
  removeLabel: string
  handleDragStart: DragEventHandler<HTMLButtonElement>
  handleDragEnd: DragEventHandler<HTMLButtonElement>
  handleDragOver: DragEventHandler<HTMLDivElement>
  handleDragLeave: DragEventHandler<HTMLDivElement>
  handleDrop: DragEventHandler<HTMLDivElement>
  handleRemove: MouseEventHandler<HTMLButtonElement>
}

export function useIntimationTemplateColumns({
  visibleColumns,
  updateConfig,
  clearColumnsError
}: UseIntimationTemplateColumnsParams) {
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)

  const reorderColumn = useCallback(
    (sourceColumnId: string, targetColumnId: string) => {
      const reorderedColumns = reorderIntimationTemplateColumns(
        visibleColumns,
        sourceColumnId,
        targetColumnId
      )

      if (reorderedColumns === visibleColumns) {
        return
      }

      clearColumnsError()
      updateConfig({
        intimacion: {
          columnas_seleccionadas: reorderedColumns.map((column) => column.id)
        }
      })
    },
    [clearColumnsError, updateConfig, visibleColumns]
  )

  const removeColumn = useCallback(
    (columnId: string) => {
      clearColumnsError()
      updateConfig({
        intimacion: {
          columnas_seleccionadas: visibleColumns
            .filter((column) => column.id !== columnId)
            .map((column) => column.id)
        }
      })
    },
    [clearColumnsError, updateConfig, visibleColumns]
  )

  const columnRows = useMemo<IntimationTemplateColumnRow[]>(
    () =>
      visibleColumns.map((column) => ({
        id: column.id,
        value: column.value,
        isDragging: draggingColumnId === column.id,
        isDragOver: dragOverColumnId === column.id,
        dragHandleLabel: `Reordenar columna ${column.value}`,
        removeLabel: `Eliminar columna ${column.value}`,
        handleDragStart: (event) => {
          event.dataTransfer.effectAllowed = 'move'
          event.dataTransfer.setData('text/plain', column.id)
          setDraggingColumnId(column.id)
        },
        handleDragEnd: () => {
          setDraggingColumnId(null)
          setDragOverColumnId(null)
        },
        handleDragOver: (event) => {
          if (!draggingColumnId || draggingColumnId === column.id) {
            return
          }

          event.preventDefault()
          event.dataTransfer.dropEffect = 'move'
          setDragOverColumnId(column.id)
        },
        handleDragLeave: (event) => {
          const relatedTarget = event.relatedTarget

          if (
            relatedTarget instanceof Node &&
            event.currentTarget.contains(relatedTarget)
          ) {
            return
          }

          setDragOverColumnId((currentColumnId) =>
            currentColumnId === column.id ? null : currentColumnId
          )
        },
        handleDrop: (event) => {
          event.preventDefault()
          const sourceColumnId =
            event.dataTransfer.getData('text/plain') || draggingColumnId

          if (sourceColumnId) {
            reorderColumn(sourceColumnId, column.id)
          }

          setDraggingColumnId(null)
          setDragOverColumnId(null)
        },
        handleRemove: () => {
          removeColumn(column.id)
        }
      })),
    [
      dragOverColumnId,
      draggingColumnId,
      removeColumn,
      reorderColumn,
      visibleColumns
    ]
  )

  return {
    visibleColumns,
    columnRows,
    removeColumn
  }
}
