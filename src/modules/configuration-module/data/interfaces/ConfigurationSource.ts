import type {
  ConfigurationType,
  IntimationType,
  ReportType
} from '../models/Configuration'

export interface IConfigurationSource {
  getConfiguration(): Promise<ConfigurationType>
  updateIntimationConfiguration(
    plantillaId: string,
    configuration: IntimationType
  ): Promise<void>
  updateReportConfiguration(
    plantillaId: string,
    configuration: ReportType
  ): Promise<void>
}
