'use client'

import type { ChangeEvent } from 'react'
import type { BatchManagementCreateModalController } from '../../hooks/useBatchManagement'
import { getLoadedCuitsCountLabel } from '../../utils'
import { useBatchManagementFileImport } from './useBatchManagementFileImport'
import { useBatchManagementManualCuitInput } from './useBatchManagementManualCuitInput'

export function useBatchManagementCreateModal(
  controller: BatchManagementCreateModalController
) {
  const fileImport = useBatchManagementFileImport({
    onImportFileSelect: controller.onImportFileSelect
  })
  const manualInput = useBatchManagementManualCuitInput({
    onManualCuitsAdd: controller.onManualCuitsAdd
  })
  const hasLoadedCuitsFilter = Boolean(controller.loadedCuitsSearchValue.trim())
  const isCreateReady = Boolean(
    controller.name.trim() && controller.regime && controller.loadedCuitsCount
  )

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    controller.onFieldChange('name', event.currentTarget.value.toUpperCase())
  }

  function handleRegimeChange(value: string | null) {
    controller.onFieldChange('regime', value)
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLInputElement>) {
    controller.onFieldChange('description', event.currentTarget.value)
  }

  function handleLoadedCuitsSearchChange(event: ChangeEvent<HTMLInputElement>) {
    controller.onLoadedCuitsSearchChange(event.currentTarget.value)
  }

  function handleCreateBatch() {
    if (!isCreateReady) {
      return
    }

    controller.onSubmit()
  }

  return {
    modal: {
      opened: controller.opened,
      onClose: controller.onClose
    },
    fields: {
      nameInput: {
        value: controller.name,
        onChange: handleNameChange
      },
      regimeInput: {
        value: controller.regime,
        onChange: handleRegimeChange
      },
      descriptionInput: {
        value: controller.description,
        onChange: handleDescriptionChange
      }
    },
    loadedCuits: {
      searchInput: {
        value: controller.loadedCuitsSearchValue,
        onChange: handleLoadedCuitsSearchChange
      },
      importButton: {
        onClick: fileImport.handleImportButtonClick,
        loading: controller.isPreviewPending
      },
      manualButton: {
        onClick: manualInput.toggleManualInput
      },
      manualInput: {
        opened: manualInput.isManualInputOpen,
        value: manualInput.manualCuitValue,
        onChange: manualInput.handleManualCuitChange,
        onKeyDown: manualInput.handleManualInputKeyDown,
        onSubmit: manualInput.handleManualCuitSubmit
      },
      rows: controller.filteredLoadedCuits.map((row, index) => ({
        id: row.id,
        order: index + 1,
        cuit: row.cuit,
        businessName: row.businessName ?? '—',
        onRemove: () => controller.onLoadedCuitRemove(row.id)
      })),
      errorText: controller.createError ?? controller.previewError,
      countLabel: getLoadedCuitsCountLabel(
        controller.filteredLoadedCuits.length,
        controller.loadedCuitsCount,
        hasLoadedCuitsFilter
      )
    },
    fileInputRef: fileImport.fileInputRef,
    onFileInputChange: fileImport.handleImportFileChange,
    footer: {
      cancelButton: {
        onClick: controller.onClose
      },
      submitButton: {
        disabled: !isCreateReady,
        loading: controller.isCreatePending,
        active: isCreateReady,
        onClick: handleCreateBatch
      }
    },
    importPreview: {
      opened: controller.isImportPreviewOpen,
      previewData: controller.previewData,
      onClose: controller.onImportPreviewClose,
      onConfirm: controller.onImportPreviewConfirm
    }
  }
}

export type BatchManagementCreateModalViewModel = ReturnType<
  typeof useBatchManagementCreateModal
>
