import type { ToastMessagesBySeverity } from '../types'
import * as toastList from './ToastMessagesList'

export const TOAST_ADMIN_PANEL_AUTH: ToastMessagesBySeverity = {
  success: {
    welcome: toastList.ADMIN_PANEL_WELCOME_SUCCESS
  }
}

export const TOAST_ADMIN_PANEL_USERS: ToastMessagesBySeverity = {
  success: {
    create_user: toastList.CREATE_USER_SUCCESS,
    update_user: toastList.UPDATE_USER_SUCCESS,
    update_password: toastList.UPDATE_PASSWORD_SUCCESS
  },
  error: {
    delete_user: toastList.DELETE_USER_DANGER
  }
}

export const TOAST_ADMIN_PANEL_ALLOWED_DOMAINS: ToastMessagesBySeverity = {
  success: {
    add_domain: toastList.ADD_DOMAIN_SUCCESS
  },
  error: {
    duplicate_domain: toastList.DUPLICATE_DOMAIN_DANGER,
    email_not_allowed: toastList.EMAIL_NOT_ALLOWED_DANGER
  },
  info: {
    delete_domain: toastList.DELETE_DOMAIN_INFO
  }
}

export const TOAST_ADMIN_PANEL = {
  auth: TOAST_ADMIN_PANEL_AUTH,
  users: TOAST_ADMIN_PANEL_USERS,
  allowed_domains: TOAST_ADMIN_PANEL_ALLOWED_DOMAINS
}
