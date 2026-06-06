'use client'

import { useRef, type ChangeEvent } from 'react'

type UseBatchManagementFileImportParams = {
  onImportFileSelect: (file: File) => void
}

export function useBatchManagementFileImport({
  onImportFileSelect
}: UseBatchManagementFileImportParams) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleImportButtonClick() {
    fileInputRef.current?.click()
  }

  function handleImportFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (!file) {
      return
    }

    onImportFileSelect(file)
    event.currentTarget.value = ''
  }

  return {
    fileInputRef,
    handleImportButtonClick,
    handleImportFileChange
  }
}
