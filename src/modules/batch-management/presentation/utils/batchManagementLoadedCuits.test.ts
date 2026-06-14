import type { IBatchLoadedCuitRow } from '../../data/models/BatchManagement'
import { filterLoadedBatchCuits } from './batchManagementLoadedCuits'

const LOADED_CUITS: IBatchLoadedCuitRow[] = [
  {
    id: 'row-1',
    cuit: '30-12345678-9',
    businessName: 'ACME SA',
    source: 'manual'
  },
  {
    id: 'row-2',
    cuit: '27-87654321-0',
    businessName: null,
    source: 'import'
  }
]

describe('batchManagementLoadedCuits', () => {
  it('filters loaded CUIT rows by CUIT or business name', () => {
    expect(filterLoadedBatchCuits(LOADED_CUITS, 'acme')).toEqual([
      LOADED_CUITS[0]
    ])
    expect(filterLoadedBatchCuits(LOADED_CUITS, '8765')).toEqual([
      LOADED_CUITS[1]
    ])
  })

  it('returns an empty list when runtime input is not an array', () => {
    expect(
      filterLoadedBatchCuits(
        { type: 'click' } as unknown as IBatchLoadedCuitRow[],
        ''
      )
    ).toEqual([])
  })
})
