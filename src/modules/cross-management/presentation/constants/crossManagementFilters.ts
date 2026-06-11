import type { ComboboxItem } from '@mantine/core'

export const CROSS_MANAGEMENT_SEARCH_PLACEHOLDER =
  'Buscar por nombre, lote o CUIT...'

export const CROSS_MANAGEMENT_PERIOD_OPTIONS: ComboboxItem[] = [
  { value: '', label: 'Todos los períodos' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' }
]

export const CROSS_MANAGEMENT_DAY_RANGE_OPTIONS: ComboboxItem[] = [
  { value: '', label: 'Todos los días' },
  { value: '7', label: 'Últimos 7 días' },
  { value: '30', label: 'Últimos 30 días' },
  { value: '90', label: 'Últimos 3 meses' },
  { value: '180', label: 'Últimos 6 meses' },
  { value: '365', label: 'Último año' },
  { value: '730', label: 'Últimos 2 años' },
  { value: '1095', label: 'Últimos 3 años' }
]
