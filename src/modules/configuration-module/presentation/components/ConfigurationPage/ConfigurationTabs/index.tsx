'use client'

import type { DashboardConfigurationTab } from '../../../hooks/useDashboardConfiguration'
import { useConfigurationTabs } from '../../../hooks/configuration-page'
import classes from './ConfigurationTabs.module.css'

type ConfigurationTabsProps = {
  activeTab: DashboardConfigurationTab
  onChange: (tab: DashboardConfigurationTab) => void
}

export function ConfigurationTabs({
  activeTab,
  onChange
}: ConfigurationTabsProps) {
  const { tabs } = useConfigurationTabs({
    activeTab,
    onChange,
    classes
  })

  return (
    <div className={classes.tabsRow}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type='button'
          className={tab.className}
          onClick={tab.handleClick}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
