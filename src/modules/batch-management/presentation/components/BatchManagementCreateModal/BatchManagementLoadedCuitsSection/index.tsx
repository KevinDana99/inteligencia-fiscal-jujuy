'use client'

import { Group, Text } from '@mantine/core'
import type { BatchManagementCreateModalViewModel } from '../useBatchManagementCreateModal'
import { BatchManagementLoadedCuitsTable } from '../BatchManagementLoadedCuitsTable'
import { BatchManagementLoadedCuitsToolbar } from '../BatchManagementLoadedCuitsToolbar'
import classes from './BatchManagementLoadedCuitsSection.module.css'

type BatchManagementLoadedCuitsSectionProps = {
  loadedCuits: BatchManagementCreateModalViewModel['loadedCuits']
  fileInputRef: BatchManagementCreateModalViewModel['fileInputRef']
  onFileInputChange: BatchManagementCreateModalViewModel['onFileInputChange']
}

export function BatchManagementLoadedCuitsSection({
  loadedCuits,
  fileInputRef,
  onFileInputChange
}: BatchManagementLoadedCuitsSectionProps) {
  return (
    <div className={classes.fieldGroup}>
      <Text className={classes.fieldLabel}>
        CUITs a analizar <span className={classes.required}>*</span>
      </Text>

      <BatchManagementLoadedCuitsToolbar
        loadedCuits={loadedCuits}
        fileInputRef={fileInputRef}
        onFileInputChange={onFileInputChange}
      />
      <BatchManagementLoadedCuitsTable rows={loadedCuits.rows} />

      <Group justify="space-between" align="center" className={classes.cuitMetaRow}>
        <div className={classes.errorSlot}>
          {loadedCuits.errorText ? (
            <Text className={classes.errorText}>{loadedCuits.errorText}</Text>
          ) : null}
        </div>
        <Text className={classes.cuitCounter}>{loadedCuits.countLabel}</Text>
      </Group>
    </div>
  )
}
