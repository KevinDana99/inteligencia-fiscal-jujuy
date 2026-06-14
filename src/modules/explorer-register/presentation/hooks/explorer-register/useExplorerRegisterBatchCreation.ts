'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PRIVATE_DASHBOARD_ROUTES } from '@/constants';
import {
  useBatchManagementCreate,
  type BatchManagementCreateModalController
} from '@/modules/batch-management/presentation/hooks';
import type { IExplorerRegisterRow } from '../../../data/models/ExplorerRegister';
import { buildExplorerRegisterBatchRows } from '../../utils';

export function useExplorerRegisterBatchCreation(
  selectedRows: IExplorerRegisterRow[]
) {
  const router = useRouter();
  const create = useBatchManagementCreate({
    onBatchCreated: async () => {
      router.push(PRIVATE_DASHBOARD_ROUTES.batchManagement);
    }
  });
  const loadedBatchRows = useMemo(
    () => buildExplorerRegisterBatchRows(selectedRows),
    [selectedRows]
  );

  function openCreateBatchModal() {
    create.openCreateModal(loadedBatchRows);
  }

  const createModal: BatchManagementCreateModalController = {
    opened: create.isCreateModalOpen,
    name: create.createForm.name,
    regime: create.createForm.regime,
    description: create.createForm.description,
    loadedCuitsSearchValue: create.loadedCuitsSearchValue,
    loadedCuitsCount: create.loadedCuits.length,
    filteredLoadedCuits: create.filteredLoadedCuits,
    previewData: create.previewData,
    previewError: create.previewError,
    createError: create.createError,
    isImportPreviewOpen: create.isImportPreviewOpen,
    isPreviewPending: create.isPreviewPending,
    isCreatePending: create.isCreatePending,
    onClose: create.closeCreateModal,
    onFieldChange: create.setCreateFormField,
    onManualCuitsAdd: create.addManualCuits,
    onLoadedCuitRemove: create.removeLoadedCuit,
    onLoadedCuitsSearchChange: create.setLoadedCuitsSearchValue,
    onImportFileSelect: create.openImportPreview,
    onImportPreviewClose: create.closeImportPreview,
    onImportPreviewConfirm: create.confirmImportPreview,
    onSubmit: create.createBatch
  };

  return {
    createModal,
    loadedBatchRowsCount: loadedBatchRows.length,
    openCreateBatchModal
  };
}
