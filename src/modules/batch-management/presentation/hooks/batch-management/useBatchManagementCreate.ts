'use client'

import { createBatchAction } from '../../../data/actions'
import type {
  IBatchCreatedSummary,
  IBatchLoadedCuitRow
} from '../../../data/models/BatchManagement'
import { getCreatedBatchCuits } from '../../utils'
import { useBatchManagementCreateForm } from './useBatchManagementCreateForm'
import { useBatchManagementImportPreview } from './useBatchManagementImportPreview'
import { useBatchManagementLoadedCuits } from './useBatchManagementLoadedCuits'

type UseBatchManagementCreateParams = {
  onBatchCreated: (
    createdSummary: IBatchCreatedSummary,
    parsedCuits: string[]
  ) => Promise<void>
}

export function useBatchManagementCreate({
  onBatchCreated
}: UseBatchManagementCreateParams) {
  const createForm = useBatchManagementCreateForm()
  const loadedCuits = useBatchManagementLoadedCuits()
  const importPreview = useBatchManagementImportPreview({
    regime: createForm.createForm.regime
  })

  function resetCreateFlow() {
    createForm.resetCreateForm()
    loadedCuits.resetLoadedCuits()
    importPreview.resetImportPreview()
  }

  function openCreateModal(initialLoadedCuits: IBatchLoadedCuitRow[] = []) {
    resetCreateFlow()
    loadedCuits.replaceLoadedCuits(initialLoadedCuits)
    createForm.openCreateModal()
  }

  function closeCreateModal() {
    createForm.closeCreateModal()
    loadedCuits.resetLoadedCuits()
    importPreview.resetImportPreview()
  }

  function confirmImportPreview(acceptedNormalizedCuits: string[] = []) {
    if (!importPreview.previewData) {
      return
    }

    loadedCuits.applyImportedCuits(
      importPreview.previewData,
      acceptedNormalizedCuits
    )
    importPreview.closeImportPreview()
    createForm.setCreateError(null)
  }

  function addManualCuits(rawValue: string) {
    const addedCount = loadedCuits.addManualCuits(rawValue)

    if (addedCount) {
      createForm.setCreateError(null)
    }

    return addedCount
  }

  function getCreateBatchPayload(loadedRows: IBatchLoadedCuitRow[]) {
    const name = createForm.createForm.name.trim()
    const regime = createForm.createForm.regime?.trim() ?? ''
    const description = createForm.createForm.description.trim()
    const parsedCuits = getCreatedBatchCuits(loadedRows)

    return {
      name,
      regime,
      description,
      parsedCuits
    }
  }

  function createBatch() {
    const payload = getCreateBatchPayload(loadedCuits.loadedCuits)

    if (!payload.name || !payload.regime || !payload.parsedCuits.length) {
      return false
    }

    createForm.setCreateError(null)
    createForm.startCreateTransition(() => {
      void (async () => {
        const result = await createBatchAction({
          name: payload.name,
          description: payload.description,
          regime: payload.regime,
          cuitsText: payload.parsedCuits.join('\n'),
          file: null
        })

        if (!result.success || !result.data) {
          createForm.setCreateError(
            result.error ?? 'No fue posible crear el lote.'
          )
          return
        }

        await onBatchCreated(result.data, payload.parsedCuits)
        resetCreateFlow()
      })()
    })

    return true
  }

  return {
    isCreateModalOpen: createForm.isCreateModalOpen,
    createForm: createForm.createForm,
    loadedCuits: loadedCuits.loadedCuits,
    loadedCuitsSearchValue: loadedCuits.loadedCuitsSearchValue,
    filteredLoadedCuits: loadedCuits.filteredLoadedCuits,
    previewData: importPreview.previewData,
    previewError: importPreview.previewError,
    createError: createForm.createError,
    isImportPreviewOpen: importPreview.isImportPreviewOpen,
    isPreviewPending: importPreview.isPreviewPending,
    isCreatePending: createForm.isCreatePending,
    openCreateModal,
    closeCreateModal,
    setCreateFormField: createForm.setCreateFormField,
    setLoadedCuitsSearchValue: loadedCuits.setLoadedCuitsSearchValue,
    createBatch,
    addManualCuits,
    removeLoadedCuit: loadedCuits.removeLoadedCuit,
    openImportPreview: importPreview.openImportPreview,
    closeImportPreview: importPreview.closeImportPreview,
    confirmImportPreview
  }
}
