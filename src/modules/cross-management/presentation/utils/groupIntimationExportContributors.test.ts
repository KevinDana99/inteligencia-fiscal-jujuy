import type {
  ICrossPreviewAnalysisRow,
  ICrossPreviewPlanRow
} from '../../data/models/CrossManagement'
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

  it('orders contributors using the analysis ranking rows', () => {
    const secondRankedRow: ICrossPreviewPlanRow = {
      ...baseRow,
      id: 'second-ranked-row',
      taxpayerId: 'a073938e-ce55-4f3f-a3b6-2a49326aa0f1',
      cuit: '20-35555846-1',
      businessName: 'TORREZ DANIEL FERNANDO'
    }
    const thirdRankedRow: ICrossPreviewPlanRow = {
      ...baseRow,
      id: 'third-ranked-row',
      taxpayerId: '43bf31d5-f8f4-4fa1-bdbd-663ef58ecb38',
      cuit: '27-13889915-8',
      businessName: 'TARIFA NIEVES DOMINGA'
    }
    const rankingRows: ICrossPreviewAnalysisRow[] = [
      {
        id: 'rank-1',
        taxpayerId: thirdRankedRow.taxpayerId,
        cuit: thirdRankedRow.cuit,
        businessName: thirdRankedRow.businessName,
        values: {},
        status: 'relevante'
      },
      {
        id: 'rank-2',
        taxpayerId: secondRankedRow.taxpayerId,
        cuit: secondRankedRow.cuit,
        businessName: secondRankedRow.businessName,
        values: {},
        status: 'relevante'
      },
      {
        id: 'rank-3',
        taxpayerId: baseRow.taxpayerId,
        cuit: baseRow.cuit,
        businessName: baseRow.businessName,
        values: {},
        status: 'relevante'
      }
    ]

    const contributors = groupIntimationExportContributors(
      [baseRow, secondRankedRow, thirdRankedRow],
      rankingRows
    )

    expect(contributors.map((contributor) => contributor.cuit)).toEqual([
      '27-13889915-8',
      '20-35555846-1',
      '30-50026913-4'
    ])
  })
})
