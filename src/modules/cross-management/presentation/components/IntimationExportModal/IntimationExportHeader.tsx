import { ActionIcon, Text } from '@mantine/core'
import { IconFileText, IconX } from '@tabler/icons-react'
import {
  INTIMATION_EXPORT_CLOSE_LABEL,
  INTIMATION_EXPORT_TITLE
} from '../../constants/intimationExportLabels'
import classes from './IntimationExportModalHeader.module.css'

interface IntimationExportHeaderProps {
  countLabel: string
  onClose: () => void
}

export function IntimationExportHeader({
  countLabel,
  onClose
}: IntimationExportHeaderProps) {
  return (
    <div className={classes.topBar}>
      <div className={classes.topBarLeft}>
        <IconFileText size={16} color="var(--mantine-color-gray-4)" />
        <Text className={classes.topBarTitle}>{INTIMATION_EXPORT_TITLE}</Text>
        <span className={classes.countBadge}>{countLabel}</span>
      </div>

      <ActionIcon
        variant="subtle"
        className={classes.closeButton}
        aria-label={INTIMATION_EXPORT_CLOSE_LABEL}
        onClick={onClose}
      >
        <IconX size={14} />
      </ActionIcon>
    </div>
  )
}
