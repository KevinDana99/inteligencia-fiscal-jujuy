import Link from 'next/link'
import { Button } from '@mantine/core'
import {
  IconChevronLeft,
  IconFileText,
  IconLayoutList,
  IconList
} from '@tabler/icons-react'
import {
  CROSS_PREVIEW_BACK_LABEL,
  CROSS_PREVIEW_INTIMATION_LABEL,
  CROSS_PREVIEW_PLAN_TAB_LABEL,
  CROSS_PREVIEW_SUMMARY_TAB_LABEL
} from '../../constants/crossPreviewLabels'
import { CROSS_PREVIEW_BACK_ROUTE } from '../../constants/crossPreviewRoutes'
import { useCrossPreviewTopBar } from '../../hooks/cross-preview/useCrossPreviewTopBar'
import type { CrossPreviewTab } from '../../hooks/useCrossPreview'
import classes from './CrossPreviewPage.module.css'

interface CrossPreviewTopBarProps {
  activeTab: CrossPreviewTab
  onOpenIntimationModal: () => void
  onUpdateTab: (tab: CrossPreviewTab) => void
}

export function CrossPreviewTopBar({
  activeTab,
  onOpenIntimationModal,
  onUpdateTab
}: CrossPreviewTopBarProps) {
  const {
    handleShowPlanilla,
    handleShowResumen,
    isPlanilla,
    shouldShowIntimationButton
  } = useCrossPreviewTopBar({ activeTab, onUpdateTab })

  return (
    <div className={classes.topBar}>
      <div className={classes.topBarLeft}>
        <Link href={CROSS_PREVIEW_BACK_ROUTE} className={classes.backButton}>
          <IconChevronLeft size={14} />
          {CROSS_PREVIEW_BACK_LABEL}
        </Link>

        <div className={classes.viewToggle}>
          <button
            type="button"
            className={`${classes.viewToggleButton} ${
              isPlanilla ? classes.viewToggleButtonActive : ''
            }`}
            onClick={handleShowPlanilla}
          >
            <IconList size={13} />
            {CROSS_PREVIEW_PLAN_TAB_LABEL}
          </button>
          <button
            type="button"
            className={`${classes.viewToggleButton} ${
              !isPlanilla ? classes.viewToggleButtonActive : ''
            }`}
            onClick={handleShowResumen}
          >
            <IconLayoutList size={13} />
            {CROSS_PREVIEW_SUMMARY_TAB_LABEL}
          </button>
        </div>
      </div>

      {shouldShowIntimationButton ? (
        <Button
          size="xs"
          className={classes.primaryButton}
          leftSection={<IconFileText size={14} />}
          onClick={onOpenIntimationModal}
        >
          {CROSS_PREVIEW_INTIMATION_LABEL}
        </Button>
      ) : null}
    </div>
  )
}
