import type { ConfigurationType, IntimationType } from '../models/Configuration'

export interface IConfigurationSource {
  getConfiguration(): Promise<ConfigurationType>
  updateIntimationConfiguration(
    plantillaId: string,
    configuration: IntimationType
  ): Promise<void>
}
