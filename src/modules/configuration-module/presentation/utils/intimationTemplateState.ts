import type { ConfigurationType } from '../../data/models/Configuration'
import type {
  IntimationTemplateColumn,
  IntimationTemplateState
} from '../hooks/intimation-template/useIntimationTemplate'
import { getIntimationColumnLabel } from './intimationTemplateColumns'

export function cloneIntimationTemplateColumns(
  columns: IntimationTemplateColumn[]
): IntimationTemplateColumn[] {
  return columns.map((column) => ({ ...column }))
}

export function cloneIntimationTemplateState(
  state: IntimationTemplateState
): IntimationTemplateState {
  return {
    ...state,
    columnas: cloneIntimationTemplateColumns(state.columnas)
  }
}

export function mapConfigurationToTemplateState(
  currentConfiguration: ConfigurationType
): IntimationTemplateState {
  return {
    asunto: currentConfiguration.intimacion.asunto,
    saludo: currentConfiguration.intimacion.saludo,
    cuerpo: currentConfiguration.intimacion.cuerpo,
    fuenteInformacion: currentConfiguration.intimacion.fuente_informacion ?? '',
    fechaCorte: currentConfiguration.intimacion.pie,
    columnas: currentConfiguration.intimacion.columnas_seleccionadas.map(
      (columnId) => ({
        id: columnId,
        value: getIntimationColumnLabel(columnId)
      })
    )
  }
}
