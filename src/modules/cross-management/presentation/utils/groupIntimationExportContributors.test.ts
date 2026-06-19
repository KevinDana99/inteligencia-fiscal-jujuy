import type { ICrossPreviewPlanRow } from '../../data/models/CrossManagement'
import { groupIntimationExportContributors } from './groupIntimationExportContributors'

const baseRow: ICrossPreviewPlanRow = {
  id: 'row-2023',
  taxpayerId: '44292a56-7e66-48ac-84f0-5f35aa5ec46d',
  cuit: '30-50026913-4',
  businessName: 'VOLKSWAGEN S.A.',
  values: {
    anio: '2023'
  },
  cells: []
}

describe('groupIntimationExportContributors', () => {
  it('groups planilla rows by contributor and keeps their rows for generation', () => {
    const contributors = groupIntimationExportContributors([
      baseRow,
      {
        ...baseRow,
        id: 'row-2024',
        values: {
          anio: '2024'
        }
      }
    ])

    expect(contributors).toHaveLength(1)
    expect(contributors[0]).toMatchObject({
      taxpayerId: '44292a56-7e66-48ac-84f0-5f35aa5ec46d',
      cuit: '30-50026913-4',
      businessName: 'VOLKSWAGEN S.A.'
    })
    expect(contributors[0]?.planillaRows.map((row) => row.values.anio)).toEqual([
      '2023',
      '2024'
    ])
  })
})
