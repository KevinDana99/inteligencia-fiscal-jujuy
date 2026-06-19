import type { ConfigurationType } from '../../data/models/Configuration'
import { DEFAULT_INTIMATION } from '../constants/configurationDefaults'
import { mapConfigurationToTemplateState } from './intimationTemplateState'

const configurationWithEmptyColumns: ConfigurationType = {
  intimacion: {
    ...DEFAULT_INTIMATION,
    columnas_seleccionadas: []
  },
  informe: {
    id: null,
    titulo: 'Informe',
    cuerpo: 'Cuerpo'
  }
}

describe('mapConfigurationToTemplateState', () => {
  it('uses default intimation columns when configuration has none', () => {
    const state = mapConfigurationToTemplateState(configurationWithEmptyColumns)

    expect(state.columnas.map((column) => column.id)).toEqual([
      'anio',
      'baseImponibleIngresosBrutos',
      'baseImponibleInformadaPorTerceros',
      'diferenciaBaseImponible'
    ])
  })

  it('uses provided column options when configured columns are not available', () => {
    const state = mapConfigurationToTemplateState(configurationWithEmptyColumns, [
      { id: 'fact_arca_anio', label: 'Fact. ARCA (año)' },
      { id: 'imp_presuntivo', label: 'Imp. Presuntivo' }
    ])

    expect(state.columnas).toEqual([
      { id: 'fact_arca_anio', value: 'Fact. ARCA (año)' },
      { id: 'imp_presuntivo', value: 'Imp. Presuntivo' }
    ])
  })
})
