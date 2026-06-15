import type {
  IBatchAvailableCrosses,
  IBatchCrossFilters
} from '../../data/models/BatchManagement'
import {
  buildBatchCrossExecutionPayloads,
  getBatchCrossOptionLabels
} from './batchManagementCross'

const availableCrosses: IBatchAvailableCrosses = [
  {
    id: 'cruce-bi-papel:1.0.0',
    label: 'cruce-bi-papel',
    publicCode: 'cruce-bi-papel',
    version: '1.0.0',
    periodicity: 'annual'
  },
  {
    id: 'desvio-bi-convenio-multilateral:1.0.0',
    label: 'Control de desvio de BI - Regimen CM',
    publicCode: 'desvio-bi-convenio-multilateral',
    version: '1.0.0',
    periodicity: 'annual'
  },
  {
    id: 'control-mensual:1.0.0',
    label: 'Control mensual',
    publicCode: 'control-mensual',
    version: '1.0.0',
    periodicity: 'monthly'
  }
]

function createFilters(): IBatchCrossFilters {
  return {
    monthly: {
      isOpen: false,
      fromYear: '2024',
      toYear: '2024',
      fromMonth: '01',
      toMonth: '01',
      crossTypes: []
    },
    annual: {
      isOpen: true,
      fromYear: '2024',
      toYear: '2025',
      fromMonth: null,
      toMonth: null,
      crossTypes: ['Control de desvio de BI - Regimen CM']
    }
  }
}

describe('batchManagementCross', () => {
  it('groups visible option labels by periodicity', () => {
    expect(getBatchCrossOptionLabels(availableCrosses, 'annual')).toEqual([
      'Control de desvio de BI - Regimen CM'
    ])
    expect(getBatchCrossOptionLabels(availableCrosses, 'monthly')).toEqual([])
  })

  it('builds execution payloads from dynamic available crosses', () => {
    expect(
      buildBatchCrossExecutionPayloads('batch-1', createFilters(), availableCrosses)
    ).toEqual([
      {
        batchId: 'batch-1',
        crossCode: 'desvio-bi-convenio-multilateral',
        crossVersion: '1.0.0',
        periodFrom: '2024-01-01',
        periodTo: '2025-12-31',
        parameters: {
          jurisdiccion: '910',
          jurisdiccionesExcluidasTotalIngresos: '923'
        }
      }
    ])
  })

  it('does not build executions for unsupported crosses that require uncaptured params', () => {
    const filters = createFilters()
    filters.annual.crossTypes = ['cruce-bi-papel']

    expect(
      buildBatchCrossExecutionPayloads('batch-1', filters, availableCrosses)
    ).toEqual([])
  })
})
