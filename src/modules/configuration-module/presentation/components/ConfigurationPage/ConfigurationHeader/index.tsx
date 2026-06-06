'use client'

import { Text } from '@mantine/core'
import { IconFileText } from '@tabler/icons-react'
import { DASHBOARD_CONFIGURATION_LABELS } from '../../../constants'
import classes from './ConfigurationHeader.module.css'

export function ConfigurationHeader() {
  return (
    <section className={classes.headerSection}>
      <div className={classes.shellRail}>
        <button type='button' className={classes.shellRailItem}>
          <IconFileText size={14} />
          <span>{DASHBOARD_CONFIGURATION_LABELS.railItem}</span>
        </button>
      </div>

      <div className={classes.sectionIntro}>
        <Text component='div' className={classes.pageTitle}>
          {DASHBOARD_CONFIGURATION_LABELS.pageTitle}
        </Text>
        <Text className={classes.pageSubtitle}>
          {DASHBOARD_CONFIGURATION_LABELS.pageSubtitle}
        </Text>
      </div>
    </section>
  )
}
