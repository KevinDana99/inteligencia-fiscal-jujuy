'use client'

import type { ReactNode } from 'react'
import { INTIMATION_TEMPLATE_LABELS } from '../../constants'
import type { IntimationTemplateController } from '../../hooks/intimation-template'
import { IntimationTemplateBodySection } from './IntimationTemplateBodySection'
import { IntimationTemplateColumnPickerModal } from './IntimationTemplateColumnPickerModal'
import { IntimationTemplateColumnsSection } from './IntimationTemplateColumnsSection'
import { IntimationTemplateFooter } from './IntimationTemplateFooter'
import { IntimationTemplateSubjectSection } from './IntimationTemplateSubjectSection'
import classes from './IntimationTemplate.module.css'

type IntimationTemplateProps = {
  controller: IntimationTemplateController
  confirmLabel?: string
  confirmButtonClassName?: string
  onConfirm?: () => void
  isConfirmPending?: boolean
  footerActions?: ReactNode
}

export function IntimationTemplate({
  controller,
  confirmLabel = INTIMATION_TEMPLATE_LABELS.buttons.confirmChanges,
  confirmButtonClassName,
  onConfirm,
  isConfirmPending,
  footerActions
}: IntimationTemplateProps) {
  const handleConfirm = () => {
    if (!controller.validate()) {
      return
    }

    onConfirm?.()
  }

  return (
    <div className={classes.root}>
      <IntimationTemplateSubjectSection controller={controller} />
      <IntimationTemplateBodySection controller={controller} />
      <IntimationTemplateColumnsSection controller={controller} />
      <IntimationTemplateFooter
        footerActions={footerActions}
        onConfirm={handleConfirm}
        isConfirmPending={isConfirmPending}
        confirmLabel={confirmLabel}
        confirmButtonClassName={confirmButtonClassName}
      />
      <IntimationTemplateColumnPickerModal controller={controller} />
    </div>
  )
}
