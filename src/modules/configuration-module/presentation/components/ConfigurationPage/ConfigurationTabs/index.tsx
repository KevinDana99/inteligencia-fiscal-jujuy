'use client'

import type { DashboardConfigurationTab } from '../../../hooks/useDashboardConfiguration'
import { DASHBOARD_CONFIGURATION_LABELS } from '../../../constants'
import classes from './ConfigurationTabs.module.css'

type ConfigurationTabsProps = {
  activeTab: DashboardConfigurationTab
  onChange: (tab: DashboardConfigurationTab) => void
}

export function ConfigurationTabs({
  activeTab,
  onChange
}: ConfigurationTabsProps) {
  const isIntimacion = activeTab === 'intimacion'

  return (
    <div className={classes.tabsRow}>
      <button
        type='button'
        className={`${classes.tabButton} ${isIntimacion ? classes.tabButtonActive : ''}`}
        onClick={() => onChange('intimacion')}
      >
        {DASHBOARD_CONFIGURATION_LABELS.tabs.intimacion}
      </button>
      <button
        type='button'
        className={`${classes.tabButton} ${!isIntimacion ? classes.tabButtonActive : ''}`}
        onClick={() => onChange('informe')}
      >
        {DASHBOARD_CONFIGURATION_LABELS.tabs.informe}
      </button>
    </div>
  )
}
