import { CROSS_PREVIEW_INDICATORS } from '../../constants/crossPreviewIndicators'
import type {
  ICrossAnalysisRow,
  ICrossDynamicColumn,
  ICrossManagementItem,
  ICrossPaginationData,
  ICrossPlanillaData,
  ICrossPlanillaRow,
  ICrossPreviewAnalysisRow,
  ICrossPreviewData,
  ICrossPreviewPlanRow,
  ICrossPreviewSummaryBlock,
  ICrossResumenBlock,
  ICrossResumenData
} from '../models/CrossManagement'
import {
  mapDynamicRowValue,
  mapDynamicRowValues
} from '../utils/crossPreviewDynamicValues'

function formatCuit(value: string) {
  const digits = value.replace(/\D/g, '')

  if (digits.length === 11) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`
  }

  return value || '-'
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() || '-'
}

function normalizeLookup(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function mapRelevanceStatus(value: string | null): ICrossPreviewAnalysisRow['status'] {
  const normalized = normalizeLookup(value)

  if (normalized.includes('repro')) {
    return 'reproceso'
  }

  if (normalized.includes('relev')) {
    return 'relevante'
  }

  return 'estado'
}

function resolvePlanillaCellValue(
  row: ICrossPlanillaRow,
  column: ICrossDynamicColumn
) {
  if (column.key === 'cuit') {
    return formatCuit(row.cuit)
  }

  if (column.key === 'razonSocial') {
    return normalizeText(row.businessName)
  }

  return mapDynamicRowValue(row, column)
}

function resolveAnalysisCellValue(
  row: ICrossAnalysisRow,
  column: ICrossDynamicColumn
) {
  if (column.key === 'cuit') {
    return formatCuit(row.cuit)
  }

  if (column.key === 'razonSocial') {
    return normalizeText(row.businessName)
  }

  if (column.key === 'estadoRelevancia') {
    return normalizeText(row.relevanceStatus)
  }

  return mapDynamicRowValue(row, column)
}

export function mapPlanillaRowsToPreview(
  rows: ICrossPlanillaRow[],
  columns: ICrossDynamicColumn[]
): ICrossPreviewPlanRow[] {
  return rows.map((row, rowIndex) => {
    const values = Object.fromEntries(
      columns.map((column) => [column.key, resolvePlanillaCellValue(row, column)])
    )

    return {
      id: `${row.cuit}-${rowIndex}`,
      cuit: formatCuit(row.cuit),
      businessName: normalizeText(row.businessName),
      values,
      cells: columns.map((column) => values[column.key] ?? '-')
    }
  })
}

export function mapSummaryBlocksToPreview(
  blocks: ICrossResumenBlock[] | null
): ICrossPreviewSummaryBlock[] {
  return (
    blocks?.map((block) => ({
      id: block.key,
      title: block.title,
      columns: block.columns,
      rows: block.rows.map((row, rowIndex) => ({
        id: `${block.key}-${rowIndex}`,
        values: mapDynamicRowValues(row, block.columns)
      }))
    })) ?? []
  )
}

export function mapAnalysisRowsToPreview(
  rows: ICrossAnalysisRow[],
  columns: ICrossDynamicColumn[]
): ICrossPreviewAnalysisRow[] {
  return rows.map((row, rowIndex) => {
    const values = Object.fromEntries(
      columns.map((column) => [column.key, resolveAnalysisCellValue(row, column)])
    )

    return {
      id: `${row.cuit}-${rowIndex}`,
      cuit: formatCuit(row.cuit),
      businessName: normalizeText(row.businessName),
      values,
      status: mapRelevanceStatus(row.relevanceStatus)
    }
  })
}

function resolveRelevantCountLabel(resumen: ICrossResumenData) {
  const count =
    resumen.metadata.relevantCuits ??
    resumen.analysis.rows.filter((row) => mapRelevanceStatus(row.relevanceStatus) === 'relevante')
      .length

  return count === 1 ? '1 relevante' : `${count} relevantes`
}

function resolvePagination(data: ICrossPaginationData): ICrossPaginationData {
  return {
    page: data.page,
    itemsPerPage: data.itemsPerPage,
    totalItems: data.totalItems,
    totalPages: data.totalPages
  }
}

export function mapCrossPreviewContractToView(
  executionId: number,
  planilla: ICrossPlanillaData,
  resumen: ICrossResumenData,
  execution?: ICrossManagementItem | null
): ICrossPreviewData {
  const planColumns = planilla.schema?.columns ?? []
  const analysisColumns = resumen.analysisSchema?.columns ?? []
  const totalCuits =
    resumen.metadata.totalCuits ||
    execution?.cuitCount ||
    planilla.totalItems ||
    resumen.analysis.totalItems

  return {
    id: String(executionId),
    executionId,
    name: resumen.metadata.title ?? execution?.name ?? `Cruce ${executionId}`,
    source: execution?.source ?? (totalCuits > 1 ? 'Lote' : 'Padrón'),
    sourceRef: resumen.metadata.batchOrCuit ?? execution?.sourceRef ?? '-',
    period: resumen.metadata.period ?? execution?.period ?? '-',
    cuitCount: totalCuits,
    date: execution?.date ?? '-',
    relevantCountLabel: resolveRelevantCountLabel(resumen),
    indicators: CROSS_PREVIEW_INDICATORS,
    planColumns,
    planRows: mapPlanillaRowsToPreview(planilla.rows, planColumns),
    planPagination: resolvePagination(planilla),
    summaryBlocks: mapSummaryBlocksToPreview(resumen.summaryBlocks),
    analysisColumns,
    analysisRows: mapAnalysisRowsToPreview(resumen.analysis.rows, analysisColumns),
    analysisPagination: resolvePagination(resumen.analysis)
  }
}
