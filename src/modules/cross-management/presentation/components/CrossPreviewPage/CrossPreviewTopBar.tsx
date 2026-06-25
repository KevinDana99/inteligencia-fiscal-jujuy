import Link from 'next/link'
import { Button } from '@mantine/core'
import {
  IconChartBar,
  IconChevronLeft,
  IconFileText,
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
  availableTabs: CrossPreviewTab[]
  onOpenIntimationModal: () => void
  onUpdateTab: (tab: CrossPreviewTab) => void
}

const TAB_CONFIG = {
  planilla: {
    Icon: IconList,
    label: CROSS_PREVIEW_PLAN_TAB_LABEL
  },
  resumen: {
    Icon: IconChartBar,
    label: CROSS_PREVIEW_SUMMARY_TAB_LABEL
  }
} satisfies Record<CrossPreviewTab, { Icon: typeof IconList; label: string }>

export function CrossPreviewTopBar({
  activeTab,
  availableTabs,
  onOpenIntimationModal,
  onUpdateTab
}: CrossPreviewTopBarProps) {
  const {
    shouldShowIntimationButton
  } = useCrossPreviewTopBar({ activeTab, availableTabs, onUpdateTab })

  return (
    <div className={classes.topBar}>
      <div className={classes.topBarLeft}>
        <Link href={CROSS_PREVIEW_BACK_ROUTE} className={classes.backButton}>
          <IconChevronLeft size={14} />
          {CROSS_PREVIEW_BACK_LABEL}
        </Link>

        <div className={classes.viewToggle}>
          {availableTabs.map((tab) => {
            const { Icon, label } = TAB_CONFIG[tab]
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                className={`${classes.viewToggleButton} ${
                  isActive ? classes.viewToggleButtonActive : ''
                }`}
                onClick={() => onUpdateTab(tab)}
              >
                <Icon size={13} />
                {label}
              </button>
            )
          })}
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
