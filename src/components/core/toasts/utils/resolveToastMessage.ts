import type { ToastMessageType } from '../constants'
import type { ToastVariables } from './resolveToastText'
import { resolveToastText } from './resolveToastText'

export function resolveToastMessage(
  message: ToastMessageType,
  variables?: ToastVariables
): ToastMessageType {
  return {
    ...message,
    title: resolveToastText(message.title, variables),
    description: resolveToastText(message.description, variables)
  }
}
