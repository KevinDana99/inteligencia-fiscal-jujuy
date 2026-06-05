import { Card, Text } from '@mantine/core'
import type {
  ICrossPreviewData,
  ICrossPreviewPlanRow
} from '../../../data/models/CrossManagement'
import { CROSS_PREVIEW_PLAN_TABLE_TITLE } from '../../constants/crossPreviewLabels'
import { CrossPreviewIndicators } from './CrossPreviewIndicators'
import { CrossPreviewPlanTable } from './CrossPreviewPlanTable'
import { CrossPreviewToolbarSearch } from './CrossPreviewToolbarSearch'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewPlanSectionProps {
  cross: ICrossPreviewData
  filteredPlanRows: ICrossPreviewPlanRow[]
  onSetPlanillaSearch: (value: string) => void
  planillaSearch: string
}

export function CrossPreviewPlanSection({
  cross,
  filteredPlanRows,
  onSetPlanillaSearch,
  planillaSearch
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
          columns={cross.planColumns}
          rows={filteredPlanRows}
        />
      </Card>
    </div>
  )
}
