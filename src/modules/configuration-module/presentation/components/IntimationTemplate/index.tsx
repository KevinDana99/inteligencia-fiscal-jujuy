'use client'

import type { ReactNode } from 'react'
import type { IntimationTemplateController } from './useIntimationTemplate'
import { INTIMATION_TEMPLATE_LABELS } from '../../constants'
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
  footerActions?: ReactNode
}

export function IntimationTemplate({
  controller,
  confirmLabel = INTIMATION_TEMPLATE_LABELS.buttons.confirmChanges,
  confirmButtonClassName,
  onConfirm,
  footerActions
}: IntimationTemplateProps) {
  return (
    <div className={classes.root}>
      <IntimationTemplateSubjectSection controller={controller} />
      <IntimationTemplateBodySection controller={controller} />
      <IntimationTemplateColumnsSection controller={controller} />
      <IntimationTemplateFooter
        footerActions={footerActions}
        onConfirm={onConfirm}
        confirmLabel={confirmLabel}
        confirmButtonClassName={confirmButtonClassName}
      />
      <IntimationTemplateColumnPickerModal controller={controller} />
    </div>
  )
}
