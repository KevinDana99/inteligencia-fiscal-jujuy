export function formatBatchDateLabel(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = String(parsedDate.getFullYear())

  return `${day}/${month}/${year}`
}

export function getBatchContributorTypeLabel(regime: string) {
  if (regime === 'Convenio Multilateral') {
    return 'CM'
  }

  return regime.replace(/^Regimen\s+/i, '')
}

export function formatBatchCuit(value: string) {
  const normalizedValue = value.replace(/\D/g, '')

  if (normalizedValue.length !== 11) {
    return value
  }

  return `${normalizedValue.slice(0, 2)}-${normalizedValue.slice(2, 10)}-${normalizedValue.slice(10)}`
}
