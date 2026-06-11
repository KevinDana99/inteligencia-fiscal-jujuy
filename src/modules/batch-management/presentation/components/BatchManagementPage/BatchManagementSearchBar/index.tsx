'use client'

import { Group, Text, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useBatchManagementSearchBar } from './useBatchManagementSearchBar'
import classes from '../BatchManagementPage.module.css'

type BatchManagementSearchBarProps = {
  searchValue: string
  isSearchPending: boolean
  resultCountLabel: string
  onSearchValueChange: (value: string) => void
}

export function BatchManagementSearchBar(props: BatchManagementSearchBarProps) {
  const controller = useBatchManagementSearchBar(props)

  return (
    <Group justify="space-between" gap="md" className={classes.searchGroup}>
      <TextInput
        leftSection={<IconSearch size={16} />}
        radius="xl"
        placeholder="Buscar por numero de lote..."
        rightSection={controller.isSearchPending ? <IconSearch size={14} /> : null}
        className={classes.searchInput}
        classNames={{
          input: classes.searchInputField,
          section: classes.searchInputSection
        }}
        {...controller.searchInput}
      />
      <Text size="sm" className={classes.searchCounter}>
        {controller.resultCountLabel}
      </Text>
    </Group>
  )
}
