export type ToastStatus = 'Success' | 'Danger' | 'Error' | 'Info'

export type ToastMessageType = {
  id: string
  status: ToastStatus
  title: string
  description: string
}

export type ToastMessagesBySeverity = {
  success?: Record<string, ToastMessageType>
  error?: Record<string, ToastMessageType>
  info?: Record<string, ToastMessageType>
}
