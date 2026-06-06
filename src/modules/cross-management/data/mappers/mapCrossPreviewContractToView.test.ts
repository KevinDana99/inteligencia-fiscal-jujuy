import {
  mapAnalysisRowsToPreview,
  mapPlanillaRowsToPreview
} from './mapCrossPreviewContractToView'
import {
  formatCrossPreviewValue,
  mapDynamicRowValue
} from '../utils/crossPreviewDynamicValues'
import { mapCrossColumnFiltersToResumenRequest } from '../utils/crossPreviewFilters'
import type {
  ICrossAnalysisRow,
  ICrossColumnFilters,
  ICrossDynamicColumn,
  ICrossPlanillaRow
} from '../models/CrossManagement'

const numberColumn: ICrossDynamicColumn = {
  allowedOperators: [],
  isFilterable: false,
  key: 'importe',
  label: 'IMPORTE',
  type: 'numero'
}

describe('cross preview dynamic contract mapping', () => {
  it('keeps null and zero semantics when formatting values', () => {
    expect(formatCrossPreviewValue(null, numberColumn)).toBe('-')
    expect(formatCrossPreviewValue(0, numberColumn)).toBe('0')
  })

  it('extracts values from the typed row dictionaries', () => {
    const dateColumn: ICrossDynamicColumn = {
      allowedOperators: [],
      isFilterable: false,
      key: 'fechaCierre',
      label: 'FECHA',
      type: 'fecha'
    }
    const textColumn: ICrossDynamicColumn = {
      allowedOperators: [],
      isFilterable: false,
      key: 'regimen',
      label: 'REGIMEN',
      type: 'string'
    }

    expect(
      mapDynamicRowValue(
        {
          dates: { fechaCierre: '2024-12-31' },
          metrics: { importe: 1234.5 },
          texts: { regimen: 'CM' }
        },
        dateColumn
      )
    ).toBe('31/12/2024')
    expect(
      mapDynamicRowValue(
        {
          dates: {},
          metrics: { importe: 1234.5 },
          texts: { regimen: 'CM' }
        },
        numberColumn
      )
    ).toBe('1.234,5')
    expect(
      mapDynamicRowValue(
        {
          dates: {},
          metrics: {},
          texts: { regimen: 'CM' }
        },
        textColumn
      )
    ).toBe('CM')
  })

  it('maps planilla rows using the provided column order for schema reuse', () => {
    const columns: ICrossDynamicColumn[] = [
      {
        allowedOperators: [],
        isFilterable: false,
        key: 'cuit',
        label: 'CUIT',
        type: 'string'
      },
      numberColumn
    ]
    const rows: ICrossPlanillaRow[] = [
      {
        businessName: 'Empresa SA',
        cuit: '30504018845',
        dates: {},
        metrics: { importe: 0 },
        texts: {}
      }
    ]

    expect(mapPlanillaRowsToPreview(rows, columns)[0]).toMatchObject({
      cells: ['30-50401884-5', '0'],
      values: {
        cuit: '30-50401884-5',
        importe: '0'
      }
    })
  })

  it('maps analysis rows and keeps estadoRelevancia outside dynamic dictionaries', () => {
    const columns: ICrossDynamicColumn[] = [
      {
        allowedOperators: [],
        isFilterable: false,
        key: 'estadoRelevancia',
        label: 'ESTADO',
        type: 'string'
      }
    ]
    const rows: ICrossAnalysisRow[] = [
      {
        businessName: 'Empresa SA',
        cuit: '30504018845',
        dates: {},
        metrics: {},
        relevanceStatus: 'Relevante',
        texts: {}
      }
    ]

    expect(mapAnalysisRowsToPreview(rows, columns)[0]).toMatchObject({
      status: 'relevante',
      values: {
        estadoRelevancia: 'Relevante'
      }
    })
  })

  it('maps only complete filter conditions to the resumen request', () => {
    const filters: ICrossColumnFilters = {
      bi910: {
        connector: 'Y',
        primary: {
          operator: 'mayorQue',
          value: '1000'
        },
        secondary: {
          operator: 'menorOIgualQue',
          value: ''
        }
      },
      diferencia: {
        connector: 'O',
        primary: {
          operator: 'igualA',
          value: '0'
        },
        secondary: {
          operator: 'distintoDe',
          value: '-10'
        }
      }
    }

    expect(mapCrossColumnFiltersToResumenRequest(filters)).toEqual([
      {
        conditions: [{ operator: 'mayorQue', value: '1000' }],
        connector: 'Y',
        field: 'bi910'
      },
      {
        conditions: [
          { operator: 'igualA', value: '0' },
          { operator: 'distintoDe', value: '-10' }
        ],
        connector: 'O',
        field: 'diferencia'
      }
    ])
  })
})
