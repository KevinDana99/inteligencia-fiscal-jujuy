import type { ICrossManagementSource } from '../../interfaces/CrossManagementSource'
import type {
  ICrossAnalysisRow,
  ICrossDynamicColumn,
  ICrossManagementListData,
  ICrossManagementListParams,
  ICrossPlanillaData,
  ICrossPlanillaRequestParams,
  ICrossPlanillaRow,
  ICrossResumenData,
  ICrossResumenRequestParams,
  IGenerateIntimationDocumentPayload,
  IIntimationDocumentGeneratedSummary,
  ICrossResultsListData,
  ICrossResultsListParams
} from '../../models/CrossManagement'
import { crossItemsMock, crossPreviewMockById } from './fixtures/crossItems'

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

function findPreview(executionId: number) {
  return (
    crossPreviewMockById[String(executionId)] ??
    crossPreviewMockById[`cross-${executionId}`]
  )
}

function normalizeColumnKey(label: string, index: number) {
  const normalized = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .replace(/\s+([a-zA-Z0-9])/g, (_, letter: string) => letter.toUpperCase())

  return normalized
    ? `${normalized.charAt(0).toLowerCase()}${normalized.slice(1)}`
    : `columna${index + 1}`
}

function parseMockNumber(value: string) {
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : null
}

function buildMockTaxpayerId(executionId: number, rowIndex: number) {
  return `00000000-0000-4000-8000-${String(executionId)
    .padStart(6, '0')}${String(rowIndex + 1).padStart(6, '0')}`
}

function matchesSearch(cuit: string, businessName: string, search?: string | null) {
  const normalized = normalizeSearchValue(search ?? '')

  if (!normalized) {
    return true
  }

  return (
    cuit.toLowerCase().includes(normalized) ||
    businessName.toLowerCase().includes(normalized)
  )
}

export class MockCrossManagementSource implements ICrossManagementSource {
  async generateIntimationDocument(
    payload: IGenerateIntimationDocumentPayload
  ): Promise<IIntimationDocumentGeneratedSummary> {
    const documentId = `mock-${payload.contribuyente.id}-${payload.formato.toLowerCase()}`

    return {
      documentId,
      downloadUrl: `/api/documentos/${documentId}/descargar`
    }
  }

  async listExecutions(
    params: ICrossManagementListParams = {}
  ): Promise<ICrossManagementListData> {
    const normalizedSearch = normalizeSearchValue(params.search ?? '')
    const items = normalizedSearch
      ? crossItemsMock.filter(
          (item) =>
            item.name.toLowerCase().includes(normalizedSearch) ||
            item.sourceRef.toLowerCase().includes(normalizedSearch)
        )
      : crossItemsMock

    return {
      page: params.page ?? 1,
      itemsPerPage: params.itemsPerPage ?? 20,
      totalItems: items.length,
      totalPages: 1,
      items
    }
  }

  async getPlanilla(
    executionId: number,
    params: ICrossPlanillaRequestParams = {}
  ): Promise<ICrossPlanillaData> {
    const preview = findPreview(executionId)
    const page = params.page ?? 1
    const itemsPerPage = params.itemsPerPage ?? 20

    if (!preview) {
      return {
        schema: page === 1 ? { columns: [] } : null,
        page,
        itemsPerPage,
        totalItems: 0,
        totalPages: 0,
        rows: []
      }
    }

    const columns: ICrossDynamicColumn[] = preview.planColumns.map(
      (label, index) => ({
        key: normalizeColumnKey(label, index),
        type: 'string',
        label,
        isFilterable: false,
        allowedOperators: []
      })
    )
    const filteredRows = preview.planRows.filter((row) =>
      matchesSearch(row.cuit, row.businessName, params.search)
    )
    const rows: ICrossPlanillaRow[] = filteredRows.map((row, rowIndex) => ({
      cuit: row.cuit,
      businessName: row.businessName,
      taxpayerId: buildMockTaxpayerId(executionId, rowIndex),
      texts: Object.fromEntries(
        columns.map((column, index) => [column.key, row.cells[index] ?? null])
      ),
      dates: {},
      metrics: {}
    }))

    return {
      schema: page === 1 ? { columns } : null,
      page,
      itemsPerPage,
      totalItems: rows.length,
      totalPages: Math.max(Math.ceil(rows.length / itemsPerPage), 1),
      rows: rows.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    }
  }

