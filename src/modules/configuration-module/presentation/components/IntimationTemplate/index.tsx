'use client'

import type { ReactNode } from 'react'
import type { IntimationTemplateController } from '../../hooks/intimation-template'
import { IntimationTemplateBodySection } from './IntimationTemplateBodySection'
import { IntimationTemplateColumnPickerModal } from './IntimationTemplateColumnPickerModal'
import { IntimationTemplateColumnsSection } from './IntimationTemplateColumnsSection'
import { IntimationTemplateFooter } from './IntimationTemplateFooter'
import { IntimationTemplateSubjectSection } from './IntimationTemplateSubjectSection'
import classes from './IntimationTemplate.module.css'

type IntimationTemplateProps = {
  controller: IntimationTemplateController
  footerActions?: ReactNode
}

export function IntimationTemplate({
  controller,
  footerActions
}: IntimationTemplateProps) {
  return (
    <div className={classes.root}>
      <IntimationTemplateSubjectSection controller={controller} />
      <IntimationTemplateBodySection controller={controller} />
      <IntimationTemplateColumnsSection controller={controller} />
      <IntimationTemplateFooter
        footerActions={footerActions}
      />
      <IntimationTemplateColumnPickerModal controller={controller} />
    </div>
  )
}
