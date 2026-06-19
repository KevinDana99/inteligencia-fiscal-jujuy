export type ApiIntimationConfigurationDto = {
  id?: string | null
  tipoDocumento?: string | null
  asunto?: string | null
  saludo?: string | null
  cuerpo?: string | null
  pie?: string | null
  fechaCorte?: string | null
  fuenteInformacion?: string | null
  fuente_informacion?: string | null
  columnasSeleccionadas?: string[] | null
  columnas_seleccionadas?: string[] | null
}

export type ApiReportConfigurationDto = {
  id?: string | null
  tipoDocumento?: string | null
  titulo?: string | null
  cuerpo?: string | null
}
