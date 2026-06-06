'use client'

import { useCallback, useMemo } from 'react'
import {
  DASHBOARD_CONFIGURATION_LABELS,
  DASHBOARD_CONFIGURATION_TABS
} from '../../constants'
import type { DashboardConfigurationTab } from '../useDashboardConfiguration'

type ConfigurationTabsClasses = Record<string, string>

type UseConfigurationTabsParams = {
  activeTab: DashboardConfigurationTab
  onChange: (tab: DashboardConfigurationTab) => void
  classes: ConfigurationTabsClasses
}

export function useConfigurationTabs({
  activeTab,
  onChange,
  classes
}: UseConfigurationTabsParams) {
  const getTabClassName = useCallback(
    (tab: DashboardConfigurationTab) =>
      [
        classes.tabButton,
        activeTab === tab ? classes.tabButtonActive : null
      ]
        .filter(Boolean)
        .join(' '),
    [activeTab, classes.tabButton, classes.tabButtonActive]
  )

  const tabs = useMemo(
    () =>
      DASHBOARD_CONFIGURATION_TABS.map((tab) => ({
        id: tab,
        label: DASHBOARD_CONFIGURATION_LABELS.tabs[tab],
        className: getTabClassName(tab),
        handleClick: () => onChange(tab)
      })),
    [getTabClassName, onChange]
  )

  return {
    tabs
  }
}
