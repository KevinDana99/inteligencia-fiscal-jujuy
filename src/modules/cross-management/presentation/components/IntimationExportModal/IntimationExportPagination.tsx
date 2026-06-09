import { ActionIcon, Text } from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react'
import {
  INTIMATION_EXPORT_NEXT_LABEL,
  INTIMATION_EXPORT_PREVIOUS_LABEL
} from '../../constants/intimationExportLabels'
import { useIntimationExportPagination } from '../../hooks/intimation-export/useIntimationExportPagination'
import classes from './IntimationExportModalHeader.module.css'

interface IntimationExportPaginationProps {
  contributorLabel: string
  currentPage: number
  cuitLabel: string
  onNext: () => void
  onPrevious: () => void
  paginationLabel: string
  totalPages: number
}

export function IntimationExportPagination({
  contributorLabel,
  currentPage,
  cuitLabel,
  onNext,
  onPrevious,
  paginationLabel,
  totalPages
}: IntimationExportPaginationProps) {
  const { isNextDisabled, isPreviousDisabled } = useIntimationExportPagination({
    currentPage,
    totalPages
  })

  return (
    <div className={classes.paginationBar}>
      <ActionIcon
        variant="subtle"
        className={classes.pageButton}
        aria-label={INTIMATION_EXPORT_PREVIOUS_LABEL}
        onClick={onPrevious}
        disabled={isPreviousDisabled}
      >
        <IconChevronLeft size={14} />
      </ActionIcon>
      <div className={classes.contributorNavContent}>
        <Text className={classes.contributorNavName}>{contributorLabel}</Text>
        <Text className={classes.contributorNavMeta}>
          {cuitLabel} <span className={classes.metaDivider}>·</span>{' '}
          {paginationLabel}
        </Text>
      </div>
      <ActionIcon
        variant="subtle"
        className={classes.pageButton}
        aria-label={INTIMATION_EXPORT_NEXT_LABEL}
        onClick={onNext}
        disabled={isNextDisabled}
      >
        <IconChevronRight size={14} />
      </ActionIcon>
    </div>
  )
}
