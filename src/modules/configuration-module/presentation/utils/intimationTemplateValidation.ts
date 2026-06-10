import { z } from 'zod'
import type { IntimationTemplateState } from '../hooks/intimation-template/useIntimationTemplate'

const intimationTemplateSchema = z.object({
  asunto: z.string().trim().min(1, 'El asunto es obligatorio.'),
  saludo: z.string().trim().min(1, 'El saludo es obligatorio.'),
  cuerpo: z.string().trim().min(1, 'El cuerpo es obligatorio.'),
  fechaCorte: z.string().trim().min(1, 'La fecha de corte es obligatoria.'),
  columnas: z
    .array(
      z.object({
        id: z.string(),
        value: z.string()
      })
    )
    .min(1, 'Tenés que seleccionar al menos una columna.')
})

export type IntimationTemplateValidationErrors = Partial<
  Record<'asunto' | 'saludo' | 'cuerpo' | 'fechaCorte' | 'columnas', string>
>

export function validateIntimationTemplateState(
  state: IntimationTemplateState
): {
  success: boolean
  errors: IntimationTemplateValidationErrors
} {
  const result = intimationTemplateSchema.safeParse(state)

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
      asunto: fieldErrors.asunto?.[0],
      saludo: fieldErrors.saludo?.[0],
      cuerpo: fieldErrors.cuerpo?.[0],
      fechaCorte: fieldErrors.fechaCorte?.[0],
      columnas: fieldErrors.columnas?.[0]
    }
  }
}
