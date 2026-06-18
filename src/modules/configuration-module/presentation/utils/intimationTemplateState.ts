import type { ConfigurationType } from '../../data/models/Configuration'
import type {
  IntimationTemplateColumn,
  IntimationTemplateState
} from '../hooks/intimation-template/useIntimationTemplate'
import {
  DEFAULT_INTIMATION,
  type IntimationColumnOption
} from '../constants'
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
  currentConfiguration: ConfigurationType,
  columnOptions?: IntimationColumnOption[]
): IntimationTemplateState {
  const configuredColumnIds =
    currentConfiguration.intimacion.columnas_seleccionadas.length > 0
      ? currentConfiguration.intimacion.columnas_seleccionadas
      : DEFAULT_INTIMATION.columnas_seleccionadas
  const selectedColumnIds = resolveSelectableColumnIds(
    configuredColumnIds,
    columnOptions
  )

  return {
    asunto: currentConfiguration.intimacion.asunto,
    saludo: currentConfiguration.intimacion.saludo,
    cuerpo: currentConfiguration.intimacion.cuerpo,
    fuenteInformacion: currentConfiguration.intimacion.fuente_informacion ?? '',
    fechaCorte: currentConfiguration.intimacion.pie,
    columnas: selectedColumnIds.map((columnId) => ({
      id: columnId,
      value: getIntimationColumnLabel(columnId, columnOptions)
    }))
  }
}

function resolveSelectableColumnIds(
  configuredColumnIds: string[],
  columnOptions: IntimationColumnOption[] | undefined
) {
  if (!columnOptions) {
    return configuredColumnIds
  }

  if (!columnOptions.length) {
    return []
  }

  const availableColumnIds = new Set(columnOptions.map((option) => option.id))
  const selectedColumnIds = configuredColumnIds.filter((columnId) =>
    availableColumnIds.has(columnId)
  )

  if (selectedColumnIds.length) {
    return selectedColumnIds
  }

  return columnOptions
    .slice(0, Math.min(configuredColumnIds.length, columnOptions.length))
    .map((option) => option.id)
}
