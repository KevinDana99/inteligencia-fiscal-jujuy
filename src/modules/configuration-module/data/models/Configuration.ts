export type IntimationType = {
  id?: string | null
  asunto: string
  saludo: string
  cuerpo: string
  pie: string
  fuente_informacion?: string | null
  columnas_seleccionadas: string[]
}

export type ReportType = {
  titulo: string
  cuerpo: string
}

export type ConfigurationType = {
  intimacion: IntimationType
  informe: ReportType
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
}
