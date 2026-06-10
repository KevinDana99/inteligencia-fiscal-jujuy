'use client'

import { useDashboardConfiguration } from '../useDashboardConfiguration'
import { useIntimationTemplate } from '../intimation-template'

export function useConfigurationPage() {
  const intimationTemplate = useIntimationTemplate()
  const dashboardConfiguration = useDashboardConfiguration()

  return {
    tabs: {
      activeTab: dashboardConfiguration.activeTab,
      onChange: dashboardConfiguration.updateTab
    },
    content: {
      intimation: {
        hidden: !dashboardConfiguration.isIntimationTab,
        controller: intimationTemplate
      },
      report: {
        hidden: dashboardConfiguration.isIntimationTab,
        informe: dashboardConfiguration.informe,
        onChange: dashboardConfiguration.updateInforme
      }
    }
  }
}

export type ConfigurationPageController = ReturnType<typeof useConfigurationPage>
