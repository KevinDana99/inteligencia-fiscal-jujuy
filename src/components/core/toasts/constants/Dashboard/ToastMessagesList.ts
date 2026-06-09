import type { ToastMessageType } from '../types'

export const DASHBOARD_WELCOME_SUCCESS: ToastMessageType = {
  id: 'T-01',
  status: 'Success',
  title: 'Bienvenida, {nombre}',
  description: 'Tu validación fue verificada exitosamente.'
}

export const SEND_REPROCESSING_ERROR: ToastMessageType = {
  id: 'T-02',
  status: 'Error',
  title: 'CUIT marcado en reproceso',
  description: 'El contribuyente fue enviado a reproceso.'
}

export const ADD_TO_BATCH_SUCCESS: ToastMessageType = {
  id: 'T-03',
  status: 'Success',
  title: 'Agregado al lote',
  description: 'El CUIT fue marcado para el lote {nombre}.'
}

export const LOADING_PROFILE_INFO: ToastMessageType = {
  id: 'T-04',
  status: 'Info',
  title: 'Cargando perfil...',
  description: 'Estamos abriendo el perfil del contribuyente.'
}

export const SEARCHING_TAXPAYER_INFO: ToastMessageType = {
  id: 'T-05',
  status: 'Info',
  title: 'Buscando...',
  description: 'Estamos buscando el contribuyente ingresado.'
}

export const MARK_RELEVANT_SUCCESS: ToastMessageType = {
  id: 'T-06',
  status: 'Success',
  title: 'Marcado como relevante',
  description: 'El contribuyente fue destacado correctamente.'
}

export const FORWARD_REPROCESSING_ERROR: ToastMessageType = {
  id: 'T-07',
  status: 'Error',
  title: 'Enviado a reproceso',
  description: 'El contribuyente fue enviado a reproceso.'
}

export const REMOVE_REPROCESSING_SUCCESS: ToastMessageType = {
  id: 'T-08',
  status: 'Success',
  title: 'CUIT quitado de reproceso',
  description: 'El contribuyente fue removido del reproceso.'
}

export const GENERATING_CROSSES_INFO: ToastMessageType = {
  id: 'T-09',
  status: 'Info',
  title: 'Generando cruces...',
  description: 'Los cruces seleccionados están siendo procesados.'
}

export const ADD_ADDRESS_SUCCESS: ToastMessageType = {
  id: 'T-10',
  status: 'Success',
  title: 'Domicilio agregado',
  description: 'El nuevo domicilio fue guardado correctamente.'
}

export const UPDATE_ADDRESS_SUCCESS: ToastMessageType = {
  id: 'T-11',
  status: 'Success',
  title: 'Domicilio actualizado',
  description: 'Los cambios fueron guardados correctamente.'
}

export const DELETE_ADDRESS_ERROR: ToastMessageType = {
  id: 'T-12',
  status: 'Error',
  title: 'Domicilio eliminado',
  description: 'El registro fue removido.'
}

export const ADD_CONTACT_SUCCESS: ToastMessageType = {
  id: 'T-13',
  status: 'Success',
  title: 'Contacto agregado',
  description: 'El contacto fue guardado correctamente.'
}

export const UPDATE_CONTACT_SUCCESS: ToastMessageType = {
  id: 'T-14',
  status: 'Success',
  title: 'Contacto actualizado',
  description: 'Los cambios fueron guardados correctamente.'
}

export const DELETE_CONTACT_ERROR: ToastMessageType = {
  id: 'T-15',
  status: 'Error',
  title: 'Contacto eliminado',
  description: 'El registro fue removido.'
}

export const ADD_NOTE_SUCCESS: ToastMessageType = {
  id: 'T-16',
  status: 'Success',
  title: 'Nota agregada',
  description: 'La nota fue guardada correctamente.'
}

export const UPDATE_NOTE_SUCCESS: ToastMessageType = {
  id: 'T-17',
  status: 'Success',
  title: 'Nota actualizada',
  description: 'Los cambios fueron guardados correctamente.'
}

export const DELETE_NOTE_ERROR: ToastMessageType = {
  id: 'T-18',
  status: 'Error',
  title: 'Nota eliminada',
  description: 'El registro fue removido.'
}

export const UPDATE_CONFIGURATION_SUCCESS: ToastMessageType = {
  id: 'T-00',
  status: 'Success',
  title: 'Configuración actualizada',
  description: 'Se guardaron los cambios correctamente.'
}
