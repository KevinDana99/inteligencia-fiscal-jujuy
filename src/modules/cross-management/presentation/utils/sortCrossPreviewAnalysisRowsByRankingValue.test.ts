import type { ICrossPreviewAnalysisRow } from '../../data/models/CrossManagement'
import { sortCrossPreviewAnalysisRowsByRankingValue } from './sortCrossPreviewAnalysisRowsByRankingValue'

function createAnalysisRow(
  id: string,
  netoAPagar: string
): ICrossPreviewAnalysisRow {
  return {
    id,
    businessName: `Empresa ${id}`,
    cuit: id,
    status: 'estado',
    values: {
      netoAPagar
    }
  }
}

describe('sortCrossPreviewAnalysisRowsByRankingValue', () => {
  it('ranks rows by the largest negative neto a pagar value first', () => {
    const rows = [
      createAnalysisRow('first-received', '-$ 253,176,810'),
      createAnalysisRow('smaller-negative', '-$ 491,507')
    ]

    expect(sortCrossPreviewAnalysisRowsByRankingValue(rows).map((row) => row.id)).toEqual([
      'first-received',
      'smaller-negative'
    ])
  })

  it('keeps rows without numeric neto a pagar at the end', () => {
    const rows = [
      createAnalysisRow('without-value', '-'),
      createAnalysisRow('with-value', '$ 1.234,5')
    ]

    expect(sortCrossPreviewAnalysisRowsByRankingValue(rows).map((row) => row.id)).toEqual([
      'with-value',
      'without-value'
    ])
  })
})
