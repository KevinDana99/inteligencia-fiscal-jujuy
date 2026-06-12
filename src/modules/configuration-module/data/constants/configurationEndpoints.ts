export const CONFIGURATION_ENDPOINTS = {
  intimation: '/api/configuracion/intimacion',
  intimationById: (plantillaId: string) =>
    `/api/configuracion/intimacion/${plantillaId}`
} as const
