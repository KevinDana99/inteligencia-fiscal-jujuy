'use client'

import type { ChangeEventHandler } from 'react'

type UseBatchManagementSearchBarParams = {
  searchValue: string
  isSearchPending: boolean
  resultCountLabel: string
  onSearchValueChange: (value: string) => void
}

export function useBatchManagementSearchBar({
  searchValue,
  isSearchPending,
  resultCountLabel,
  onSearchValueChange
}: UseBatchManagementSearchBarParams) {
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onSearchValueChange(event.currentTarget.value)
  }

  return {
    searchInput: {
      value: searchValue,
      onChange: handleSearchChange
    },
    isSearchPending,
    resultCountLabel
  }
}
