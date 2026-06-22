import type { ICrossPreviewAnalysisRow } from '../../data/models/CrossManagement'

const CROSS_PREVIEW_ANALYSIS_RANKING_KEY = 'netoAPagar'

function normalizeNumericSeparators(value: string) {
  const lastCommaIndex = value.lastIndexOf(',')
  const lastDotIndex = value.lastIndexOf('.')

  if (lastCommaIndex >= 0 && lastDotIndex >= 0) {
    const decimalSeparator = lastCommaIndex > lastDotIndex ? ',' : '.'
    const thousandsSeparator = decimalSeparator === ',' ? '.' : ','

    return value
      .replaceAll(thousandsSeparator, '')
      .replace(decimalSeparator, '.')
  }

  const separator = lastCommaIndex >= 0 ? ',' : lastDotIndex >= 0 ? '.' : null

  if (!separator) {
    return value
  }

  const parts = value.split(separator)
  const decimalPart = parts.at(-1) ?? ''

  if (parts.length > 2 || decimalPart.length === 3) {
    return parts.join('')
  }

  return value.replace(separator, '.')
}

function parseRankingValue(value: string | undefined) {
  const sanitizedValue = value?.replace(/[^\d,.-]/g, '') ?? ''
  const sign = sanitizedValue.includes('-') ? '-' : ''
  const unsignedValue = sanitizedValue.replaceAll('-', '')

  if (!/\d/.test(unsignedValue)) {
    return null
  }

  const parsedValue = Number(
    `${sign}${normalizeNumericSeparators(unsignedValue)}`
  )

  return Number.isFinite(parsedValue) ? parsedValue : null
}

export function sortCrossPreviewAnalysisRowsByRankingValue(
  rows: ICrossPreviewAnalysisRow[]
) {
  return rows
    .map((row, index) => ({
      index,
      row,
      rankingValue: parseRankingValue(row.values[CROSS_PREVIEW_ANALYSIS_RANKING_KEY])
    }))
    .sort((current, next) => {
      if (current.rankingValue === null && next.rankingValue === null) {
        return current.index - next.index
      }

      if (current.rankingValue === null) {
        return 1
      }

      if (next.rankingValue === null) {
        return -1
      }

      return current.rankingValue - next.rankingValue || current.index - next.index
    })
    .map(({ row }) => row)
}
