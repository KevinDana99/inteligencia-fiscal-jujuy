'use client'

import { DASHBOARD_CONFIGURATION_LABELS } from '../../constants'

type ConfigurationSuccessModalClasses = Record<string, string>

type UseConfigurationSuccessModalParams = {
  opened: boolean
  onClose: () => void
  classes: ConfigurationSuccessModalClasses
}

export function useConfigurationSuccessModal({
  opened,
  onClose,
  classes
}: UseConfigurationSuccessModalParams) {
  return {
    modal: {
      opened,
      onClose,
      title: DASHBOARD_CONFIGURATION_LABELS.successModal.title,
      classNames: {
        overlay: classes.modalOverlay,
        content: classes.modalContent,
        header: classes.modalHeader,
        body: classes.modalBody,
        title: classes.modalTitle,
        close: classes.modalClose
      }
    },
    message: DASHBOARD_CONFIGURATION_LABELS.successModal.message
  }
}
