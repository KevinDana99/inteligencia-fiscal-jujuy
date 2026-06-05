import {
  CROSS_MANAGEMENT_SUBTITLE,
  CROSS_MANAGEMENT_TITLE
} from '../../constants/crossManagementLabels'
import classes from './CrossManagementHeader.module.css'

export function CrossManagementHeader() {
  return (
    <div className={classes.header}>
      <div>
        <div className={classes.headerTitle}>{CROSS_MANAGEMENT_TITLE}</div>
        <div className={classes.headerSubtitle}>{CROSS_MANAGEMENT_SUBTITLE}</div>
      </div>
    </div>
  )
}
