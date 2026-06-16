'use client'

import { useConfig } from './useConfig'
import {
  useDashboardConfigurationReport,
  useSaveReportConfiguration,
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
  const reportSave = useSaveReportConfiguration({
    onSuccess: success.confirmChanges
  })

  return {
    state: tabs.state,
    informe: report.informe,
    reportErrors: report.errors,
    activeTab: tabs.activeTab,
    isIntimationTab: tabs.isIntimationTab,
    successOpened: success.successOpened,
    isReportSavePending: reportSave.isSavePending,
    updateTab: tabs.updateTab,
    updateInforme: report.updateInforme,
    validateInforme: report.validateInforme,
    saveReportConfiguration: reportSave.saveReportConfiguration,
    confirmChanges: success.confirmChanges,
    closeSuccess: success.closeSuccess
  }
}
