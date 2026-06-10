import { Card, LoadingOverlay, Table, Text } from '@mantine/core'
import type {
  ICrossColumnFilters,
  ICrossDynamicColumn,
  ICrossPaginationData,
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'
import {
  CROSS_PREVIEW_ANALYSIS_TABLE_TITLE,
  CROSS_PREVIEW_SEARCH_EMPTY_MESSAGE
} from '../../constants/crossPreviewLabels'
import type {
  CrossFilterColumnConfig
} from '../../hooks/cross-preview/useCrossPreviewResumenQuery'
import type { CrossPreviewStatus } from '../../hooks/useCrossPreview'
import { CrossPreviewAnalysisHeaderCell } from './CrossPreviewAnalysisHeaderCell'
import { CrossPreviewAnalysisRow } from './CrossPreviewAnalysisRow'
import { CrossPreviewPager } from './CrossPreviewPager'
import { CrossPreviewToolbarSearch } from './CrossPreviewToolbarSearch'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewAnalysisSectionProps {
  analysisColumns: ICrossDynamicColumn[]
  columnFilters: ICrossColumnFilters
  error?: string | null
  isLoading: boolean
  onOpenFilterModal: (column: CrossFilterColumnConfig) => void
  onSetPage: (page: number) => void
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  onSetResumenSearch: (value: string) => void
  pagination: ICrossPaginationData
  resumenSearch: string
  rows: ICrossPreviewAnalysisRow[]
  statusByCuit: Record<string, CrossPreviewStatus>
}

export function CrossPreviewAnalysisSection({
  analysisColumns,
  columnFilters,
  error,
  isLoading,
  onOpenFilterModal,
  onSetPage,
  onRequestStatusChange,
  onSetResumenSearch,
  pagination,
  resumenSearch,
  rows,
  statusByCuit
}: CrossPreviewAnalysisSectionProps) {
  const firstVisibleResult =
    pagination.totalItems > 0
      ? (pagination.page - 1) * pagination.itemsPerPage + 1
      : 0
  const lastVisibleResult = Math.min(
    pagination.page * pagination.itemsPerPage,
    pagination.totalItems
  )

  return (
    <Card className={classes.tableCard} radius="lg" padding={0}>
      <div className={`${classes.tableToolbar} ${classes.tableToolbarTall}`}>
        <Text className={classes.tableToolbarTitle}>
          {CROSS_PREVIEW_ANALYSIS_TABLE_TITLE}
        </Text>
        <CrossPreviewToolbarSearch
          value={resumenSearch}
          onSetSearchValue={onSetResumenSearch}
          placeholder="Buscar CUIT o razón social..."
        />
      </div>

      <div className={classes.simpleTableWrap}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={2}
          overlayProps={{ radius: 'sm', blur: 1 }}
        />
        <Table className={classes.analysisTable} withTableBorder={false} withColumnBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th
                className={`${classes.analysisHeaderCell} ${classes.analysisRankHeaderCell}`}
              >
                #
              </Table.Th>
              {analysisColumns.map((column) =>
                column.isFilterable ? (
                  <CrossPreviewAnalysisHeaderCell
                    key={column.key}
                    column={{
                      allowedOperators: column.allowedOperators,
                      key: column.key,
                      label: column.label,
                      title: column.label,
                      type: column.type
                    }}
                    columnFilters={columnFilters}
                    onOpenFilterModal={onOpenFilterModal}
                  />
                ) : (
                  <Table.Th
                    key={column.key}
                    className={`${classes.analysisHeaderCell} ${
                      column.key === 'cuit' || column.key === 'razonSocial'
                        ? classes.analysisHeaderCellLeft
                        : ''
                    }`}
                  >
                    {column.label}
                  </Table.Th>
                )
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <CrossPreviewAnalysisRow
                  key={row.id}
                  columns={analysisColumns}
                  onRequestStatusChange={onRequestStatusChange}
                  rank={(pagination.page - 1) * pagination.itemsPerPage + index + 1}
                  row={row}
                  status={statusByCuit[row.cuit] ?? row.status}
                />
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={Math.max(analysisColumns.length + 1, 1)}>
                  <Text className={classes.emptyStateText}>
                    {CROSS_PREVIEW_SEARCH_EMPTY_MESSAGE}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {error ? <Text className={classes.tableErrorText}>{error}</Text> : null}

      <div className={`${classes.tableFooter} ${classes.analysisTableFooter}`}>
        <Text className={classes.tableResultsText}>
          Mostrando {firstVisibleResult}–{lastVisibleResult} de {pagination.totalItems}{' '}
          resultados
        </Text>
        <CrossPreviewPager
          current={pagination.page}
          disabled={isLoading}
          onChange={onSetPage}
          total={pagination.totalPages}
        />
      </div>
    </Card>
  )
}
