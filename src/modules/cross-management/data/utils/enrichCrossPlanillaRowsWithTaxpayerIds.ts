import type {
  ICrossPlanillaRow,
  ICrossResultItem
} from '../models/CrossManagement'

function normalizeCuitKey(value: string | null | undefined) {
  return value?.replace(/\D/g, '') ?? ''
}

function buildTaxpayerIdByCuit(results: ICrossResultItem[]) {
  return new Map(
    results
      .map((result) => [normalizeCuitKey(result.cuit), result.taxpayerId] as const)
      .filter(([cuit, taxpayerId]) => Boolean(cuit && taxpayerId))
  )
}

export function enrichCrossPlanillaRowsWithTaxpayerIds(
  rows: ICrossPlanillaRow[],
  results: ICrossResultItem[]
): ICrossPlanillaRow[] {
  const taxpayerIdByCuit = buildTaxpayerIdByCuit(results)

  if (!taxpayerIdByCuit.size) {
    console.warn({
      action: 'enrichCrossPlanillaRowsWithTaxpayerIds.empty_lookup',
      rowsCount: rows.length,
      resultsCount: results.length,
      missingTaxpayerIdRows: rows.filter((row) => !row.taxpayerId).length
    })

    return rows
  }

  let enrichedRowsCount = 0
  const enrichedRows = rows.map((row) => {
    if (row.taxpayerId) {
      return row
    }

    const taxpayerId = taxpayerIdByCuit.get(normalizeCuitKey(row.cuit)) ?? null

    if (taxpayerId) {
      enrichedRowsCount += 1
    }

    return {
      ...row,
      taxpayerId
    }
  })

  console.info({
    action: 'enrichCrossPlanillaRowsWithTaxpayerIds.result',
    rowsCount: rows.length,
    resultsCount: results.length,
    lookupSize: taxpayerIdByCuit.size,
    enrichedRowsCount,
    missingTaxpayerIdRows: enrichedRows.filter((row) => !row.taxpayerId).length
  })

  return enrichedRows
}
