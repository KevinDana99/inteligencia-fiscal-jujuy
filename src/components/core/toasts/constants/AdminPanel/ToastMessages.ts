import type { ToastMessageType } from '../types'

const ADMIN_PANEL_WELCOME_SUCCESS: ToastMessageType = {
  id: 'T-19',
  status: 'Success',
  title: 'Bienvenido',
  description: 'Tu validación fue verificada exitosamente.'
}

const CREATE_USER_SUCCESS: ToastMessageType = {
  id: 'T-20',
  status: 'Success',
  title: 'Usuario creado',
  description: '{name} {surname} fue agregado al sistema.'
}

const UPDATE_USER_SUCCESS: ToastMessageType = {
  id: 'T-21',
  status: 'Success',
  title: 'Usuario actualizado',
  description: '{name} {surname} fue modificado correctamente.'
}

const UPDATE_PASSWORD_SUCCESS: ToastMessageType = {
  id: 'T-22',
  status: 'Success',
  title: 'Contraseña actualizada',
  description: 'La contraseña fue cambiada correctamente.'
}

const ADD_DOMAIN_SUCCESS: ToastMessageType = {
  id: 'T-23',
  status: 'Success',
  title: 'Dominio agregado',
  description: '"{domain}" fue agregado a los dominios permitidos.'
}

const DELETE_USER_DANGER: ToastMessageType = {
  id: 'T-24',
  status: 'Danger',
  title: 'Usuario eliminado',
  description: '{name} {surname} fue eliminado del sistema.'
}

const DUPLICATE_DOMAIN_DANGER: ToastMessageType = {
  id: 'T-25',
  status: 'Danger',
  title: 'Dominio duplicado',
  description: 'Este dominio ya está en la lista.'
}

const EMAIL_NOT_ALLOWED_DANGER: ToastMessageType = {
  id: 'T-26',
  status: 'Danger',
  title: 'Email no permitido',
  description:
    'Solo se aceptan emails con los dominios institucionales configurados.'
}

const DELETE_DOMAIN_INFO: ToastMessageType = {
  id: 'T-27',
  status: 'Info',
  title: 'Dominio eliminado',
  description: '"{domain}" fue removido de los dominios permitidos.'
}

const TOAST_ADMIN_MESSAGES = {
  ADMIN_PANEL_WELCOME_SUCCESS,
  CREATE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPDATE_PASSWORD_SUCCESS,
  ADD_DOMAIN_SUCCESS,
  DELETE_USER_DANGER,
  DUPLICATE_DOMAIN_DANGER,
  EMAIL_NOT_ALLOWED_DANGER,
  DELETE_DOMAIN_INFO
}
export default TOAST_ADMIN_MESSAGES
