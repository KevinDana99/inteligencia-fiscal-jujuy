export type ToastStatus = 'Success' | 'Danger' | 'Info'

export type ToastMessageType = {
  id: string
  status: ToastStatus
  title: string
  description: string
}

export type ToastMessagesBySeverity = {
  success?: ToastMessageType
  danger?: ToastMessageType
  info?: ToastMessageType
}
