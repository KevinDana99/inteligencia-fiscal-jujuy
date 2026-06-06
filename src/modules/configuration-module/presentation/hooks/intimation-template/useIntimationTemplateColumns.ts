'use client'

import {
  useCallback,
  useMemo,
  type ChangeEventHandler,
  type MouseEventHandler
} from 'react'
import type {
  ConfigurationType,
  DeepPartial
} from '../../../data/models/Configuration'
import type { IntimationTemplateColumn } from './useIntimationTemplate'

type UseIntimationTemplateColumnsParams = {
  visibleColumns: IntimationTemplateColumn[]
  isProviderBacked: boolean
  updateConfig: (newConfig: DeepPartial<ConfigurationType>) => void
}

export type IntimationTemplateColumnRow = {
  id: string
  value: string
  readOnly: boolean
  removeLabel: string
  handleChange: ChangeEventHandler<HTMLInputElement>
  handleRemove: MouseEventHandler<HTMLButtonElement>
}

export function useIntimationTemplateColumns({
  visibleColumns,
  isProviderBacked,
  updateConfig
}: UseIntimationTemplateColumnsParams) {
  const updateColumn = useCallback(
    (columnId: string, value: string) => {
      void columnId
      void value

      return
    },
    []
  )

  const removeColumn = useCallback(
    (columnId: string) => {
      updateConfig({
        intimacion: {
          columnas_seleccionadas: visibleColumns
            .filter((column) => column.id !== columnId)
            .map((column) => column.id)
        }
      })
    },
    [updateConfig, visibleColumns]
  )

  const columnRows = useMemo<IntimationTemplateColumnRow[]>(
    () =>
      visibleColumns.map((column) => ({
        id: column.id,
        value: column.value,
        readOnly: isProviderBacked,
        removeLabel: `Eliminar columna ${column.value}`,
        handleChange: (event) => {
          updateColumn(column.id, event.currentTarget.value)
        },
        handleRemove: () => {
          removeColumn(column.id)
        }
      })),
    [isProviderBacked, removeColumn, updateColumn, visibleColumns]
  )

  return {
    visibleColumns,
    columnRows,
    updateColumn,
    removeColumn
  }
}
