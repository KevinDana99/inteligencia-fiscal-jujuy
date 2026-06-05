export function parseCrossPreviewFilterNumber(value: string) {
  const sanitized = value.trim().replace(/[^\d,.-]/g, '')

  if (!sanitized) {
    return null
  }

  const normalized = sanitized.includes(',')
    ? sanitized.replace(/\./g, '').replace(',', '.')
    : sanitized.replace(/\.(?=\d{3}(\D|$))/g, '')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : null
}
