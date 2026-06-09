import type { ToastMessagesBySeverity } from '../types'
import * as toastList from './ToastMessagesList'

export const TOAST_AUTH: ToastMessagesBySeverity = {
  success: {
    welcome: toastList.DASHBOARD_WELCOME_SUCCESS
  }
}

export const TOAST_REPROCESSING: ToastMessagesBySeverity = {
  success: {
    remove_reprocessing: toastList.REMOVE_REPROCESSING_SUCCESS
  },
  error: {
    send_reprocessing: toastList.SEND_REPROCESSING_ERROR,
    forward_reprocessing: toastList.FORWARD_REPROCESSING_ERROR
  }
}

export const TOAST_BATCH_MANAGEMENT: ToastMessagesBySeverity = {
  success: {
    add_to_batch: toastList.ADD_TO_BATCH_SUCCESS
  }
}

export const TOAST_NAVIGATION: ToastMessagesBySeverity = {
  info: {
    loading_profile: toastList.LOADING_PROFILE_INFO,
    searching_taxpayer: toastList.SEARCHING_TAXPAYER_INFO
  }
}

export const TOAST_CROSS_MANAGEMENT: ToastMessagesBySeverity = {
  success: {
    mark_relevant: toastList.MARK_RELEVANT_SUCCESS
  },
  info: {
    generating_crosses: toastList.GENERATING_CROSSES_INFO
  }
}

export const TOAST_ADDRESSES: ToastMessagesBySeverity = {
  success: {
    add_address: toastList.ADD_ADDRESS_SUCCESS,
    update_address: toastList.UPDATE_ADDRESS_SUCCESS
  },
  error: {
    delete_address: toastList.DELETE_ADDRESS_ERROR
  }
}

export const TOAST_CONTACTS: ToastMessagesBySeverity = {
  success: {
    add_contact: toastList.ADD_CONTACT_SUCCESS,
    update_contact: toastList.UPDATE_CONTACT_SUCCESS
  },
  error: {
    delete_contact: toastList.DELETE_CONTACT_ERROR
  }
}

export const TOAST_NOTES: ToastMessagesBySeverity = {
  success: {
    add_note: toastList.ADD_NOTE_SUCCESS,
    update_note: toastList.UPDATE_NOTE_SUCCESS
  },
  error: {
    delete_note: toastList.DELETE_NOTE_ERROR
  }
}

export const TOAST_DASHBOARD_CONFIGURATION: ToastMessagesBySeverity = {
  success: {
    update_configuration: toastList.UPDATE_CONFIGURATION_SUCCESS
  }
}

export const TOAST_DASHBOARD = {
  auth: TOAST_AUTH,
  reprocessing: TOAST_REPROCESSING,
  batch_management: TOAST_BATCH_MANAGEMENT,
  configuration: TOAST_DASHBOARD_CONFIGURATION,
  navigation: TOAST_NAVIGATION,
  cross_management: TOAST_CROSS_MANAGEMENT,
  addresses: TOAST_ADDRESSES,
  contacts: TOAST_CONTACTS,
  notes: TOAST_NOTES
}
