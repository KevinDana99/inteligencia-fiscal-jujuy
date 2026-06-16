import { z } from 'zod'
import type { IntimationTemplateState } from '../hooks/intimation-template/useIntimationTemplate'

const baseIntimationTemplateSchema = z.object({
  asunto: z.string().trim().min(1, 'El asunto es obligatorio.'),
  saludo: z.string().trim().min(1, 'El saludo es obligatorio.'),
  cuerpo: z.string().trim().min(1, 'El cuerpo es obligatorio.'),
  fechaCorte: z.string().trim().min(1, 'La fecha de corte es obligatoria.')
})

const intimationTemplateColumnsSchema = z
  .array(
    z.object({
      id: z.string(),
      value: z.string()
    })
  )
  .min(1, 'Tenés que seleccionar al menos una columna.')

export type IntimationTemplateValidationErrors = Partial<
  Record<'asunto' | 'saludo' | 'cuerpo' | 'fechaCorte' | 'columnas', string>
>

export function validateIntimationTemplateState(
  state: IntimationTemplateState,
  { allowedColumns = true }: { allowedColumns?: boolean } = {}
): {
  success: boolean
  errors: IntimationTemplateValidationErrors
} {
  const result = baseIntimationTemplateSchema.safeParse(state)

  const columnsResult = allowedColumns
    ? intimationTemplateColumnsSchema.safeParse(state.columnas)
    : { success: true as const }

  if (result.success && columnsResult.success) {
    return {
      success: true,
      errors: {}
    }
  }

  const fieldErrors = result.success ? {} : result.error.flatten().fieldErrors

  return {
    success: false,
    errors: {
      asunto: 'asunto' in fieldErrors ? fieldErrors.asunto?.[0] : undefined,
      saludo: 'saludo' in fieldErrors ? fieldErrors.saludo?.[0] : undefined,
      cuerpo: 'cuerpo' in fieldErrors ? fieldErrors.cuerpo?.[0] : undefined,
      fechaCorte:
        'fechaCorte' in fieldErrors ? fieldErrors.fechaCorte?.[0] : undefined,
      columnas:
        allowedColumns && !columnsResult.success
          ? columnsResult.error.flatten().formErrors[0]
          : undefined
    }
  }
}
