'use client'

import { Button, Group } from '@mantine/core'
import type { ReactNode } from 'react'
import { INTIMATION_TEMPLATE_LABELS } from '../../../constants'
import classes from './IntimationTemplateFooter.module.css'

type IntimationTemplateFooterProps = {
  footerActions?: ReactNode
  onConfirm?: () => void
  confirmLabel?: string
  confirmButtonClassName?: string
}

export function IntimationTemplateFooter({
  footerActions,
  onConfirm,
  confirmLabel = INTIMATION_TEMPLATE_LABELS.buttons.confirmChanges,
  confirmButtonClassName
}: IntimationTemplateFooterProps) {
  return (
    <Group justify='flex-end' className={classes.footerActions}>
      {footerActions ?? (
        <Button
          className={`${classes.primaryButton} ${confirmButtonClassName ?? ''}`.trim()}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      )}
    </Group>
  )
}
