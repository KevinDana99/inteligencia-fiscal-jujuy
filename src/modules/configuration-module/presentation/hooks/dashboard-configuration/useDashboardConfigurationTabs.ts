'use client'

import { useCallback, useState } from 'react'
import { DEFAULT_DASHBOARD_CONFIGURATION_TAB } from '../../constants'
import type { DashboardConfigurationTab } from '../useDashboardConfiguration'

type DashboardConfigurationTabsState = {
  activeTab: DashboardConfigurationTab
}

export function useDashboardConfigurationTabs() {
  const [state, setState] = useState<DashboardConfigurationTabsState>({
    activeTab: DEFAULT_DASHBOARD_CONFIGURATION_TAB
  })

  const updateTab = useCallback((tab: DashboardConfigurationTab) => {
    setState((current) => ({
      ...current,
      activeTab: tab
    }))
  }, [])

  return {
    state,
    activeTab: state.activeTab,
    isIntimationTab: state.activeTab === DEFAULT_DASHBOARD_CONFIGURATION_TAB,
    updateTab
  }
}
