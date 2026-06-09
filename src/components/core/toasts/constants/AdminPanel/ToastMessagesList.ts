import type { ToastMessageType } from '../types'

export const ADMIN_PANEL_WELCOME_SUCCESS: ToastMessageType = {
  id: 'T-19',
  status: 'Success',
  title: 'Bienvenido',
  description: 'Tu validación fue verificada exitosamente.'
}

export const CREATE_USER_SUCCESS: ToastMessageType = {
  id: 'T-20',
  status: 'Success',
  title: 'Usuario creado',
  description: '[Nombre Apellido] fue agregado al sistema.'
}

export const UPDATE_USER_SUCCESS: ToastMessageType = {
  id: 'T-21',
  status: 'Success',
  title: 'Usuario actualizado',
  description: '[Nombre Apellido] fue modificado correctamente.'
}

export const UPDATE_PASSWORD_SUCCESS: ToastMessageType = {
  id: 'T-22',
  status: 'Success',
  title: 'Contraseña actualizada',
  description: 'La contraseña fue cambiada correctamente.'
}

export const ADD_DOMAIN_SUCCESS: ToastMessageType = {
  id: 'T-23',
  status: 'Success',
  title: 'Dominio agregado',
  description: '"[dominio]" fue agregado a los dominios permitidos.'
}

export const DELETE_USER_DANGER: ToastMessageType = {
  id: 'T-24',
  status: 'Danger',
  title: 'Usuario eliminado',
  description: '[Nombre Apellido] fue eliminado del sistema.'
}

export const DUPLICATE_DOMAIN_DANGER: ToastMessageType = {
  id: 'T-25',
  status: 'Danger',
  title: 'Dominio duplicado',
  description: 'Este dominio ya está en la lista.'
}

export const EMAIL_NOT_ALLOWED_DANGER: ToastMessageType = {
  id: 'T-26',
  status: 'Danger',
  title: 'Email no permitido',
  description:
    'Solo se aceptan emails con los dominios institucionales configurados.'
}

export const DELETE_DOMAIN_INFO: ToastMessageType = {
  id: 'T-27',
  status: 'Info',
  title: 'Dominio eliminado',
  description: '"[dominio]" fue removido de los dominios permitidos.'
}
