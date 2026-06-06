import { getJson, type ApiClientConfig } from '@/lib/api-client'
import type { IConfigurationSource } from '../../interfaces/ConfigurationSource'
import type { ConfigurationType } from '../../models/Configuration'
import type {
  ApiIntimationConfigurationDto,
  ApiReportConfigurationDto
} from './dtos/ApiConfigurationDtos'

export class RestConfigurationSource implements IConfigurationSource {
  constructor(private readonly config: ApiClientConfig) {}

  async getConfiguration(): Promise<ConfigurationType> {
    console.log({
      action: 'RestConfigurationSource.getConfiguration',
      baseUrl: this.config.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL,
      endpoints: [
        '/api/configuracion/intimacion',
        '/api/configuracion/informe'
      ]
    })

    const [intimacion, informe] = await Promise.all([
      getJson<ApiIntimationConfigurationDto>(
        '/api/configuracion/intimacion',
        this.config
      ),
      getJson<ApiReportConfigurationDto>(
        '/api/configuracion/informe',
        this.config
      )
    ])

    console.log({
      action: 'RestConfigurationSource.getConfiguration.response',
      response: {
        intimacion,
        informe
      }
    })

    return {
      intimacion,
      informe
    }
  }
}
