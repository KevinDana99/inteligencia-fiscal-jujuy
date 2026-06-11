'use client'

import { useState } from 'react'
import type {
  IBatchLoadedCuitRow,
  IBatchPreviewData
} from '../../../data/models/BatchManagement'
import {
  buildImportedLoadedCuitRows,
  buildManualLoadedCuitRows,
  filterLoadedBatchCuits
} from '../../utils'

export function useBatchManagementLoadedCuits() {
  const [loadedCuits, setLoadedCuits] = useState<IBatchLoadedCuitRow[]>([])
  const [loadedCuitsSearchValue, setLoadedCuitsSearchValue] = useState('')

  function replaceLoadedCuits(rows: IBatchLoadedCuitRow[] = []) {
    setLoadedCuits(rows)
    setLoadedCuitsSearchValue('')
  }

  function resetLoadedCuits() {
    setLoadedCuits([])
    setLoadedCuitsSearchValue('')
  }

  function addManualCuits(rawValue: string) {
    const nextRows = buildManualLoadedCuitRows(rawValue, loadedCuits)

    if (!nextRows.length) {
      return 0
    }

    setLoadedCuits((current) => [...current, ...nextRows])
    return nextRows.length
  }

  function removeLoadedCuit(rowId: string) {
    setLoadedCuits((current) => current.filter((row) => row.id !== rowId))
  }

  function applyImportedCuits(
    previewData: IBatchPreviewData,
    acceptedNormalizedCuits: string[] = []
  ) {
    const importedRows = buildImportedLoadedCuitRows(
      previewData,
      loadedCuits,
      acceptedNormalizedCuits
    )

    if (!importedRows.length) {
      return
    }

    setLoadedCuits((current) => [...current, ...importedRows])
  }

  return {
    loadedCuits,
    loadedCuitsSearchValue,
    filteredLoadedCuits: filterLoadedBatchCuits(
      loadedCuits,
      loadedCuitsSearchValue
    ),
    setLoadedCuitsSearchValue,
    replaceLoadedCuits,
    resetLoadedCuits,
    addManualCuits,
    removeLoadedCuit,
    applyImportedCuits
  }
}
