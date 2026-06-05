import { normalizeCrossPreviewSearch } from './normalizeCrossPreviewSearch'

interface MatchesCrossPreviewSearchParams {
  businessName: string
  cuit: string
  search: string
}

export function matchesCrossPreviewSearch({
  businessName,
  cuit,
  search
}: MatchesCrossPreviewSearchParams) {
  const normalizedSearch = normalizeCrossPreviewSearch(search)

  if (!normalizedSearch) {
    return true
  }

  return (
    cuit.toLowerCase().includes(normalizedSearch) ||
    businessName.toLowerCase().includes(normalizedSearch)
  )
}
