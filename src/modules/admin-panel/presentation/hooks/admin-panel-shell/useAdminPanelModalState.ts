'use client'

import { useCallback, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import type { IAdminPanelUser } from '../../../data/models/AdminPanel'

export function useAdminPanelModalState() {
  const [selectedUser, setSelectedUser] = useState<IAdminPanelUser | null>(null)
  const [createOpened, createHandlers] = useDisclosure(false)
  const [editOpened, editHandlers] = useDisclosure(false)
  const [deleteOpened, deleteHandlers] = useDisclosure(false)

  const openCreateModal = useCallback(() => {
    createHandlers.open()
  }, [createHandlers])

  const closeCreateModal = useCallback(() => {
    createHandlers.close()
  }, [createHandlers])

  const openEditModal = useCallback(
    (user: IAdminPanelUser) => {
      setSelectedUser(user)
      editHandlers.open()
    },
    [editHandlers]
  )

  const closeEditModal = useCallback(() => {
    setSelectedUser(null)
    editHandlers.close()
  }, [editHandlers])

  const openDeleteModal = useCallback(
    (user: IAdminPanelUser) => {
      setSelectedUser(user)
      deleteHandlers.open()
    },
    [deleteHandlers]
  )

  const closeDeleteModal = useCallback(() => {
    setSelectedUser(null)
    deleteHandlers.close()
  }, [deleteHandlers])

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null)
  }, [])

  return {
    selectedUser,
    createOpened,
    editOpened,
    deleteOpened,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    clearSelectedUser
  }
}
