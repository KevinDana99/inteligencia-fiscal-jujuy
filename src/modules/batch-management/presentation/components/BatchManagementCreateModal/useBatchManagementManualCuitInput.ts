'use client'

import { useState, type ChangeEvent, type KeyboardEvent } from 'react'

type UseBatchManagementManualCuitInputParams = {
  onManualCuitsAdd: (value: string) => number
}

export function useBatchManagementManualCuitInput({
  onManualCuitsAdd
}: UseBatchManagementManualCuitInputParams) {
  const [isManualInputOpen, setIsManualInputOpen] = useState(false)
  const [manualCuitValue, setManualCuitValue] = useState('')

  function toggleManualInput() {
    setIsManualInputOpen((current) => !current)
  }

  function handleManualCuitChange(event: ChangeEvent<HTMLInputElement>) {
    setManualCuitValue(event.currentTarget.value)
  }

  function handleManualCuitSubmit() {
    const addedCount = onManualCuitsAdd(manualCuitValue)

    if (!addedCount) {
      return
    }

    setManualCuitValue('')
    setIsManualInputOpen(false)
  }

  function handleManualInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    handleManualCuitSubmit()
  }

  return {
    isManualInputOpen,
    manualCuitValue,
    toggleManualInput,
    handleManualCuitChange,
    handleManualCuitSubmit,
    handleManualInputKeyDown
  }
}
