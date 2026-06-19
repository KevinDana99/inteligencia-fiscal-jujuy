import { reorderIntimationTemplateColumns } from './intimationTemplateColumns'

const columns = [
  { id: 'anio', value: 'AÑO' },
  {
    id: 'baseImponibleIngresosBrutos',
    value: 'Base Imponible Ingresos Brutos'
  },
  {
    id: 'baseImponibleInformadaPorTerceros',
    value: 'Base Imponible Informada por Terceros (*)'
  }
]

describe('reorderIntimationTemplateColumns', () => {
  it('moves a column to the target column position', () => {
    const reorderedColumns = reorderIntimationTemplateColumns(
      columns,
      'anio',
      'baseImponibleInformadaPorTerceros'
    )

    expect(reorderedColumns.map((column) => column.id)).toEqual([
      'baseImponibleIngresosBrutos',
      'baseImponibleInformadaPorTerceros',
      'anio'
    ])
  })

  it('keeps the original reference when source or target is invalid', () => {
    const reorderedColumns = reorderIntimationTemplateColumns(
      columns,
      'missing',
      'anio'
    )

    expect(reorderedColumns).toBe(columns)
  })
})
