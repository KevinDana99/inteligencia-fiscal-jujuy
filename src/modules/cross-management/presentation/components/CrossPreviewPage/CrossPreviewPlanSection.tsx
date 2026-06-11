import { Badge, Card, Text } from '@mantine/core'
import type {
  ICrossDynamicColumn,
  ICrossPaginationData,
  ICrossPreviewData,
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_PLAN_TABLE_TITLE } from '../../constants/crossPreviewLabels'
import { CrossPreviewPager } from './CrossPreviewPager'
import { CrossPreviewPlanTable } from './CrossPreviewPlanTable'
import { CrossPreviewToolbarSearch } from './CrossPreviewToolbarSearch'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewPlanSectionProps {
  columns: ICrossDynamicColumn[]
  cross: ICrossPreviewData
  error?: string | null
  isLoading: boolean
  onSetPage: (page: number) => void
  onSetPlanillaSearch: (value: string) => void
  pagination: ICrossPaginationData
  planillaSearch: string
  rows: ICrossPreviewPlanRow[]
}

export function CrossPreviewPlanSection({
  columns,
  cross,
  error,
  isLoading,
  onSetPage,
  onSetPlanillaSearch,
  pagination,
  planillaSearch,
  rows
}: CrossPreviewPlanSectionProps) {
  const firstVisibleResult =
    pagination.totalItems > 0
      ? (pagination.page - 1) * pagination.itemsPerPage + 1
      : 0
  const lastVisibleResult = Math.min(
    pagination.page * pagination.itemsPerPage,
    pagination.totalItems
  )
  const cuitLabel = cross.cuitCount === 1 ? 'CUIT' : 'CUITs'
  const tableTitle = `${CROSS_PREVIEW_PLAN_TABLE_TITLE} — ${cross.name}`

  return (
    <div className={`${classes.contentStack} ${classes.planillaStack}`}>
      <Card className={classes.tableCard} radius="lg" padding={0}>
        <div className={`${classes.tableToolbar} ${classes.tableToolbarTall}`}>
          <div className={classes.planToolbarLeft}>
            <Text className={classes.tableToolbarTitle}>{tableTitle}</Text>
            <CrossPreviewToolbarSearch
              value={planillaSearch}
              onSetSearchValue={onSetPlanillaSearch}
              placeholder="Buscar CUIT o razón social..."
            />
          </div>
          <Badge className={classes.toolbarBadge} radius="xl">
            {cross.cuitCount} {cuitLabel} · {cross.period}
          </Badge>
        </div>

        <CrossPreviewPlanTable
          columns={columns}
          isLoading={isLoading}
          rows={rows}
        />

        {error ? <Text className={classes.tableErrorText}>{error}</Text> : null}

        <div className={`${classes.tableFooter} ${classes.tableFooterWithResults}`}>
          <Text className={classes.tableResultsText}>
            Mostrando {firstVisibleResult}–{lastVisibleResult} de {pagination.totalItems}{' '}
            resultado{pagination.totalItems === 1 ? '' : 's'}
          </Text>
          <CrossPreviewPager
            current={pagination.page}
            disabled={isLoading}
            onChange={onSetPage}
            total={pagination.totalPages}
          />
        </div>
      </Card>
    </div>
  )
}
