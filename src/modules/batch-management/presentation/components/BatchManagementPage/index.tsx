'use client'

import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useBatchManagement } from '../../hooks'
import { BatchManagementTable } from '../BatchManagementTable'
import classes from './BatchManagementPage.module.css'

export function BatchManagementPage() {
  const {
    totalBatches,
    filteredBatches,
    searchValue,
    expandedBatchId,
    setSearchValue,
    toggleExpandedBatch
  } = useBatchManagement()

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
        >
          Nuevo Lote
        </Button>
      </Group>

      <Group gap="md" className={classes.searchGroup}>
        <TextInput
          leftSection={<IconSearch size={16} />}
          radius="xl"
          placeholder="Buscar por numero de lote..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          className={classes.searchInput}
        />
        <Text size="sm" className={classes.searchCounter}>
          {filteredBatches.length} de {totalBatches} lotes
        </Text>
      </Group>

      <BatchManagementTable
        batches={filteredBatches}
        expandedBatchId={expandedBatchId}
        onToggleBatch={toggleExpandedBatch}
      />
    </Stack>
  )
}
