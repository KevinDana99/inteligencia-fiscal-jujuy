'use client'

import { useCallback, useMemo, useState } from 'react'
import type { IAdminPanelUser } from '../../../data/models/AdminPanel'

export function useAdminPanelUsers(initialUsers: IAdminPanelUser[]) {
  const [users, setUsers] = useState(initialUsers)
  const [searchValue, setSearchValue] = useState('')

  const activeUsers = useMemo(
    () => users.filter((user) => !user.isDeleted),
    [users]
  )

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    if (!normalizedSearch) {
      return activeUsers
    }

    return activeUsers.filter((user) => {
      const haystack =
        `${user.fullName} ${user.email} ${user.roleLabel}`.toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }, [activeUsers, searchValue])

  const markUserAsDeleted = useCallback((userId: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, isDeleted: true } : user
      )
    )
  }, [])

  return {
    searchValue,
    setSearchValue,
    activeUsersCount: activeUsers.length,
    filteredUsers,
    markUserAsDeleted
  }
}
