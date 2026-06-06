'use client'

import { Select, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import type { ComboboxItem } from '@mantine/core'
import { CROSS_MANAGEMENT_SEARCH_PLACEHOLDER } from '../../constants/crossManagementFilters'
import { useCrossManagementFiltersBar } from '../../hooks/cross-management/useCrossManagementFiltersBar'
import classes from './CrossManagementFiltersBar.module.css'

interface CrossManagementFiltersBarProps {
  dayRangeOptions: ComboboxItem[]
  dayRangeValue: string
  periodOptions: ComboboxItem[]
  periodValue: string
  searchValue: string
  setDayRangeValue: (value: string) => void
  setPeriodValue: (value: string) => void
  setSearchValue: (value: string) => void
  total: number
}

export function CrossManagementFiltersBar({
  dayRangeOptions,
  dayRangeValue,
  periodOptions,
  periodValue,
  searchValue,
  setDayRangeValue,
  setPeriodValue,
  setSearchValue,
  total
}: CrossManagementFiltersBarProps) {
  const {
    handleDayRangeChange,
    handlePeriodChange,
    handleSearchChange
  } = useCrossManagementFiltersBar({
    setDayRangeValue,
    setPeriodValue,
    setSearchValue
  })

  return (
    <div className={classes.filtersRow}>
      <div className={classes.filtersControls}>
        <TextInput
          leftSection={<IconSearch size={14} />}
          placeholder={CROSS_MANAGEMENT_SEARCH_PLACEHOLDER}
          value={searchValue}
          onChange={handleSearchChange}
          className={classes.searchInput}
          classNames={{
            input: classes.searchInputField,
            section: classes.searchInputSection
          }}
        />

        <Select
          data={periodOptions}
          value={periodValue}
          onChange={handlePeriodChange}
          className={classes.filterSelect}
          classNames={{
            input: classes.filterSelectInput,
            dropdown: classes.filterSelectDropdown,
            option: classes.filterSelectOption
          }}
        />

        <Select
          data={dayRangeOptions}
          value={dayRangeValue}
          onChange={handleDayRangeChange}
          className={classes.filterSelect}
          classNames={{
            input: classes.filterSelectInput,
            dropdown: classes.filterSelectDropdown,
            option: classes.filterSelectOption
          }}
        />

        <div className={classes.filterSeparator} />
      </div>

      <div className={classes.countContainer}>
        <span className={classes.countText}>{total} cruces</span>
      </div>
    </div>
  )
}
