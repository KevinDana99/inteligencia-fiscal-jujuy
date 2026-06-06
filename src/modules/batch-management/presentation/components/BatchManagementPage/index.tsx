'use client'

import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useBatchManagement } from '../../hooks'
import { BatchManagementCreateModal } from '../BatchManagementCreateModal'
import { BatchManagementTable } from '../BatchManagementTable'
import classes from './BatchManagementPage.module.css'
import type { IBatchListData } from '../../../data/models/BatchManagement'
import { DashboardNavbarActionPortal } from '@/modules/dashboard-layout/presentation/contexts'

export function BatchManagementPage({
  initialBatchData
}: {
  initialBatchData: IBatchListData | null
}) {
  const {
    totalBatches,
    filteredBatches,
    searchValue,
    isSearchPending,
    expandedBatchId,
    isCreateModalOpen,
    createForm,
    loadedCuits,
    loadedCuitsSearchValue,
    filteredLoadedCuits,
    previewData,
    previewError,
    createError,
    isImportPreviewOpen,
    isPreviewPending,
    isCreatePending,
    getBatchCrossFilters,
    getBatchCrossValidationMessage,
    getBatchCrossExecutionError,
    isBatchCrossExecutionPending,
    canConfirmBatchCrossFilters,
    setSearchValue,
    toggleExpandedBatch,
    toggleBatchCrossSection,
    setBatchCrossYear,
    setBatchCrossMonth,
    toggleBatchCrossType,
    confirmBatchCrossFilters,
    openCreateModal,
    closeCreateModal,
    setCreateFormField,
    setLoadedCuitsSearchValue,
    createBatch,
    addManualCuits,
    removeLoadedCuit,
    openImportPreview,
    closeImportPreview,
    confirmImportPreview
  } = useBatchManagement(initialBatchData)

  return (
    <>
      <DashboardNavbarActionPortal>
        <Button
          variant="filled"
          color="blue"
          size="sm"
          radius="xl"
          leftSection={<IconPlus size={14} />}
          className={classes.createButton}
          onClick={openCreateModal}
        >
          Nuevo Lote
        </Button>
      </DashboardNavbarActionPortal>

      <Stack gap="xl" className={classes.root}>
        <Group justify="space-between" gap="md" className={classes.searchGroup}>
          <TextInput
            leftSection={<IconSearch size={16} />}
            radius="xl"
            placeholder="Buscar por numero de lote..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            rightSection={isSearchPending ? <IconSearch size={14} /> : null}
            className={classes.searchInput}
            classNames={{
              input: classes.searchInputField,
              section: classes.searchInputSection
            }}
          />
          <Text size="sm" className={classes.searchCounter}>
            {filteredBatches.length} de {totalBatches} lotes
          </Text>
        </Group>

        <BatchManagementTable
          batches={filteredBatches}
          expandedBatchId={expandedBatchId}
          onToggleBatch={toggleExpandedBatch}
          getBatchCrossFilters={getBatchCrossFilters}
          getBatchCrossValidationMessage={getBatchCrossValidationMessage}
          getBatchCrossExecutionError={getBatchCrossExecutionError}
          isBatchCrossExecutionPending={isBatchCrossExecutionPending}
          canConfirmBatchCrossFilters={canConfirmBatchCrossFilters}
          onBatchCrossSectionToggle={toggleBatchCrossSection}
          onBatchCrossYearChange={setBatchCrossYear}
          onBatchCrossMonthChange={setBatchCrossMonth}
          onBatchCrossTypeToggle={toggleBatchCrossType}
          onBatchCrossConfirm={confirmBatchCrossFilters}
        />

        <BatchManagementCreateModal
          opened={isCreateModalOpen}
          batchNumber={createForm.batchNumber}
          name={createForm.name}
          regime={createForm.regime}
          description={createForm.description}
          loadedCuitsSearchValue={loadedCuitsSearchValue}
          loadedCuitsCount={loadedCuits.length}
          filteredLoadedCuits={filteredLoadedCuits}
          previewData={previewData}
          previewError={previewError}
          createError={createError}
          isImportPreviewOpen={isImportPreviewOpen}
          isPreviewPending={isPreviewPending}
          isCreatePending={isCreatePending}
          onClose={closeCreateModal}
          onFieldChange={setCreateFormField}
          onManualCuitsAdd={addManualCuits}
          onLoadedCuitRemove={removeLoadedCuit}
          onLoadedCuitsSearchChange={setLoadedCuitsSearchValue}
          onImportFileSelect={openImportPreview}
          onImportPreviewClose={closeImportPreview}
          onImportPreviewConfirm={confirmImportPreview}
          onSubmit={createBatch}
        />
      </Stack>
    </>
  )
}
