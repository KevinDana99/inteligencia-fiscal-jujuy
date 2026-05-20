'use client'

import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useBatchManagement } from '../../hooks'
import { BatchManagementCreateModal } from '../BatchManagementCreateModal'
import { BatchManagementTable } from '../BatchManagementTable'
import classes from './BatchManagementPage.module.css'
import type { IBatchListData } from '../../../data/models/BatchManagement'

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
    previewData,
    isImportPreviewOpen,
    isPreviewPending,
    isCreatePending,
    getBatchCrossFilters,
    setSearchValue,
    toggleExpandedBatch,
    setBatchCrossYear,
    toggleBatchCrossType,
    confirmBatchCrossFilters,
    openCreateModal,
    closeCreateModal,
    setCreateFormField,
    createBatch,
    openImportPreview,
    closeImportPreview,
    confirmImportPreview
  } = useBatchManagement(initialBatchData)

  return (
    <Stack gap="xl" className={classes.root}>
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs">
          <Title order={3} className={classes.headerTitle}>
            Gestion de Lotes
          </Title>
          <Text size="sm" className={classes.headerSubtitle}>
            Administra los lotes de CUITs para analisis fiscal
          </Text>
        </Stack>

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
      </Group>

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
        onBatchCrossYearChange={setBatchCrossYear}
        onBatchCrossTypeToggle={toggleBatchCrossType}
        onBatchCrossConfirm={confirmBatchCrossFilters}
      />

      <BatchManagementCreateModal
        opened={isCreateModalOpen}
        batchNumber={createForm.batchNumber}
        name={createForm.name}
        regime={createForm.regime}
        description={createForm.description}
        cuitsText={createForm.cuitsText}
        previewData={previewData}
        isImportPreviewOpen={isImportPreviewOpen}
        isPreviewPending={isPreviewPending}
        isCreatePending={isCreatePending}
        onClose={closeCreateModal}
        onFieldChange={setCreateFormField}
        onImportFileSelect={openImportPreview}
        onImportPreviewClose={closeImportPreview}
        onImportPreviewConfirm={confirmImportPreview}
        onSubmit={createBatch}
      />
    </Stack>
  )
}
