'use client'

import type { ICrossManagementListData } from '../../../data/models/CrossManagement'
import { CrossManagementFiltersBar } from '../CrossManagementFiltersBar'
import { CrossManagementHeader } from '../CrossManagementHeader'
import { CrossManagementTable } from '../CrossManagementTable'
import { useCrossManagement } from '../../hooks'
import classes from './CrossManagementPage.module.css'

interface CrossManagementPageProps {
  initialCrossData?: ICrossManagementListData | null
}

export function CrossManagementPage({
  initialCrossData
}: CrossManagementPageProps) {
  const {
    dayRangeOptions,
    dayRangeValue,
    items,
    openCrossPreview,
    periodOptions,
    periodValue,
    searchValue,
    setDayRangeValue,
    setPeriodValue,
    setSearchValue,
    total
  } = useCrossManagement(initialCrossData)

  return (
    <div className={classes.root}>
      <CrossManagementHeader />
      <CrossManagementFiltersBar
        dayRangeOptions={dayRangeOptions}
        dayRangeValue={dayRangeValue}
        periodOptions={periodOptions}
        periodValue={periodValue}
        searchValue={searchValue}
        setDayRangeValue={setDayRangeValue}
        setPeriodValue={setPeriodValue}
        setSearchValue={setSearchValue}
        total={total}
      />
      <CrossManagementTable
        items={items}
        onOpenCrossPreview={openCrossPreview}
      />
    </div>
  )
}
