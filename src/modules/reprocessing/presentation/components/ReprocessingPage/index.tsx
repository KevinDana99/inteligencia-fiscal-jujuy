'use client'

import type { IReprocessingListData } from '../../../data/models/Reprocessing'
import { useReprocessingPage } from '../../hooks'
import { ReprocessingAlertBanner } from './ReprocessingAlertBanner'
import { ReprocessingPagination } from './ReprocessingPagination'
import { ReprocessingRemoveModal } from './ReprocessingRemoveModal'
import { ReprocessingSearch } from './ReprocessingSearch'
import { ReprocessingTable } from './ReprocessingTable'
import classes from './ReprocessingPage.module.css'

export function ReprocessingPage({
  initialData
}: {
  initialData: IReprocessingListData | null
}) {
  const {
    items,
    total,
    currentPage,
    itemsPerPage,
    totalPages,
    searchValue,
    isSearchPending,
    isPagePending,
    pendingRemovalItem,
    setSearchValue,
    setPendingRemovalItem,
    goToPage,
    removeItem
  } = useReprocessingPage(initialData)

  return (
    <div className={classes.root}>
      <ReprocessingAlertBanner total={total} />
      <ReprocessingSearch
        value={searchValue}
        onChange={setSearchValue}
        isPending={isSearchPending}
      />
      <ReprocessingTable
        items={items}
        setPendingRemovalItem={setPendingRemovalItem}
      />
      <ReprocessingPagination
        activePage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onChange={goToPage}
        disabled={isPagePending || isSearchPending}
      />
      <ReprocessingRemoveModal
        pendingRemovalItem={pendingRemovalItem}
        setPendingRemovalItem={setPendingRemovalItem}
        onRemoved={removeItem}
      />
    </div>
  )
}
