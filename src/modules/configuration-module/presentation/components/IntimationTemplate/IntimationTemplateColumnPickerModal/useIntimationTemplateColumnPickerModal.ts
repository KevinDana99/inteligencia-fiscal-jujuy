'use client'

import { useMemo } from 'react'
import type { IntimationTemplateController } from '../../../hooks/intimation-template'
import { INTIMATION_TEMPLATE_LABELS } from '../../../constants'
import modalClasses from './IntimationTemplateColumnPickerModal.module.css'
import listClasses from './IntimationTemplateColumnPickerList/IntimationTemplateColumnPickerList.module.css'

export function useIntimationTemplateColumnPickerModal(
  controller: IntimationTemplateController
) {
  const {
    columnPickerOpened,
    columnPickerDraft,
    selectedAvailableColumnId,
    selectedVisibleColumnId,
    availableColumns,
    closeColumnPicker,
    confirmColumnPicker,
    selectAvailableColumn,
    selectVisibleColumn,
    addSelectedColumn,
    removeSelectedColumn
  } = controller

  const availableRows = useMemo(
    () =>
      availableColumns.map((column) => ({
        id: column.id,
        label: column.label,
        className: getRowClassName(selectedAvailableColumnId === column.id),
        handleSelect: () => selectAvailableColumn(column.id)
      })),
    [availableColumns, selectAvailableColumn, selectedAvailableColumnId]
  )

  const visibleRows = useMemo(
    () =>
      columnPickerDraft.map((column) => ({
        id: column.id,
        label: column.value,
        className: getRowClassName(selectedVisibleColumnId === column.id),
        handleSelect: () => selectVisibleColumn(column.id)
      })),
    [columnPickerDraft, selectVisibleColumn, selectedVisibleColumnId]
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
        disabled: !selectedAvailableColumnId,
        label: INTIMATION_TEMPLATE_LABELS.buttons.addSelectedColumn
      },
      removeButton: {
        onClick: removeSelectedColumn,
        disabled: !selectedVisibleColumnId,
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

function getRowClassName(isSelected: boolean) {
  return [
    listClasses.columnPickerRow,
    isSelected ? listClasses.columnPickerRowSelected : null
  ]
    .filter(Boolean)
    .join(' ')
}

export type IntimationTemplateColumnPickerModalController = ReturnType<
  typeof useIntimationTemplateColumnPickerModal
>
