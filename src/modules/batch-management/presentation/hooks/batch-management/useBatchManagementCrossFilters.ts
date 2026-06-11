'use client'

import { useState } from 'react'
import type {
  IBatchCrossFilters,
  IBatchCrossSectionFilters
} from '../../../data/models/BatchManagement'
import { createDefaultBatchCrossFilters } from '../../utils'

export function useBatchManagementCrossFilters() {
  const [batchCrossFilters, setBatchCrossFilters] = useState<
    Record<string, IBatchCrossFilters>
  >({})

  function getBatchCrossFilters(batchId: string) {
    return batchCrossFilters[batchId] ?? createDefaultBatchCrossFilters()
  }

  function updateBatchCrossFilters(
    batchId: string,
    updater: (currentFilters: IBatchCrossFilters) => IBatchCrossFilters
  ) {
    setBatchCrossFilters((current) => {
      const currentFilters = current[batchId] ?? createDefaultBatchCrossFilters()

      return {
        ...current,
        [batchId]: updater(currentFilters)
      }
    })
  }

  function setBatchCrossYear(
    batchId: string,
    section: keyof IBatchCrossFilters,
    field: keyof Pick<IBatchCrossSectionFilters, 'fromYear' | 'toYear'>,
    value: string | null
  ) {
    if (!value) {
      return
    }

    updateBatchCrossFilters(batchId, (currentFilters) => ({
      ...currentFilters,
      [section]: {
        ...currentFilters[section],
        [field]: value
      }
    }))
  }

  function setBatchCrossMonth(
    batchId: string,
    field: keyof Pick<IBatchCrossSectionFilters, 'fromMonth' | 'toMonth'>,
    value: string | null
  ) {
    if (!value) {
      return
    }

    updateBatchCrossFilters(batchId, (currentFilters) => ({
      ...currentFilters,
      monthly: {
        ...currentFilters.monthly,
        [field]: value
      }
    }))
  }

  function toggleBatchCrossSection(
    batchId: string,
    section: keyof IBatchCrossFilters
  ) {
    updateBatchCrossFilters(batchId, (currentFilters) => ({
      ...currentFilters,
      [section]: {
        ...currentFilters[section],
        isOpen: !currentFilters[section].isOpen
      }
    }))
  }

  function toggleBatchCrossType(
    batchId: string,
    section: keyof IBatchCrossFilters,
    crossType: string
  ) {
    updateBatchCrossFilters(batchId, (currentFilters) => {
      const sectionFilters = currentFilters[section]
      const isSelected = sectionFilters.crossTypes.includes(crossType)

      return {
        ...currentFilters,
        [section]: {
          ...sectionFilters,
          crossTypes: isSelected
            ? sectionFilters.crossTypes.filter((item) => item !== crossType)
            : [...sectionFilters.crossTypes, crossType]
        }
      }
    })
  }

  return {
    getBatchCrossFilters,
    setBatchCrossYear,
    setBatchCrossMonth,
    toggleBatchCrossSection,
    toggleBatchCrossType
  }
}
