'use client'

import { Group } from '@mantine/core'
import type { ReactNode } from 'react'
import classes from './IntimationTemplateFooter.module.css'

type IntimationTemplateFooterProps = {
  footerActions?: ReactNode
}

export function IntimationTemplateFooter({
  footerActions
}: IntimationTemplateFooterProps) {
  if (!footerActions) {
    return null
  }

  return (
    <Group justify='flex-end' className={classes.footerActions}>
      <div className={classes.customActions}>{footerActions}</div>
    </Group>
  )
}
