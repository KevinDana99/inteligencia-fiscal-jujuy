'use client'

import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { REPROCESSING_PAGE_LABELS } from '../../../constants/reprocessingPageLabels'
import classes from './ReprocessingSearch.module.css'

interface ReprocessingSearchProps {
  isPending: boolean
  onChange: (value: string) => void
  value: string
}

export function ReprocessingSearch({
  isPending,
  onChange,
  value
}: ReprocessingSearchProps) {
  return (
    <div className={classes.searchRow}>
      <TextInput
        leftSection={<IconSearch size={16} />}
        placeholder={REPROCESSING_PAGE_LABELS.searchPlaceholder}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className={classes.searchInput}
        classNames={{
          input: classes.searchInputField,
          section: classes.searchInputSection
        }}
        rightSection={isPending ? <IconSearch size={14} /> : null}
      />
    </div>
  )
}
