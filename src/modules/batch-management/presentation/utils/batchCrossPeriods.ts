import type { IBatchCrossSectionFilters } from '../../data/models/BatchManagement'

const ANNUAL_PERIOD_START_MONTH = '01'
const ANNUAL_PERIOD_START_DAY = 1
const ANNUAL_PERIOD_END_MONTH = '12'
const ANNUAL_PERIOD_END_DAY = 31

export function formatBatchCrossDate(year: string, month: string, day: number) {
  return `${year}-${month}-${String(day).padStart(2, '0')}`
}

export function getLastDayOfMonth(year: string, month: string) {
  return new Date(Number(year), Number(month), 0).getDate()
}

export function buildMonthlyCrossPeriod(
  section: IBatchCrossSectionFilters,
  fallbackMonth: string
) {
  const fromMonth = section.fromMonth ?? fallbackMonth
  const toMonth = section.toMonth ?? fallbackMonth

  return {
    periodFrom: formatBatchCrossDate(section.fromYear, fromMonth, 1),
    periodTo: formatBatchCrossDate(
      section.toYear,
      toMonth,
      getLastDayOfMonth(section.toYear, toMonth)
    )
  }
}

export function buildAnnualCrossPeriod(section: IBatchCrossSectionFilters) {
  return {
    periodFrom: formatBatchCrossDate(
      section.fromYear,
      ANNUAL_PERIOD_START_MONTH,
      ANNUAL_PERIOD_START_DAY
    ),
    periodTo: formatBatchCrossDate(
      section.toYear,
      ANNUAL_PERIOD_END_MONTH,
      ANNUAL_PERIOD_END_DAY
    )
  }
}
