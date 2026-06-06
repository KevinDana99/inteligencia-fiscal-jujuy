'use client'

import type { IReprocessingListData } from '../../../data/models/Reprocessing'
import { useReprocessingPage } from '../../hooks'
import { ReprocessingAlertBanner } from './ReprocessingAlertBanner'
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
    pendingRemovalItem,
    setItems,
    setTotal,
    setPendingRemovalItem,
    removeItem
  } = useReprocessingPage(initialData)

  return (
    <div className={classes.root}>
      <ReprocessingAlertBanner total={total} />
      <ReprocessingSearch
        initialData={initialData}
        items={items}
        total={total}
        setItems={setItems}
        setTotal={setTotal}
      />
      <ReprocessingTable
        items={items}
        setPendingRemovalItem={setPendingRemovalItem}
      />
      <ReprocessingRemoveModal
        pendingRemovalItem={pendingRemovalItem}
        setPendingRemovalItem={setPendingRemovalItem}
        onRemoved={removeItem}
      />
    </div>
  )
}
