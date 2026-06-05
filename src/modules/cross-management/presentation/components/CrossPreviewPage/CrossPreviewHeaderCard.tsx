import { Card, Text } from '@mantine/core'
import { IconActivity } from '@tabler/icons-react'
import type { ICrossPreviewData } from '../../../data/models/CrossManagement'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewHeaderCardProps {
  cross: ICrossPreviewData
}

export function CrossPreviewHeaderCard({ cross }: CrossPreviewHeaderCardProps) {
  return (
    <Card className={classes.headerCard} radius="lg" padding={0}>
      <div className={classes.headerCardInner}>
        <div className={classes.headerIcon}>
          <IconActivity size={18} color="#4375EE" stroke={2} />
        </div>
        <div className={classes.headerTitleBlock}>
          <Text className={classes.headerEyebrow}>Cruce en curso</Text>
          <Text className={classes.headerTitle}>{cross.name}</Text>
        </div>

        <div className={classes.headerMeta}>
          <CrossPreviewHeaderMeta label="Lote / CUIT" value={cross.sourceRef} />
          <CrossPreviewHeaderMeta label="Período" value={cross.period} />
          <CrossPreviewHeaderMeta label="Total CUITs" value={cross.cuitCount} />
          <CrossPreviewHeaderMeta
            isSuccess
            label="Relevantes"
            value={cross.relevantCountLabel}
          />
        </div>
      </div>
    </Card>
  )
}

interface CrossPreviewHeaderMetaProps {
  isSuccess?: boolean
  label: string
  value: number | string
}

function CrossPreviewHeaderMeta({
  isSuccess,
  label,
  value
}: CrossPreviewHeaderMetaProps) {
  return (
    <div className={classes.metaItem}>
      <Text className={classes.metaLabel}>{label}</Text>
      <Text className={isSuccess ? classes.metaValueSuccess : classes.metaValue}>
        {value}
      </Text>
    </div>
  )
}
