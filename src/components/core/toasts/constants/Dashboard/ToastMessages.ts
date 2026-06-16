import type { ToastMessageType } from "../types";

const DASHBOARD_WELCOME_SUCCESS: ToastMessageType = {
  id: "T-01",
  status: "Success",
  title: "¡Hola {user}!",
  description: "Iniciaste sesión exitosamente.",
};

const SEND_REPROCESSING_ERROR: ToastMessageType = {
  id: "T-02",
  status: "Danger",
  title: "CUIT marcado en reproceso",
  description: "El contribuyente fue enviado a reproceso.",
};

const ADD_TO_BATCH_SUCCESS: ToastMessageType = {
  id: "T-03",
  status: "Success",
  title: "Agregado al lote",
  description: "El CUIT fue marcado para el lote {name}.",
};

const LOADING_PROFILE_INFO: ToastMessageType = {
  id: "T-04",
  status: "Info",
  title: "Cargando perfil...",
  description: "Estamos abriendo el perfil del contribuyente.",
};

const SEARCHING_TAXPAYER_INFO: ToastMessageType = {
  id: "T-05",
  status: "Info",
  title: "Buscando...",
  description: "Estamos buscando el contribuyente ingresado.",
};

const MARK_RELEVANT_SUCCESS: ToastMessageType = {
  id: "T-06",
  status: "Success",
  title: "Marcado como relevante",
  description: "El contribuyente fue destacado correctamente.",
};

const FORWARD_REPROCESSING_ERROR: ToastMessageType = {
  id: "T-07",
  status: "Danger",
  title: "Enviado a reproceso",
  description: "El contribuyente fue enviado a reproceso.",
};

const REMOVE_REPROCESSING_SUCCESS: ToastMessageType = {
  id: "T-08",
  status: "Success",
  title: "CUIT quitado de reproceso",
  description: "El contribuyente fue removido del reproceso.",
};

const GENERATING_CROSSES_INFO: ToastMessageType = {
  id: "T-09",
  status: "Info",
  title: "Generando cruces...",
  description: "Los cruces seleccionados están siendo procesados.",
};

const ADD_ADDRESS_SUCCESS: ToastMessageType = {
  id: "T-10",
  status: "Success",
  title: "Domicilio agregado",
  description: "El nuevo domicilio fue guardado correctamente.",
};

const UPDATE_ADDRESS_SUCCESS: ToastMessageType = {
  id: "T-11",
  status: "Success",
  title: "Domicilio actualizado",
  description: "Los cambios fueron guardados correctamente.",
};

const DELETE_ADDRESS_ERROR: ToastMessageType = {
  id: "T-12",
  status: "Danger",
  title: "Domicilio eliminado",
  description: "El registro fue removido.",
};

const ADD_CONTACT_SUCCESS: ToastMessageType = {
  id: "T-13",
  status: "Success",
  title: "Contacto agregado",
  description: "El contacto fue guardado correctamente.",
};

const UPDATE_CONTACT_SUCCESS: ToastMessageType = {
  id: "T-14",
  status: "Success",
  title: "Contacto actualizado",
  description: "Los cambios fueron guardados correctamente.",
};

const DELETE_CONTACT_ERROR: ToastMessageType = {
  id: "T-15",
  status: "Danger",
  title: "Contacto eliminado",
  description: "El registro fue removido.",
};

const ADD_NOTE_SUCCESS: ToastMessageType = {
  id: "T-16",
  status: "Success",
  title: "Nota agregada",
  description: "La nota fue guardada correctamente.",
};

const UPDATE_NOTE_SUCCESS: ToastMessageType = {
  id: "T-17",
  status: "Success",
  title: "Nota actualizada",
  description: "Los cambios fueron guardados correctamente.",
};

const DELETE_NOTE_ERROR: ToastMessageType = {
  id: "T-18",
  status: "Danger",
  title: "Nota eliminada",
  description: "El registro fue removido.",
};

const ADD_INTIMATION_SUCCESS: ToastMessageType = {
  id: "T-19",
  status: "Success",
  title: "Intimación generada",
  description: "La intimación fue generada correctamente.",
};

const UPDATE_CONFIGURATION_SUCCESS: ToastMessageType = {
  id: "T-00",
  status: "Success",
  title: "Configuración actualizada",
  description: "Se guardaron los cambios correctamente.",
};

export const TOAST_DASHBOARD_MESSAGES = {
  DASHBOARD_WELCOME_SUCCESS,
  SEND_REPROCESSING_ERROR,
  ADD_TO_BATCH_SUCCESS,
  LOADING_PROFILE_INFO,
  SEARCHING_TAXPAYER_INFO,
  MARK_RELEVANT_SUCCESS,
  FORWARD_REPROCESSING_ERROR,
  REMOVE_REPROCESSING_SUCCESS,
  GENERATING_CROSSES_INFO,
  ADD_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_ERROR,
  ADD_CONTACT_SUCCESS,
  UPDATE_CONTACT_SUCCESS,
  DELETE_CONTACT_ERROR,
  ADD_NOTE_SUCCESS,
  UPDATE_NOTE_SUCCESS,
  DELETE_NOTE_ERROR,
  UPDATE_CONFIGURATION_SUCCESS,
  ADD_INTIMATION_SUCCESS,
};
