import {
  getBatchDetailCuitRange,
  getBatchDetailCuitRangeLabel
} from './batchManagementBatchDetail'

describe('batchManagementBatchDetail', () => {
  it('reports the visible backend page range using backend totals', () => {
    const range = getBatchDetailCuitRange({
      page: 1,
      itemsPerPage: 20,
      visibleItems: 20,
      totalItems: 10000
    })

    expect(range.firstItemNumber).toBe(1)
    expect(range.lastItemNumber).toBe(20)
    expect(getBatchDetailCuitRangeLabel(1, 20, 10000)).toBe(
      'Mostrando 1-20 de 10000 CUITs'
    )
  })

  it('does not use the visible CUIT count as the real total', () => {
    const range = getBatchDetailCuitRange({
      page: 2,
      itemsPerPage: 20,
      visibleItems: 20,
      totalItems: 10000
    })

    expect(range.firstItemNumber).toBe(21)
    expect(range.lastItemNumber).toBe(40)
    expect(range.totalItems).toBe(10000)
    expect(getBatchDetailCuitRangeLabel(21, 40, 10000)).toBe(
      'Mostrando 21-40 de 10000 CUITs'
    )
  })

  it('reports empty ranges when the backend page has no visible CUITs', () => {
    const emptyPage = getBatchDetailCuitRange({
      page: 3,
      itemsPerPage: 20,
      visibleItems: 0,
      totalItems: 0
    })

    expect(emptyPage.page).toBe(3)
    expect(emptyPage.firstItemNumber).toBe(0)
    expect(emptyPage.lastItemNumber).toBe(0)
    expect(getBatchDetailCuitRangeLabel(0, 0, 0)).toBe(
      'Mostrando 0 de 0 CUITs'
    )
  })
})
