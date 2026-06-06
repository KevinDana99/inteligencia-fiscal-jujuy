import type {
  ConfigurationType,
  DeepPartial
} from '../../data/models/Configuration'

export function mergeConfiguration(
  currentConfiguration: ConfigurationType,
  partialConfiguration: DeepPartial<ConfigurationType>
): ConfigurationType {
  return {
    ...currentConfiguration,
    ...partialConfiguration,
    intimacion: {
      ...currentConfiguration.intimacion,
      ...partialConfiguration.intimacion
    },
    informe: {
      ...currentConfiguration.informe,
      ...partialConfiguration.informe
    }
  }
}
