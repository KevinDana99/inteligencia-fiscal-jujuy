import { Card, Stack, Text } from '@mantine/core'
import {
  CROSS_PREVIEW_EMPTY_MESSAGE,
  CROSS_PREVIEW_EMPTY_TITLE
} from '../../constants/crossPreviewLabels'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewEmptyStateProps {
  message?: string
}

export function CrossPreviewEmptyState({ message }: CrossPreviewEmptyStateProps) {
  return (
    <Card className={classes.emptyCard} radius="lg" padding="xl">
      <Stack gap="xs">
        <Text className={classes.emptyTitle}>{CROSS_PREVIEW_EMPTY_TITLE}</Text>
        <Text className={classes.emptyText}>
          {message ?? CROSS_PREVIEW_EMPTY_MESSAGE}
        </Text>
      </Stack>
    </Card>
  )
}
