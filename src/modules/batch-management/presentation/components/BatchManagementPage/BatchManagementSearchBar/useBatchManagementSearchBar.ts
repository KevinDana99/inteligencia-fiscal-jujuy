'use client'

import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler
} from 'react'

type UseBatchManagementSearchBarParams = {
  searchValue: string
  isSearchPending: boolean
  resultCountLabel: string
  onSearchValueChange: (value: string) => void
  onSearchSubmit: () => void
}

export function useBatchManagementSearchBar({
  searchValue,
  isSearchPending,
  resultCountLabel,
  onSearchValueChange,
  onSearchSubmit
}: UseBatchManagementSearchBarParams) {
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onSearchValueChange(event.currentTarget.value)
  }

  const handleSearchBlur: FocusEventHandler<HTMLInputElement> = () => {
    onSearchSubmit()
  }

  const handleSearchKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    onSearchSubmit()
  }

  return {
    searchInput: {
      value: searchValue,
      onBlur: handleSearchBlur,
      onChange: handleSearchChange,
      onKeyDown: handleSearchKeyDown
    },
    isSearchPending,
    resultCountLabel
  }
}
