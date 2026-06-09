'use client'

import { useConfig } from './useConfig'
import {
  useDashboardConfigurationReport,
  useDashboardConfigurationSuccess,
  useDashboardConfigurationTabs
} from './dashboard-configuration'
import type { DASHBOARD_CONFIGURATION_TABS } from '../constants'

export type DashboardConfigurationTab =
  (typeof DASHBOARD_CONFIGURATION_TABS)[number]

export function useDashboardConfiguration() {
  const { configuration, updateConfig } = useConfig()
  const tabs = useDashboardConfigurationTabs()
  const report = useDashboardConfigurationReport({
    informe: configuration.informe,
    updateConfig
  })
  const success = useDashboardConfigurationSuccess()

  return {
    state: tabs.state,
    informe: report.informe,
    activeTab: tabs.activeTab,
    isIntimationTab: tabs.isIntimationTab,
    updateTab: tabs.updateTab,
    updateInforme: report.updateInforme,
    confirmChanges: success.confirmChanges
  }
}