  async getResumen(
    executionId: number,
    params: ICrossResumenRequestParams = {}
  ): Promise<ICrossResumenData> {
    const preview = findPreview(executionId)
    const page = params.page ?? 1
    const itemsPerPage = params.itemsPerPage ?? 20
    const analysisColumns: ICrossDynamicColumn[] = [
      { key: 'cuit', type: 'string', label: 'CUIT', isFilterable: false, allowedOperators: [] },
      { key: 'razonSocial', type: 'string', label: 'RAZON SOCIAL', isFilterable: false, allowedOperators: [] },
      {
        key: 'bi910',
        type: 'numero',
        label: 'B.I. 910',
        isFilterable: true,
        allowedOperators: ['mayorQue', 'mayorOIgualQue', 'menorQue', 'menorOIgualQue', 'igualA', 'distintoDe']
      },
      {
        key: 'biPretendida',
        type: 'numero',
        label: 'B.I. PRETENDIDA',
        isFilterable: true,
        allowedOperators: ['mayorQue', 'mayorOIgualQue', 'menorQue', 'menorOIgualQue', 'igualA', 'distintoDe']
      },
      {
        key: 'diferencia',
        type: 'numero',
        label: 'DIFERENCIA',
        isFilterable: true,
        allowedOperators: ['mayorQue', 'mayorOIgualQue', 'menorQue', 'menorOIgualQue', 'igualA', 'distintoDe']
      },
      {
        key: 'impuestoEstimado',
        type: 'numero',
        label: 'IMPUESTO ESTIMADO',
        isFilterable: true,
        allowedOperators: ['mayorQue', 'mayorOIgualQue', 'menorQue', 'menorOIgualQue', 'igualA', 'distintoDe']
      },
      {
        key: 'netoAPagar',
        type: 'numero',
        label: 'NETO A PAGAR',
        isFilterable: true,
        allowedOperators: ['mayorQue', 'mayorOIgualQue', 'menorQue', 'menorOIgualQue', 'igualA', 'distintoDe']
      },
      { key: 'estadoRelevancia', type: 'string', label: 'ESTADO', isFilterable: false, allowedOperators: [] }
    ]

    if (!preview) {
      return {
        metadata: {
          executionId,
          crossCode: null,
          crossVersion: null,
          title: null,
          subtitle: null,
          batchOrCuit: null,
          period: null,
          totalCuits: 0,
          relevantCuits: 0
        },
        summaryBlocks: page === 1 ? [] : null,
        analysisSchema: page === 1 ? { columns: analysisColumns } : null,
        analysis: { page, itemsPerPage, totalItems: 0, totalPages: 0, rows: [] }
      }
    }

    const filteredRows = preview.analysisRows.filter((row) =>
      matchesSearch(row.cuit, row.businessName, params.search)
    )
    const rows: ICrossAnalysisRow[] = filteredRows.map((row) => ({
      cuit: row.cuit,
      businessName: row.businessName,
      relevanceStatus: row.status === 'relevante' ? 'Relevante' : null,
      texts: {},
      dates: {},
      metrics: {
        bi910: parseMockNumber(row.declaredBase),
        biPretendida: parseMockNumber(row.pretendedBase),
        diferencia: parseMockNumber(row.difference),
        impuestoEstimado: parseMockNumber(row.tax),
        netoAPagar: parseMockNumber(row.netDebt)
      }
    }))

    return {
      metadata: {
        executionId,
        crossCode: preview.id,
        crossVersion: 'mock',
        title: preview.name,
        subtitle: null,
        batchOrCuit: preview.sourceRef,
        period: preview.period,
        totalCuits: preview.cuitCount,
        relevantCuits: rows.filter((row) => row.relevanceStatus).length
      },
      summaryBlocks:
        page === 1
          ? [
              {
                key: 'resumen',
                title: 'Resumen',
                columns: [
                  { key: 'regimen', type: 'string', label: 'REGIMEN', isFilterable: false, allowedOperators: [] },
                  { key: 'bi910', type: 'numero', label: 'B.I. 910', isFilterable: false, allowedOperators: [] },
                  { key: 'biPretendida', type: 'numero', label: 'B.I. PRETENDIDA', isFilterable: false, allowedOperators: [] },
                  { key: 'diferenciaAFavorDpr', type: 'numero', label: 'DIF A FAVOR DPR', isFilterable: false, allowedOperators: [] },
                  { key: 'impuesto', type: 'numero', label: 'IMPUESTO', isFilterable: false, allowedOperators: [] },
                  { key: 'deudaNeta', type: 'numero', label: 'DEUDA NETA', isFilterable: false, allowedOperators: [] }
                ],
                rows: preview.summaryRows.map((row) => ({
                  texts: { regimen: row.regime },
                  dates: {},
                  metrics: {
                    bi910: parseMockNumber(row.declaredBase),
                    biPretendida: parseMockNumber(row.pretendedBase),
                    diferenciaAFavorDpr: parseMockNumber(row.difference),
                    impuesto: parseMockNumber(row.tax),
                    deudaNeta: parseMockNumber(row.netDebt)
                  }
                }))
              }
            ]
          : null,
      analysisSchema: page === 1 ? { columns: analysisColumns } : null,
      analysis: {
        page,
        itemsPerPage,
        totalItems: rows.length,
        totalPages: Math.max(Math.ceil(rows.length / itemsPerPage), 1),
        rows: rows.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      }
    }
  }

  async listResults(
    executionId: number,
    params: ICrossResultsListParams = {}
  ): Promise<ICrossResultsListData> {
    const preview = findPreview(executionId)
    const results =
      preview?.analysisRows.map((row, index) => ({
        id: `${executionId}-${index + 1}`,
        executionId,
        crossCode: preview.id,
        crossVersion: 'mock',
        taxpayerId: '',
        cuit: row.cuit,
        granularity: 'anual',
        period: preview.period,
        periodFrom: preview.period,
        periodTo: preview.period,
        calculationStatus: row.status,
        metrics: {},
        dynamicDetail: {},
        sources: [],
        nonCalculableFields: [],
        createdAt: preview.date
      })) ?? []

    return {
      page: params.page ?? 1,
      itemsPerPage: params.itemsPerPage ?? 20,
      totalItems: results.length,
      totalPages: 1,
      results
    }
  }
}
