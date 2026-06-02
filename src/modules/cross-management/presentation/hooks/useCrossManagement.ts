'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ICrossManagementItem } from '../../data/models/CrossManagement'
import { crossItemsMock } from '../../data/sources/mock/fixtures/crossItems'

const DAY_FILTER_OPTIONS = [
  { value: '', label: 'Todos los días' },
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: '90', label: 'Últimos 3 meses' }
]

function parseDate(dateLabel: string) {
  const [day, month, year] = dateLabel.split('/').map(Number)
  return new Date(year, month - 1, day).getTime()
}

function matchesDayRange(itemDate: string, selectedRange: string) {
  if (!selectedRange) {
    return true
  }

  const now = new Date(2026, 4, 14).getTime()
  const diffMs = now - parseDate(itemDate)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  return diffDays <= Number(selectedRange)
}

export function useCrossManagement() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [periodValue, setPeriodValue] = useState('')
  const [dayRangeValue, setDayRangeValue] = useState('')

  const periodOptions = useMemo(() => {
    const uniquePeriods = Array.from(new Set(crossItemsMock.map((item) => item.period)))

    return [
      { value: '', label: 'Todos los períodos' },
      ...uniquePeriods.map((period) => ({ value: period, label: period }))
    ]
  }, [])

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return crossItemsMock.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.sourceRef.toLowerCase().includes(normalizedSearch)

      const matchesPeriod = !periodValue || item.period === periodValue
      const matchesDays = matchesDayRange(item.date, dayRangeValue)

      return matchesSearch && matchesPeriod && matchesDays
    })
  }, [dayRangeValue, periodValue, searchValue])

  const openCrossPreview = (item: ICrossManagementItem) => {
    router.push(
      `/gestion-de-cruces/vista-previa-cruce/${encodeURIComponent(item.id)}`
    )
  }

  return {
    items: filteredItems,
    total: filteredItems.length,
    searchValue,
    periodValue,
    dayRangeValue,
    periodOptions,
    dayRangeOptions: DAY_FILTER_OPTIONS,
    setSearchValue,
    setPeriodValue,
    setDayRangeValue,
    openCrossPreview
  }
}
