import { z } from 'zod'
import type { ReportType } from '../../data/models/Configuration'

const configurationReportSchema = z.object({
  titulo: z.string().trim().min(1, 'El título es obligatorio.'),
  cuerpo: z.string().trim().min(1, 'El cuerpo es obligatorio.')
})

export type ConfigurationReportValidationErrors = Partial<
  Record<keyof ReportType, string>
>

export function validateConfigurationReport(
  report: ReportType
): {
  success: boolean
  errors: ConfigurationReportValidationErrors
} {
  const result = configurationReportSchema.safeParse(report)

  if (result.success) {
    return {
      success: true,
      errors: {}
    }
  }

  const fieldErrors = result.error.flatten().fieldErrors

  return {
    success: false,
    errors: {
      titulo: fieldErrors.titulo?.[0],
      cuerpo: fieldErrors.cuerpo?.[0]
    }
  }
}
