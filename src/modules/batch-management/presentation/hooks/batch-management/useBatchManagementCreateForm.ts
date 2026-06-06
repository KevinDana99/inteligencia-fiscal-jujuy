'use client'

import { useState, useTransition } from 'react'

type BatchManagementCreateFormState = {
  name: string
  regime: string | null
  description: string
}

const EMPTY_BATCH_CREATE_FORM: BatchManagementCreateFormState = {
  name: '',
  regime: null,
  description: ''
}

export function useBatchManagementCreateForm() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createForm, setCreateForm] = useState(EMPTY_BATCH_CREATE_FORM)
  const [createError, setCreateError] = useState<string | null>(null)
  const [isCreatePending, startCreateTransition] = useTransition()

  function openCreateModal() {
    setCreateForm(EMPTY_BATCH_CREATE_FORM)
    setCreateError(null)
    setIsCreateModalOpen(true)
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false)
  }

  function resetCreateForm() {
    setCreateForm(EMPTY_BATCH_CREATE_FORM)
    setCreateError(null)
    setIsCreateModalOpen(false)
  }

  function setCreateFormField(
    field: keyof BatchManagementCreateFormState,
    value: string | null
  ) {
    setCreateError(null)
    setCreateForm((current) => ({
      ...current,
      [field]: value
    }))
  }

  return {
    isCreateModalOpen,
    createForm,
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
