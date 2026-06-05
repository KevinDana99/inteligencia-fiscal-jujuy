import { Card, Table, Text } from '@mantine/core'
import type {
  ICrossColumnFilters,
  ICrossPreviewAnalysisRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_ANALYSIS_FILTERABLE_COLUMNS } from '../../constants/crossPreviewFilters'
import {
  CROSS_PREVIEW_ANALYSIS_TABLE_TITLE,
  CROSS_PREVIEW_SEARCH_EMPTY_MESSAGE
} from '../../constants/crossPreviewLabels'
import type {
  CrossFilterColumnConfig
} from '../../hooks/cross-preview/useCrossPreviewAnalysisFilters'
import type { CrossPreviewStatus } from '../../hooks/useCrossPreview'
import { CrossPreviewAnalysisHeaderCell } from './CrossPreviewAnalysisHeaderCell'
import { CrossPreviewAnalysisRow } from './CrossPreviewAnalysisRow'
import { CrossPreviewPager } from './CrossPreviewPager'
import { CrossPreviewToolbarSearch } from './CrossPreviewToolbarSearch'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewAnalysisSectionProps {
  columnFilters: ICrossColumnFilters
  filteredAnalysisRows: ICrossPreviewAnalysisRow[]
  onOpenFilterModal: (column: CrossFilterColumnConfig) => void
  onRequestStatusChange: (
    row: ICrossPreviewAnalysisRow,
    status: CrossPreviewStatus
  ) => void
  onSetResumenSearch: (value: string) => void
  resumenSearch: string
  statusByCuit: Record<string, CrossPreviewStatus>
}

export function CrossPreviewAnalysisSection({
  columnFilters,
  filteredAnalysisRows,
  onOpenFilterModal,
  onRequestStatusChange,
  onSetResumenSearch,
  resumenSearch,
  statusByCuit
}: CrossPreviewAnalysisSectionProps) {
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
        <Table className={classes.analysisTable} withTableBorder={false} withColumnBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={`${classes.analysisHeaderCell} ${classes.analysisHeaderCellLeft}`}>CUIT</Table.Th>
              <Table.Th className={`${classes.analysisHeaderCell} ${classes.analysisHeaderCellLeft}`}>RAZÓN SOCIAL</Table.Th>
              {CROSS_PREVIEW_ANALYSIS_FILTERABLE_COLUMNS.map((column) => (
                <CrossPreviewAnalysisHeaderCell
                  key={column.key}
                  column={column}
                  columnFilters={columnFilters}
                  onOpenFilterModal={onOpenFilterModal}
                />
              ))}
              <Table.Th className={classes.analysisHeaderCell}>ESTADO</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredAnalysisRows.length ? (
              filteredAnalysisRows.map((row) => (
                <CrossPreviewAnalysisRow
                  key={row.cuit}
                  onRequestStatusChange={onRequestStatusChange}
                  row={row}
                  status={statusByCuit[row.cuit]}
                />
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text className={classes.emptyStateText}>
                    {CROSS_PREVIEW_SEARCH_EMPTY_MESSAGE}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      <div className={classes.tableFooter}>
        <CrossPreviewPager current={1} total={1} disabled />
      </div>
    </Card>
  )
}
