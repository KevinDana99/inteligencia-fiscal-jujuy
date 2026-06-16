export const CONFIGURATION_ENDPOINTS = {
  intimation: '/api/configuracion/intimacion',
  intimationById: (plantillaId: string) =>
    `/api/configuracion/intimacion/${plantillaId}`,
  report: '/api/configuracion/informe',
  reportById: (plantillaId: string) => `/api/configuracion/informe/${plantillaId}`
} as const
