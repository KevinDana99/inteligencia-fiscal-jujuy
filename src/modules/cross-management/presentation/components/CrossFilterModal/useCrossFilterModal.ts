'use client'

import { useMemo, useState } from 'react'
import type {
  ICrossColumnFilterState,
  ICrossFilterColumnKey,
  ICrossFilterConnector,
  ICrossFilterOperator
} from '../../../data/models/CrossManagement'

export interface ICrossFilterModalProps {
  opened: boolean
  columnKey: ICrossFilterColumnKey | null
  columnLabel: string
  initialValue: ICrossColumnFilterState | null
  isPending?: boolean
  error?: string | null
  onClose: () => void
  onClear: (columnKey: ICrossFilterColumnKey) => void
  onApply: (columnKey: ICrossFilterColumnKey, value: ICrossColumnFilterState) => void
}

export const EMPTY_FILTER_STATE: ICrossColumnFilterState = {
  connector: 'Y',
  primary: {
    operator: '',
    value: ''
  },
  secondary: {
    operator: '',
    value: ''
  }
}

export function useCrossFilterModal({
  columnKey,
  columnLabel,
  initialValue,
  onClose,
  onClear,
  onApply
}: ICrossFilterModalProps) {
  const [value, setValue] = useState<ICrossColumnFilterState>(
    initialValue ?? EMPTY_FILTER_STATE
  )

  const title = useMemo(() => `Filtrar ${columnKey ? columnLabel : ''}`, [columnKey, columnLabel])

  const setConnector = (connector: ICrossFilterConnector) => {
    setValue((current) => ({
      ...current,
      connector
    }))
  }

  const setPrimaryOperator = (operator: ICrossFilterOperator | '') => {
    setValue((current) => ({
      ...current,
      primary: {
        ...current.primary,
        operator
      }
    }))
  }

  const setPrimaryValue = (nextValue: string) => {
    setValue((current) => ({
      ...current,
      primary: {
        ...current.primary,
        value: nextValue
      }
    }))
  }

  const setSecondaryOperator = (operator: ICrossFilterOperator | '') => {
    setValue((current) => ({
      ...current,
      secondary: {
        ...current.secondary,
        operator
      }
    }))
  }

  const setSecondaryValue = (nextValue: string) => {
    setValue((current) => ({
      ...current,
      secondary: {
        ...current.secondary,
        value: nextValue
      }
    }))
  }

  const handleClear = () => {
    if (!columnKey) {
      return
    }

    const emptyState: ICrossColumnFilterState = {
      connector: 'Y',
      primary: {
        operator: '',
        value: ''
      },
      secondary: {
        operator: '',
        value: ''
      }
    }
    setValue(emptyState)
    onClear(columnKey)
  }

  const handleApply = () => {
    if (!columnKey) {
      return
    }

    onApply(columnKey, value)
  }

  return {
    value,
    title,
    setConnector,
    setPrimaryOperator,
    setPrimaryValue,
    setSecondaryOperator,
    setSecondaryValue,
    handleClear,
    handleApply,
    handleClose: onClose
  }
}
