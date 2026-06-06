import { ActionIcon, Text } from '@mantine/core'
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight
} from '@tabler/icons-react'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewPagerProps {
  current: number
  disabled?: boolean
  onChange?: (page: number) => void
  total: number
}

export function CrossPreviewPager({
  current,
  disabled,
  onChange,
  total
}: CrossPreviewPagerProps) {
  const safeTotal = Math.max(total, 1)

  return (
    <div className={classes.pager}>
      <ActionIcon
        variant="default"
        radius="md"
        className={classes.pagerButton}
        disabled={disabled || current <= 1}
        onClick={() => onChange?.(current - 1)}
      >
        <IconArrowNarrowLeft size={14} />
      </ActionIcon>
      <Text className={classes.pagerLabel}>
        {current} / {safeTotal}
      </Text>
      <ActionIcon
        variant="default"
        radius="md"
        className={classes.pagerButton}
        disabled={disabled || current >= safeTotal}
        onClick={() => onChange?.(current + 1)}
      >
        <IconArrowNarrowRight size={14} />
      </ActionIcon>
    </div>
  )
}
