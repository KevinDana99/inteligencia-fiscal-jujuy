'use client'

import { useState, useTransition } from 'react'
import { BATCH_REGIME_OPTIONS } from '../../constants'

type BatchManagementCreateFormState = {
  name: string
  regime: string | null
  description: string
}

type BatchManagementCreateRegimeOption = {
  value: string
  label: string
}

type OpenCreateModalOptions = {
  initialRegime?: string | null
  lockedRegimeOption?: BatchManagementCreateRegimeOption | null
}

const EMPTY_BATCH_CREATE_FORM: BatchManagementCreateFormState = {
  name: '',
  regime: null,
  description: ''
}

export function useBatchManagementCreateForm() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_BATCH_CREATE_FORM)
  const [isRegimeLocked, setIsRegimeLocked] = useState(false)
  const [regimeOptions, setRegimeOptions] = useState<
    BatchManagementCreateRegimeOption[]
  >([...BATCH_REGIME_OPTIONS])
  const [createError, setCreateError] = useState<string | null>(null)
  const [isCreatePending, startCreateTransition] = useTransition()

  function openCreateModal(options: OpenCreateModalOptions = {}) {
    setCreateForm({
      ...EMPTY_BATCH_CREATE_FORM,
      regime: options.initialRegime ?? null
    })
    setIsRegimeLocked(Boolean(options.lockedRegimeOption))
    setRegimeOptions(
      options.lockedRegimeOption
        ? [options.lockedRegimeOption]
        : [...BATCH_REGIME_OPTIONS]
    )
    setCreateError(null)
    setIsCreateModalOpen(true)
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false)
  }

  function resetCreateForm() {
    setCreateForm(EMPTY_BATCH_CREATE_FORM)
    setIsRegimeLocked(false)
    setRegimeOptions([...BATCH_REGIME_OPTIONS])
    setCreateError(null)
    setIsCreateModalOpen(false)
  }

  function setCreateFormField(
    field: keyof BatchManagementCreateFormState,
    value: string | null
  ) {
    if (field === 'regime' && isRegimeLocked) {
      return
    }

    setCreateError(null)
    setCreateForm((current) => ({
      ...current,
      [field]: value
    }))
  }

  return {
    isCreateModalOpen,
    createForm,
    isRegimeLocked,
    regimeOptions,
    createError,
    isCreatePending,
    startCreateTransition,
    setCreateError,
    openCreateModal,
    closeCreateModal,
    resetCreateForm,
    setCreateFormField
  }
}
