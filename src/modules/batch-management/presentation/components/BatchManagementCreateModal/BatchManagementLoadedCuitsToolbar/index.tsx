'use client'

import { Button, Group, TextInput } from '@mantine/core'
import { IconPlus, IconSearch, IconUpload } from '@tabler/icons-react'
import type { BatchManagementCreateModalViewModel } from '../useBatchManagementCreateModal'
import classes from './BatchManagementLoadedCuitsToolbar.module.css'

type BatchManagementLoadedCuitsToolbarProps = {
  loadedCuits: BatchManagementCreateModalViewModel['loadedCuits']
  fileInputRef: BatchManagementCreateModalViewModel['fileInputRef']
  onFileInputChange: BatchManagementCreateModalViewModel['onFileInputChange']
}

export function BatchManagementLoadedCuitsToolbar({
  loadedCuits,
  fileInputRef,
  onFileInputChange
}: BatchManagementLoadedCuitsToolbarProps) {
  return (
    <>
      <Group gap={8} align="center" wrap="nowrap" className={classes.cuitToolbar}>
        <TextInput
          leftSection={<IconSearch size={14} />}
          placeholder="Buscar por CUIT o razón social..."
          className={classes.cuitSearchInput}
          classNames={{
            input: classes.cuitSearchField,
            section: classes.cuitSearchSection
          }}
          {...loadedCuits.searchInput}
        />

        <Button
          variant="default"
          leftSection={<IconUpload size={13} />}
          className={classes.toolbarButton}
          onClick={loadedCuits.importButton.onClick}
          loading={loadedCuits.importButton.loading}
        >
          Importar Excel
        </Button>

        <Button
          variant="default"
          leftSection={<IconPlus size={13} />}
          className={classes.toolbarButton}
          onClick={loadedCuits.manualButton.onClick}
        >
          Cargar CUIT
        </Button>
      </Group>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className={classes.hiddenFileInput}
        onChange={onFileInputChange}
      />

      {loadedCuits.manualInput.opened ? (
        <Group gap={8} wrap="nowrap" className={classes.manualInputRow}>
          <TextInput
            value={loadedCuits.manualInput.value}
            onChange={loadedCuits.manualInput.onChange}
            onKeyDown={loadedCuits.manualInput.onKeyDown}
            placeholder="Escribí o pegá un CUIT..."
            className={classes.manualCuitInput}
            classNames={{ input: classes.manualCuitField }}
          />
          <Button
            className={classes.submitInlineButton}
            onClick={loadedCuits.manualInput.onSubmit}
          >
            Agregar
          </Button>
        </Group>
      ) : null}
    </>
  )
}
