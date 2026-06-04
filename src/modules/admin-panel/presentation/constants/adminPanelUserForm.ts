export const ADMIN_PANEL_CREATE_USER_PASSWORD_CONFIG = {
  name: 'contrasena',
  label: 'Contraseña',
  required: true,
  confirmName: 'confirmarContrasena',
  confirmLabel: 'Confirmar contraseña',
  confirmRequired: true
} as const

export const ADMIN_PANEL_EDIT_USER_PASSWORD_CONFIG = {
  name: 'nuevaContrasena',
  label: 'Nueva contraseña',
  required: false,
  confirmName: 'confirmarContrasena',
  confirmLabel: 'Confirmar contraseña',
  confirmRequired: false
} as const
