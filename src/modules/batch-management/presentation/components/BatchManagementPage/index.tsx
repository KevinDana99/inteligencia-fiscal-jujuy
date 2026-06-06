'use client'

import { Stack } from '@mantine/core'
import { useBatchManagement } from '../../hooks'
import { BatchManagementCreateModal } from '../BatchManagementCreateModal'
import { BatchManagementTable } from '../BatchManagementTable'
import { BatchManagementNavbarAction } from './BatchManagementNavbarAction'
import { BatchManagementSearchBar } from './BatchManagementSearchBar'
import classes from './BatchManagementPage.module.css'
import type { IBatchListData } from '../../../data/models/BatchManagement'

export function BatchManagementPage({
  initialBatchData
}: {
  initialBatchData: IBatchListData | null
}) {
  const controller = useBatchManagement(initialBatchData)

  return (
    <>
      <BatchManagementNavbarAction {...controller.navbarAction} />
      <Stack gap="xl" className={classes.root}>
        <BatchManagementSearchBar {...controller.searchBar} />
        <BatchManagementTable controller={controller.table} />
        <BatchManagementCreateModal controller={controller.createModal} />
      </Stack>
    </>
  )
}
