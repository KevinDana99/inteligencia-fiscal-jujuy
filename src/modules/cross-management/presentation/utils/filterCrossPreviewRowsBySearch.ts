import { matchesCrossPreviewSearch } from './matchesCrossPreviewSearch'

interface CrossPreviewSearchableRow {
  businessName: string
  cuit: string
}

interface FilterCrossPreviewRowsBySearchParams<TRow extends CrossPreviewSearchableRow> {
  rows: TRow[]
  search: string
}

export function filterCrossPreviewRowsBySearch<
  TRow extends CrossPreviewSearchableRow
>({ rows, search }: FilterCrossPreviewRowsBySearchParams<TRow>) {
  return rows.filter((row) =>
    matchesCrossPreviewSearch({
      businessName: row.businessName,
      cuit: row.cuit,
      search
    })
  )
}
