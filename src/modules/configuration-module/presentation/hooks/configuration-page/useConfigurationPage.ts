'use client'

import { useDashboardConfiguration } from '../useDashboardConfiguration'
import {
  useIntimationTemplate,
  useSaveIntimationConfiguration
} from '../intimation-template'

export function useConfigurationPage() {
  const dashboardConfiguration = useDashboardConfiguration()
  const intimationTemplate = useIntimationTemplate()
  const intimationSave = useSaveIntimationConfiguration({
    onSuccess: dashboardConfiguration.confirmChanges
  })

  return {
    tabs: {
      activeTab: dashboardConfiguration.activeTab,
      onChange: dashboardConfiguration.updateTab
    },
    content: {
      intimation: {
        hidden: !dashboardConfiguration.isIntimationTab,
        controller: intimationTemplate,
        onConfirm: intimationSave.saveIntimationConfiguration,
        isConfirmPending: intimationSave.isSavePending
      },
      report: {
        hidden: dashboardConfiguration.isIntimationTab,
        informe: dashboardConfiguration.informe,
        onChange: dashboardConfiguration.updateInforme,
        onConfirm: dashboardConfiguration.confirmChanges
      }
    },
    successModal: {
      opened: dashboardConfiguration.successOpened,
      onClose: dashboardConfiguration.closeSuccess
    }
  }
}

export type ConfigurationPageController = ReturnType<typeof useConfigurationPage>
