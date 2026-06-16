import type { ICrossPreviewPlanRow } from '../../data/models/CrossManagement'
import { resolveIntimationExportColumnValue } from './resolveIntimationExportColumnValue'

const contributor: ICrossPreviewPlanRow = {
  id: 'row-1',
  taxpayerId: 'ba2affa0-76a4-47bf-9f77-ed91905aae13',
  cuit: '30-50168521-2',
  businessName: 'CERAMICA DEL NORTE S A',
  cells: [],
  values: {
    anio: '2.024',
    baseImponibleIngresosBrutos: '-$ ',
    baseImponibleInformadaPorTerceros: '$$ 0',
    diferenciaBaseImponible: '$$ 55.803.248'
  }
}

describe('resolveIntimationExportColumnValue', () => {
  it('normalizes generated intimation currency values idempotently', () => {
    expect(resolveIntimationExportColumnValue(contributor, 'anio')).toBe('2024')
    expect(
      resolveIntimationExportColumnValue(
        contributor,
        'baseImponibleIngresosBrutos'
      )
    ).toBe('$ 0')
    expect(
      resolveIntimationExportColumnValue(
        contributor,
        'baseImponibleInformadaPorTerceros'
      )
    ).toBe('$ 0')
    expect(
      resolveIntimationExportColumnValue(contributor, 'diferenciaBaseImponible')
    ).toBe('$ 55.803.248')
  })
})
