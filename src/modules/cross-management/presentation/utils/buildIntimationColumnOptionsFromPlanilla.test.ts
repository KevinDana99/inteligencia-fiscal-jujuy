import type {
  ICrossDynamicColumn,
  ICrossPreviewPlanRow
} from '../../data/models/CrossManagement'
import { buildIntimationColumnOptionsFromPlanilla } from './buildIntimationColumnOptionsFromPlanilla'

const baseColumn: ICrossDynamicColumn = {
  key: 'anio',
  type: 'string',
  label: 'AÑO',
  isFilterable: true,
  allowedOperators: []
}

const baseRow: ICrossPreviewPlanRow = {
  id: 'row-1',
  taxpayerId: '44292a56-7e66-48ac-84f0-5f35aa5ec46d',
  cuit: '30-50026913-4',
  businessName: 'VOLKSWAGEN S.A.',
  values: {},
  cells: []
}

function createColumn(
  key: string,
  label: string,
  type: ICrossDynamicColumn['type'] = 'string'
): ICrossDynamicColumn {
  return {
    ...baseColumn,
    key,
    label,
    type
  }
}

describe('buildIntimationColumnOptionsFromPlanilla', () => {
  it('uses table columns that have values and keeps zero-valued columns', () => {
    const columns = [
      createColumn('anio', 'AÑO'),
      createColumn('base', 'Base', 'numero'),
      createColumn('zero', 'Valor cero', 'numero'),
      createColumn('empty', 'Sin valor')
    ]
    const rows = [
      {
        ...baseRow,
        values: {
          anio: '2025',
          base: '-',
          zero: '0',
          empty: ''
        }
      },
      {
        ...baseRow,
        id: 'row-2',
        values: {
          anio: '-',
          base: '-',
          zero: '-',
          empty: '-'
        }
      }
    ]

    expect(buildIntimationColumnOptionsFromPlanilla(columns, rows)).toEqual([
      { id: 'anio', label: 'AÑO' },
      { id: 'zero', label: 'Valor cero' }
    ])
  })

  it('excludes technical id columns even when they have values', () => {
    const columns = [
      createColumn('id', 'ID'),
      createColumn('id2', 'ID 2'),
      createColumn('period_id', 'ID Período'),
      createColumn('base', 'Base', 'numero')
    ]
    const rows = [
      {
        ...baseRow,
        values: {
          id: '1',
          id2: '2',
          period_id: '202501',
          base: '0'
        }
      }
    ]

    expect(buildIntimationColumnOptionsFromPlanilla(columns, rows)).toEqual([
      { id: 'base', label: 'Base' }
    ])
  })

  it('preserves table order and ignores duplicated column keys', () => {
    const columns = [
      createColumn('first', 'Primera'),
      createColumn('first', 'Primera duplicada'),
      createColumn('second', 'Segunda')
    ]
    const rows = [
      {
        ...baseRow,
        values: {
          first: 'dato',
          second: '$ 0'
        }
      }
    ]

    expect(buildIntimationColumnOptionsFromPlanilla(columns, rows)).toEqual([
      { id: 'first', label: 'Primera' },
      { id: 'second', label: 'Segunda' }
    ])
  })
})
