import { ActionIcon, Text } from '@mantine/core'
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight
} from '@tabler/icons-react'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewPagerProps {
  current: number
  disabled?: boolean
  total: number
}

export function CrossPreviewPager({
  current,
  disabled,
  total
}: CrossPreviewPagerProps) {
  return (
    <div className={classes.pager}>
      <ActionIcon
        variant="default"
        radius="md"
        className={classes.pagerButton}
        disabled={disabled || current <= 1}
      >
        <IconArrowNarrowLeft size={14} />
      </ActionIcon>
      <Text className={classes.pagerLabel}>
        {current} / {total}
      </Text>
      <ActionIcon
        variant="default"
        radius="md"
        className={classes.pagerButton}
        disabled={disabled || current >= total}
      >
        <IconArrowNarrowRight size={14} />
      </ActionIcon>
    </div>
  )
}
