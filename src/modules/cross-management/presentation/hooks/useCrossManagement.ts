'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type {
  ICrossManagementItem,
  ICrossManagementListData
} from '../../data/models/CrossManagement'

const DAY_FILTER_OPTIONS = [
  { value: '', label: 'Todos los días' },
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: '90', label: 'Últimos 3 meses' },
  { value: '180', label: 'Últimos 6 meses' },
  { value: '365', label: 'Último año' },
  { value: '730', label: 'Últimos 2 años' },
  { value: '1095', label: 'Últimos 3 años' }
]

function parseDate(dateLabel: string) {
  const [day, month, year] = dateLabel.split('/').map(Number)
  return new Date(year, month - 1, day).getTime()
}

function matchesDayRange(itemDate: string, selectedRange: string) {
  if (!selectedRange) {
    return true
  }

  const now = Date.now()
  const diffMs = now - parseDate(itemDate)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  return diffDays <= Number(selectedRange)
}

export function useCrossManagement(initialCrossData?: ICrossManagementListData | null) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [dayRangeValue, setDayRangeValue] = useState('')

  const filteredItems = useMemo(() => {
    const initialItems = initialCrossData?.items ?? []
    const normalizedSearch = searchValue.trim().toLowerCase()

    return initialItems.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.sourceRef.toLowerCase().includes(normalizedSearch)

      const matchesDays = matchesDayRange(item.date, dayRangeValue)

      return matchesSearch && matchesDays
    })
  }, [dayRangeValue, initialCrossData, searchValue])

  const openCrossPreview = (item: ICrossManagementItem) => {
    router.push(
      `/gestion-de-cruces/vista-previa-cruce/${encodeURIComponent(item.id)}`
    )
  }

  return {
    items: filteredItems,
    total: filteredItems.length,
    searchValue,
    dayRangeValue,
    dayRangeOptions: DAY_FILTER_OPTIONS,
    setSearchValue,
    setDayRangeValue,
    openCrossPreview
  }
}
