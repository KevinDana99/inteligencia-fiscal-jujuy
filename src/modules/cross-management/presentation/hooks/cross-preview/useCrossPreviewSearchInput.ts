'use client'

import { useCallback } from 'react'
import type { ChangeEvent } from 'react'

export function useCrossPreviewSearchInput(
  setSearchValue: (value: string) => void
) {
  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.currentTarget.value)
    },
    [setSearchValue]
  )

  return { handleSearchChange }
}
