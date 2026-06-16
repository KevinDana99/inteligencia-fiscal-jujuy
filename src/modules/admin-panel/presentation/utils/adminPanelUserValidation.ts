import { z } from 'zod'
import { ADMIN_PANEL_USER_VALIDATION_MESSAGES } from '../constants/adminPanelUserForm'

const NAME_PATTERN = /^[\p{L}\s]+$/u

export const adminPanelUserIdentitySchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, ADMIN_PANEL_USER_VALIDATION_MESSAGES.firstNameRequired)
    .regex(NAME_PATTERN, ADMIN_PANEL_USER_VALIDATION_MESSAGES.firstNameInvalid),
  apellido: z
    .string()
    .trim()
    .min(1, ADMIN_PANEL_USER_VALIDATION_MESSAGES.lastNameRequired)
    .regex(
      NAME_PATTERN,
      ADMIN_PANEL_USER_VALIDATION_MESSAGES.lastNameInvalid
    )
})
