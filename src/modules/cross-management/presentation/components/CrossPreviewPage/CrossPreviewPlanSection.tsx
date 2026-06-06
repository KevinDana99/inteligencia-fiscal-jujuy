import { Card, Text } from '@mantine/core'
import type {
  ICrossDynamicColumn,
  ICrossPaginationData,
  ICrossPreviewData,
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_PLAN_TABLE_TITLE } from '../../constants/crossPreviewLabels'
import { CrossPreviewIndicators } from './CrossPreviewIndicators'
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
  return (
    <div className={`${classes.contentStack} ${classes.planillaStack}`}>
      <CrossPreviewIndicators indicators={cross.indicators} />

      <Card className={classes.tableCard} radius="lg" padding={0}>
        <div className={`${classes.tableToolbar} ${classes.tableToolbarTall}`}>
          <Text className={classes.tableToolbarTitle}>
            {CROSS_PREVIEW_PLAN_TABLE_TITLE}
          </Text>
          <CrossPreviewToolbarSearch
            value={planillaSearch}
            onSetSearchValue={onSetPlanillaSearch}
            placeholder="Buscar CUIT o razón social..."
          />
        </div>

        <CrossPreviewPlanTable
          columns={columns}
          isLoading={isLoading}
          rows={rows}
        />

        {error ? <Text className={classes.tableErrorText}>{error}</Text> : null}

        <div className={classes.tableFooter}>
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
