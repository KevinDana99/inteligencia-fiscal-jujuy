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
  currentPage: number
  onNext: () => void
  onPrevious: () => void
  paginationLabel: string
  totalPages: number
}

export function IntimationExportPagination({
  currentPage,
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
      <Text className={classes.paginationLabel}>{paginationLabel}</Text>
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
