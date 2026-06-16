import {
  getJson,
  putJson,
  type ApiClientConfig
} from '@/lib/api-client'
import { CONFIGURATION_ENDPOINTS } from '../../constants/configurationEndpoints'
import type { IConfigurationSource } from '../../interfaces/ConfigurationSource'
import type { ConfigurationType } from '../../models/Configuration'
import type {
  ApiIntimationConfigurationDto,
  ApiReportConfigurationDto
} from './dtos/ApiConfigurationDtos'

function mapIntimationConfigurationDto(
  dto: ApiIntimationConfigurationDto
): ConfigurationType['intimacion'] {
  return {
    id: dto.id ?? null,
    asunto: dto.asunto ?? '',
    saludo: dto.saludo ?? '',
    cuerpo: dto.cuerpo ?? '',
    pie: dto.fechaCorte ?? dto.pie ?? '',
    fuente_informacion: dto.fuenteInformacion ?? dto.fuente_informacion ?? null,
    columnas_seleccionadas:
      dto.columnasSeleccionadas ?? dto.columnas_seleccionadas ?? []
  }
}

function mapReportConfigurationDto(
  dto: ApiReportConfigurationDto
): ConfigurationType['informe'] {
  return {
    id: dto.id ?? null,
    titulo: dto.titulo ?? '',
    cuerpo: dto.cuerpo ?? ''
  }
}

export class RestConfigurationSource implements IConfigurationSource {
  constructor(private readonly config: ApiClientConfig) {}

  async getConfiguration(): Promise<ConfigurationType> {
    const intimacion = await getJson<ApiIntimationConfigurationDto>(
      CONFIGURATION_ENDPOINTS.intimation,
      this.config
    )
    const informe = await getJson<ApiReportConfigurationDto>(
      CONFIGURATION_ENDPOINTS.report,
      this.config
    )

    return {
      intimacion: mapIntimationConfigurationDto(intimacion),
      informe: mapReportConfigurationDto(informe)
    }
  }

  async updateIntimationConfiguration(
    plantillaId: string,
    configuration: ConfigurationType['intimacion'],
    { allowedColumns = true }: { allowedColumns?: boolean } = {}
  ): Promise<void> {
    await putJson<void, Omit<ApiIntimationConfigurationDto, 'id' | 'tipoDocumento'>>(
      CONFIGURATION_ENDPOINTS.intimationById(plantillaId),
      {
        asunto: configuration.asunto,
        saludo: configuration.saludo,
        cuerpo: configuration.cuerpo,
        fuenteInformacion: configuration.fuente_informacion ?? null,
        fechaCorte: configuration.pie,
        ...(allowedColumns
          ? {
              columnas_seleccionadas: configuration.columnas_seleccionadas
            }
          : {})
      },
      this.config
    )
  }

  async updateReportConfiguration(
    plantillaId: string,
    configuration: ConfigurationType['informe']
  ): Promise<void> {
    await putJson<void, Omit<ApiReportConfigurationDto, 'id' | 'tipoDocumento'>>(
      CONFIGURATION_ENDPOINTS.reportById(plantillaId),
      {
        titulo: configuration.titulo,
        cuerpo: configuration.cuerpo
      },
      this.config
    )
  }
}
