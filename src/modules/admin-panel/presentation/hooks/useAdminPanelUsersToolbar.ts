'use client'

import { useCallback, type ChangeEvent } from 'react'

export function useAdminPanelUsersToolbar({
  activeUsersCount,
  filteredUsersCount,
  setSearchValue
}: UseAdminPanelUsersToolbarOptions) {
  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.currentTarget.value)
    },
    [setSearchValue]
  )

  return {
    searchPlaceholder: `Buscar entre ${activeUsersCount} usuarios...`,
    activeUsersLabel: `${filteredUsersCount} usuarios activos`,
    handleSearchChange
  }
}

interface UseAdminPanelUsersToolbarOptions {
  activeUsersCount: number
  filteredUsersCount: number
  setSearchValue: (value: string) => void
}
