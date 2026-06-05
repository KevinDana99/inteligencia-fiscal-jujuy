export type ApiIntimationConfigurationDto = {
  asunto: string
  saludo: string
  cuerpo: string
  pie: string
  fuente_informacion?: string | null
  columnas_seleccionadas: string[]
}

export type ApiReportConfigurationDto = {
  titulo: string
  cuerpo: string
}
