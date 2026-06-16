'use client'

import type { ReactNode } from 'react'
import { INTIMATION_TEMPLATE_LABELS } from '../../constants'

type IntimationTemplateFooterClasses = Record<string, string>

type UseIntimationTemplateFooterParams = {
  footerActions?: ReactNode
  onConfirm?: () => void
  isConfirmPending?: boolean
  confirmLabel?: string
  confirmButtonClassName?: string
  classes: IntimationTemplateFooterClasses
}

export function useIntimationTemplateFooter({
  footerActions,
  onConfirm,
  isConfirmPending = false,
  confirmLabel = INTIMATION_TEMPLATE_LABELS.buttons.confirmChanges,
  confirmButtonClassName,
  classes
}: UseIntimationTemplateFooterParams) {
  return {
    footerActions,
    customActionsHidden: !footerActions,
    defaultButtonHidden: Boolean(footerActions),
    confirmButton: {
      label: confirmLabel,
      onClick: onConfirm,
      loading: isConfirmPending,
      className: [classes.primaryButton, confirmButtonClassName]
        .filter(Boolean)
        .join(' ')
    }
  }
}
