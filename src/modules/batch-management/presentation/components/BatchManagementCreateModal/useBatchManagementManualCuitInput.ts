'use client'

import { useState, type ChangeEvent, type KeyboardEvent } from 'react'

type UseBatchManagementManualCuitInputParams = {
  onManualCuitsAdd: (value: string) => Promise<number>
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

  async function handleManualCuitSubmit() {
    const addedCount = await onManualCuitsAdd(manualCuitValue)

    if (!addedCount) {
      return
    }

    setManualCuitValue('')
    setIsManualInputOpen(false)
  }

  async function handleManualInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    await handleManualCuitSubmit()
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
