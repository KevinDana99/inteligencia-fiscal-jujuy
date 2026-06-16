import type {
  IBatchLoadedCuitRow,
  IBatchPreviewData
} from '../../data/models/BatchManagement'
import { BATCH_MANAGEMENT_CREATE_ERRORS } from '../constants'

function normalizeBatchCuit(value: string) {
  return value.replace(/\D/g, '')
}

export function parseBatchCuits(rawValue: string) {
  return rawValue
    .split(/[,\n;\t ]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function filterLoadedBatchCuits(
  loadedCuits: IBatchLoadedCuitRow[],
  searchValue: string
) {
  const safeLoadedCuits = Array.isArray(loadedCuits) ? loadedCuits : []
  const normalizedSearch = searchValue.trim().toLowerCase()

  if (!normalizedSearch) {
    return safeLoadedCuits
  }

  return safeLoadedCuits.filter((row) => {
    const cuitValue = row.cuit.toLowerCase()
    const businessName = row.businessName?.toLowerCase() ?? ''

    return (
      cuitValue.includes(normalizedSearch) ||
      businessName.includes(normalizedSearch)
    )
  })
}

export function buildManualLoadedCuitRows(
  rawValue: string,
  loadedCuits: IBatchLoadedCuitRow[],
  createdAt = Date.now()
) {
  const parsedValues = parseBatchCuits(rawValue)

  if (!parsedValues.length) {
    return []
  }

  const normalizedExisting = new Set(
    loadedCuits.map((row) => normalizeBatchCuit(row.cuit))
  )

  return parsedValues.reduce<IBatchLoadedCuitRow[]>((accumulator, value, index) => {
    const normalizedCuit = normalizeBatchCuit(value)

    if (!normalizedCuit || normalizedExisting.has(normalizedCuit)) {
      return accumulator
    }

    normalizedExisting.add(normalizedCuit)
    accumulator.push({
      id: `manual-${createdAt}-${index}-${normalizedCuit}`,
      cuit: value,
      businessName: null,
      source: 'manual'
    })

    return accumulator
  }, [])
}

export function buildImportedLoadedCuitRows(
  previewData: IBatchPreviewData,
  loadedCuits: IBatchLoadedCuitRow[],
  acceptedNormalizedCuits: string[] = []
) {
  const normalizedExisting = new Set(
    loadedCuits.map((row) => normalizeBatchCuit(row.cuit))
  )
  const acceptedNormalizedSet = new Set(
    acceptedNormalizedCuits.map((cuit) => normalizeBatchCuit(cuit))
  )

  return previewData.records
    .filter(
      (row) =>
        (row.status === 'valid' && row.normalizedCuit) ||
        (row.status !== 'valid' &&
          row.normalizedCuit &&
          acceptedNormalizedSet.has(normalizeBatchCuit(row.normalizedCuit)))
    )
    .reduce<IBatchLoadedCuitRow[]>((accumulator, row, index) => {
      const normalizedCuit =
        row.normalizedCuit ?? normalizeBatchCuit(row.originalCuit)

      if (!normalizedCuit || normalizedExisting.has(normalizedCuit)) {
        return accumulator
      }

      normalizedExisting.add(normalizedCuit)
      accumulator.push({
        id: `import-${index + 1}-${normalizedCuit}`,
        cuit:
          row.status === 'valid'
            ? row.originalCuit
            : row.normalizedCuit ?? row.originalCuit,
        businessName: row.businessName,
        source: 'import'
      })

      return accumulator
    }, [])
}

export function getImportedLoadedCuitDuplicates(
  previewData: IBatchPreviewData,
  loadedCuits: IBatchLoadedCuitRow[]
) {
  const normalizedExisting = new Set(
    loadedCuits.map((row) => normalizeBatchCuit(row.cuit))
  )

  return previewData.records.reduce<string[]>((accumulator, row) => {
    if (row.status !== 'valid' || !row.normalizedCuit) {
      return accumulator
    }

    const normalizedCuit = normalizeBatchCuit(row.normalizedCuit)

    if (!normalizedExisting.has(normalizedCuit)) {
      return accumulator
    }

    if (accumulator.includes(row.originalCuit)) {
      return accumulator
    }

    accumulator.push(row.originalCuit)
    return accumulator
  }, [])
}

export function getImportedLoadedCuitDuplicatesError(
  duplicatedCuits: string[]
) {
  if (!duplicatedCuits.length) {
    return null
  }

  if (duplicatedCuits.length === 1) {
    return BATCH_MANAGEMENT_CREATE_ERRORS.duplicatedSingle(duplicatedCuits[0])
  }

  return BATCH_MANAGEMENT_CREATE_ERRORS.duplicatedMultiple
}
