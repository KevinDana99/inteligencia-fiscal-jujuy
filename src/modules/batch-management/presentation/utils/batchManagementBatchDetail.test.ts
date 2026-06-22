import type { IBatchManagementCuit } from '../../data/models/BatchManagement'
import {
  getBatchDetailCuitPage,
  getBatchDetailCuitRangeLabel
} from './batchManagementBatchDetail'

function buildCuits(count: number): IBatchManagementCuit[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `cuit-${index + 1}`,
    cuit: `2030405${String(index + 1).padStart(4, '0')}`,
    businessName: `Contribuyente ${index + 1}`,
    regime: 'Convenio Multilateral',
    order: index + 1
  }))
}

describe('batchManagementBatchDetail', () => {
  it('paginates long CUIT lists without rendering every row at once', () => {
    const page = getBatchDetailCuitPage({
      cuits: buildCuits(301),
      page: 7,
      itemsPerPage: 50
    })

    expect(page.totalPages).toBe(7)
    expect(page.cuits).toHaveLength(1)
    expect(page.firstItemNumber).toBe(301)
    expect(page.lastItemNumber).toBe(301)
  })

  it('clamps invalid pages and reports empty ranges', () => {
    const overflowPage = getBatchDetailCuitPage({
      cuits: buildCuits(51),
      page: 99,
      itemsPerPage: 25
    })
    const emptyPage = getBatchDetailCuitPage({
      cuits: [],
      page: 3,
      itemsPerPage: 25
    })

    expect(overflowPage.page).toBe(3)
    expect(overflowPage.firstItemNumber).toBe(51)
    expect(getBatchDetailCuitRangeLabel(51, 51, 51)).toBe(
      'Mostrando 51-51 de 51 CUITs'
    )
    expect(emptyPage.page).toBe(1)
    expect(getBatchDetailCuitRangeLabel(0, 0, 0)).toBe(
      'Mostrando 0 de 0 CUITs'
    )
  })
})
