import { Group, Text } from '@mantine/core'
import type { ICrossPreviewIndicator } from '../../../data/models/CrossManagement'
import { useCrossPreviewIndicatorItem } from '../../hooks/cross-preview/useCrossPreviewIndicatorItem'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewIndicatorsProps {
  indicators: ICrossPreviewIndicator[]
}

interface CrossPreviewIndicatorItemProps {
  indicator: ICrossPreviewIndicator
}

export function CrossPreviewIndicators({ indicators }: CrossPreviewIndicatorsProps) {
  return (
    <Group gap="md" className={classes.indicatorsRow}>
      {indicators.map((indicator) => (
        <CrossPreviewIndicatorItem key={indicator.id} indicator={indicator} />
      ))}
    </Group>
  )
}

function CrossPreviewIndicatorItem({ indicator }: CrossPreviewIndicatorItemProps) {
  const { swatchClassName } = useCrossPreviewIndicatorItem(indicator.tone)

  return (
    <div className={classes.indicatorItem}>
      <span className={swatchClassName} />
      <Text className={classes.indicatorLabel}>{indicator.label}</Text>
    </div>
  )
}
