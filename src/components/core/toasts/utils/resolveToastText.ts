export type ToastVariables = Record<string, string | number>

export function resolveToastText(
  text: string,
  variables?: ToastVariables
): string {
  if (!variables) {
    return text
  }

  return Object.entries(variables).reduce((result, [key, value]) => {
    return result.replaceAll(`{${key}}`, String(value))
  }, text)
}
