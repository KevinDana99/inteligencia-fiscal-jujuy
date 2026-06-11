'use client'

import { startTransition, useCallback, useState } from 'react'
import { deleteAdminUserAction } from '../../../data/actions'
import type { IAdminPanelUser } from '../../../data/models/AdminPanel'

export function useDeleteAdminPanelUser({
  selectedUser,
  markUserAsDeleted,
  closeDeleteModal,
  clearSelectedUser
}: UseDeleteAdminPanelUserOptions) {
  const [actionError, setActionError] = useState<string | null>(null)
  const [isActionPending, setIsActionPending] = useState(false)

  const clearActionError = useCallback(() => {
    setActionError(null)
  }, [])

  const deleteUser = useCallback(async () => {
    if (!selectedUser || selectedUser.isAdmin) {
      closeDeleteModal()
      return false
    }

    if (selectedUser.hasUsuarioId === false) {
      setActionError(
        'No fue posible eliminar el usuario porque el listado no incluye usuarioId.'
      )
      return false
    }

    setActionError(null)
    setIsActionPending(true)

    return new Promise<boolean>((resolve) => {
      startTransition(() => {
        void deleteAdminUserAction(selectedUser.id)
          .then((result) => {
            if (!result.success) {
              setActionError(
                result.error ?? 'No fue posible eliminar el usuario.'
              )
              resolve(false)
              return
            }

            markUserAsDeleted(selectedUser.id)
            clearSelectedUser()
            closeDeleteModal()
            resolve(true)
          })
          .catch(() => {
            setActionError('No fue posible eliminar el usuario.')
            resolve(false)
          })
          .finally(() => {
            setIsActionPending(false)
          })
      })
    })
  }, [
    clearSelectedUser,
    closeDeleteModal,
    markUserAsDeleted,
    selectedUser
  ])

  return {
    actionError,
    isActionPending,
    deleteUser,
    clearActionError
  }
}

interface UseDeleteAdminPanelUserOptions {
  selectedUser: IAdminPanelUser | null
  markUserAsDeleted: (userId: string) => void
  closeDeleteModal: () => void
  clearSelectedUser: () => void
}
