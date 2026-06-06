import type { ConfigurationType } from '../models/Configuration'

export interface IConfigurationSource {
  getConfiguration(): Promise<ConfigurationType>
}
