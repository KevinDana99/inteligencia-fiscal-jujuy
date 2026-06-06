'use client'

import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { REPROCESSING_PAGE_LABELS } from '../../../constants/reprocessingPageLabels'
import { useReprocessingSearch } from '../../../hooks'
import type {
  IReprocessingItems,
  IReprocessingListData
} from '../../../../data/models/Reprocessing'
import classes from './ReprocessingSearch.module.css'

interface ReprocessingSearchProps {
  initialData: IReprocessingListData | null
  items: IReprocessingItems
  total: number
  setItems: React.Dispatch<React.SetStateAction<IReprocessingItems>>
  setTotal: React.Dispatch<React.SetStateAction<number>>
}

export function ReprocessingSearch(props: ReprocessingSearchProps) {
  const { searchValue, isSearchPending, setSearchValue } = useReprocessingSearch(props)

  return (
    <div className={classes.searchRow}>
      <TextInput
        leftSection={<IconSearch size={16} />}
        placeholder={REPROCESSING_PAGE_LABELS.searchPlaceholder}
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        className={classes.searchInput}
        classNames={{
          input: classes.searchInputField,
          section: classes.searchInputSection
        }}
        rightSection={isSearchPending ? <IconSearch size={14} /> : null}
      />
    </div>
  )
}
