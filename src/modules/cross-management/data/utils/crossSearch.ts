export function normalizeCrossSearchText(value: string | null | undefined) {
  return (value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function normalizeCrossSearchDigits(value: string | null | undefined) {
  return (value ?? '').replace(/\D/g, '')
}

export function normalizeCrossSearchRequest(value: string | null | undefined) {
  const trimmed = value?.trim() ?? ''

  if (!trimmed) {
    return ''
  }

  const digits = normalizeCrossSearchDigits(trimmed)
  const isNumericSearch = digits.length > 0 && /^[\d\s.-]+$/.test(trimmed)

  return isNumericSearch ? digits : trimmed
}

export function matchesCrossSearch(
  values: Array<string | null | undefined>,
  search: string | null | undefined
) {
  const normalizedSearch = normalizeCrossSearchText(search)

  if (!normalizedSearch) {
    return true
  }

  const searchDigits = normalizeCrossSearchDigits(search)

  return values.some((value) => {
    const normalizedValue = normalizeCrossSearchText(value)

    if (normalizedValue.includes(normalizedSearch)) {
      return true
    }

    return (
      searchDigits.length > 0 &&
      normalizeCrossSearchDigits(value).includes(searchDigits)
    )
  })
}
