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
})
