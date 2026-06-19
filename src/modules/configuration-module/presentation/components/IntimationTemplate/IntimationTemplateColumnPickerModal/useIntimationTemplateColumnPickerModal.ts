'use client'

import { useMemo } from 'react'
import type { DragEventHandler } from 'react'
import type { IntimationTemplateController } from '../../../hooks/intimation-template'
import { INTIMATION_TEMPLATE_LABELS } from '../../../constants'
import modalClasses from './IntimationTemplateColumnPickerModal.module.css'
import listClasses from './IntimationTemplateColumnPickerList/IntimationTemplateColumnPickerList.module.css'

type ColumnPickerRow = {
  id: string
  label: string
  className: string
  isSelected: boolean
  draggable: boolean
  dragHandleLabel?: string
  handleSelect: () => void
  handleDragStart?: DragEventHandler<HTMLButtonElement>
  handleDragEnd?: DragEventHandler<HTMLButtonElement>
  handleDragOver?: DragEventHandler<HTMLButtonElement>
  handleDragLeave?: DragEventHandler<HTMLButtonElement>
  handleDrop?: DragEventHandler<HTMLButtonElement>
}

export function useIntimationTemplateColumnPickerModal(
  controller: IntimationTemplateController
) {
  const {
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnIds,
    selectedVisibleColumnIds,
    availableColumns,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn,
    reorderDraftColumn,
    draggingDraftColumnId,
    dragOverDraftColumnId,
    setDraggingDraftColumnId,
    setDragOverDraftColumnId
  } = controller

  const availableRows = useMemo<ColumnPickerRow[]>(
    () =>
      availableColumns.map((column) => ({
        id: column.id,
        label: column.label,
        isSelected: selectedAvailableColumnIds.includes(column.id),
        className: getRowClassName(
          selectedAvailableColumnIds.includes(column.id)
        ),
        draggable: false,
        handleSelect: () => selectAvailableColumn(column.id)
      })),
    [availableColumns, selectAvailableColumn, selectedAvailableColumnIds]
  )

  const visibleRows = useMemo<ColumnPickerRow[]>(
    () =>
      columnPickerDraft.map((column) => ({
        id: column.id,
        label: column.value,
        isSelected: selectedVisibleColumnIds.includes(column.id),
        className: getRowClassName(
          selectedVisibleColumnIds.includes(column.id),
          draggingDraftColumnId === column.id,
          dragOverDraftColumnId === column.id
        ),
        draggable: true,
        dragHandleLabel: `Reordenar columna ${column.value}`,
        handleSelect: () => selectVisibleColumn(column.id),
        handleDragStart: (event) => {
          event.dataTransfer.effectAllowed = 'move'
          event.dataTransfer.setData('text/plain', column.id)
          setDraggingDraftColumnId(column.id)
        },
        handleDragEnd: () => {
          setDraggingDraftColumnId(null)
          setDragOverDraftColumnId(null)
        },
        handleDragOver: (event) => {
          if (!draggingDraftColumnId || draggingDraftColumnId === column.id) {
            return
          }

          event.preventDefault()
          event.dataTransfer.dropEffect = 'move'
          setDragOverDraftColumnId(column.id)
        },
        handleDragLeave: (event) => {
          const relatedTarget = event.relatedTarget

          if (
            relatedTarget instanceof Node &&
            event.currentTarget.contains(relatedTarget)
          ) {
            return
          }

          setDragOverDraftColumnId((currentColumnId) =>
            currentColumnId === column.id ? null : currentColumnId
          )
        },
        handleDrop: (event) => {
          event.preventDefault()
          const sourceColumnId =
            event.dataTransfer.getData('text/plain') || draggingDraftColumnId

          if (sourceColumnId) {
            reorderDraftColumn(sourceColumnId, column.id)
          }

          setDraggingDraftColumnId(null)
          setDragOverDraftColumnId(null)
        }
      })),
    [
      columnPickerDraft,
      dragOverDraftColumnId,
      draggingDraftColumnId,
      reorderDraftColumn,
      selectVisibleColumn,
      selectedVisibleColumnIds,
      setDragOverDraftColumnId,
      setDraggingDraftColumnId
    ]
  )

  return {
    modal: {
      opened: columnPickerOpened,
      onClose: closeColumnPicker,
      title: INTIMATION_TEMPLATE_LABELS.modal.title,
      subtitle: INTIMATION_TEMPLATE_LABELS.modal.subtitle,
      classNames: {
        overlay: modalClasses.modalOverlay,
        content: modalClasses.columnModalContent,
        header: modalClasses.modalHeader,
        body: modalClasses.columnModalBody,
        close: modalClasses.modalClose
      }
    },
    availableList: {
      title: INTIMATION_TEMPLATE_LABELS.modal.availableColumns,
      rows: availableRows
    },
    visibleList: {
      title: INTIMATION_TEMPLATE_LABELS.modal.visibleColumns,
      rows: visibleRows
    },
    actions: {
      addButton: {
        onClick: addSelectedColumn,
        disabled: selectedAvailableColumnIds.length === 0,
        label: INTIMATION_TEMPLATE_LABELS.buttons.addSelectedColumn
      },
      removeButton: {
        onClick: removeSelectedColumn,
        disabled: selectedVisibleColumnIds.length === 0,
        label: INTIMATION_TEMPLATE_LABELS.buttons.removeSelectedColumn
      }
    },
    footer: {
      cancelLabel: INTIMATION_TEMPLATE_LABELS.buttons.cancel,
      acceptLabel: INTIMATION_TEMPLATE_LABELS.buttons.accept,
      onCancel: closeColumnPicker,
      onConfirm: confirmColumnPicker
    }
  }
}

function getRowClassName(
  isSelected: boolean,
  isDragging = false,
  isDragOver = false
) {
  return [
    listClasses.columnPickerRow,
    isSelected ? listClasses.columnPickerRowSelected : null,
    isDragging ? listClasses.columnPickerRowDragging : null,
    isDragOver ? listClasses.columnPickerRowDragOver : null
  ]
    .filter(Boolean)
    .join(' ')
}

export type IntimationTemplateColumnPickerModalController = ReturnType<
  typeof useIntimationTemplateColumnPickerModal
>
