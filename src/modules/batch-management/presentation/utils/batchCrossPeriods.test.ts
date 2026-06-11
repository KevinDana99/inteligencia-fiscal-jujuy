import { buildAnnualCrossPeriod } from './batchCrossPeriods'
import type { IBatchCrossSectionFilters } from '../../data/models/BatchManagement'

function createAnnualSection(
  fromYear: string,
  toYear: string
): IBatchCrossSectionFilters {
  return {
    isOpen: true,
    fromYear,
    toYear,
    fromMonth: null,
    toMonth: null,
    crossTypes: ['Control de desvio de BI - Regimen CM']
  }
}

describe('batchCrossPeriods', () => {
  it('serializes a same-year annual range as the full calendar year', () => {
    expect(buildAnnualCrossPeriod(createAnnualSection('2024', '2024'))).toEqual({
      periodFrom: '2024-01-01',
      periodTo: '2024-12-31'
    })
  })

  it('serializes a multi-year annual range from January 1 to December 31', () => {
    expect(buildAnnualCrossPeriod(createAnnualSection('2023', '2025'))).toEqual({
      periodFrom: '2023-01-01',
      periodTo: '2025-12-31'
    })
  })
})
