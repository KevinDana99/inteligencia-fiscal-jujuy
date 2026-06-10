import { getJson, type ApiClientConfig } from '@/lib/api-client'
import { CONFIGURATION_ENDPOINTS } from '../../constants/configurationEndpoints'
import { DEFAULT_REPORT_CONFIGURATION } from '../../constants/configurationFallbacks'
import type { IConfigurationSource } from '../../interfaces/ConfigurationSource'
import type { ConfigurationType } from '../../models/Configuration'
import type { ApiIntimationConfigurationDto } from './dtos/ApiConfigurationDtos'

function mapIntimationConfigurationDto(
  dto: ApiIntimationConfigurationDto
): ConfigurationType['intimacion'] {
  return {
    asunto: dto.asunto ?? '',
    saludo: dto.saludo ?? '',
    cuerpo: dto.cuerpo ?? '',
    pie: dto.fechaCorte ?? dto.pie ?? '',
    fuente_informacion: dto.fuenteInformacion ?? dto.fuente_informacion ?? null,
    columnas_seleccionadas: dto.columnas_seleccionadas ?? []
  }
}

export class RestConfigurationSource implements IConfigurationSource {
  constructor(private readonly config: ApiClientConfig) {}

  async getConfiguration(): Promise<ConfigurationType> {
    const intimacion = await getJson<ApiIntimationConfigurationDto>(
      CONFIGURATION_ENDPOINTS.intimation,
      this.config
    )

    return {
      intimacion: mapIntimationConfigurationDto(intimacion),
      informe: DEFAULT_REPORT_CONFIGURATION
    }
  }
}
