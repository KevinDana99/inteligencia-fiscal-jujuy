export function normalizeCrossFilterNumberValue(
  value: string | number | null | undefined
) {
  const rawValue = String(value ?? '').trim()

  if (!rawValue) {
    return ''
  }

  const sign = rawValue.startsWith('-') ? '-' : ''
  const unsignedValue = sign ? rawValue.slice(1) : rawValue
  const lastCommaIndex = unsignedValue.lastIndexOf(',')
  const lastDotIndex = unsignedValue.lastIndexOf('.')
  const decimalSeparatorIndex = Math.max(lastCommaIndex, lastDotIndex)

  if (lastCommaIndex >= 0 && lastDotIndex >= 0) {
    return buildNormalizedNumber(sign, unsignedValue, decimalSeparatorIndex)
  }

  if (lastCommaIndex >= 0) {
    return buildNormalizedNumber(sign, unsignedValue, lastCommaIndex)
  }

  if (lastDotIndex >= 0) {
    const dotCount = (unsignedValue.match(/\./g) ?? []).length
    const fractionDigitsCount = unsignedValue.slice(lastDotIndex + 1).length
    const shouldTreatDotsAsThousands =
      dotCount > 1 || (fractionDigitsCount === 3 && unsignedValue.length > 4)

    if (shouldTreatDotsAsThousands) {
      return `${sign}${unsignedValue.replace(/\D/g, '')}`
    }

    return buildNormalizedNumber(sign, unsignedValue, lastDotIndex)
  }

  return `${sign}${unsignedValue.replace(/\D/g, '')}`
}

function buildNormalizedNumber(
  sign: string,
  unsignedValue: string,
  decimalSeparatorIndex: number
) {
  const integerPart = unsignedValue.slice(0, decimalSeparatorIndex).replace(/\D/g, '')
  const decimalPart = unsignedValue.slice(decimalSeparatorIndex + 1).replace(/\D/g, '')

  return `${sign}${integerPart}${decimalPart ? `.${decimalPart}` : ''}`
}
