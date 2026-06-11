'use client'

import { REPROCESSING_PAGE_LABELS } from '../../../constants/reprocessingPageLabels'
import classes from './ReprocessingAlertBanner.module.css'

export function ReprocessingAlertBanner({ total }: { total: number }) {
  return (
    <div className={classes.alertCard}>
      <div className={classes.alertContent}>
        <div className={classes.alertTitle}>{REPROCESSING_PAGE_LABELS.alertTitle}</div>
        <div className={classes.alertDescription}>
          {REPROCESSING_PAGE_LABELS.alertDescription}
        </div>
      </div>
      <span className={classes.alertBadge}>{total} en reproceso</span>
    </div>
  )
}
