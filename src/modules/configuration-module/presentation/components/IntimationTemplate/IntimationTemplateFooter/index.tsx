'use client'

import { Button, Group } from '@mantine/core'
import type { ReactNode } from 'react'
import { useIntimationTemplateFooter } from '../../../hooks/intimation-template'
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
  confirmLabel,
  confirmButtonClassName
}: IntimationTemplateFooterProps) {
  const footer = useIntimationTemplateFooter({
    footerActions,
    onConfirm,
    confirmLabel,
    confirmButtonClassName,
    classes
  })

  return (
    <Group justify='flex-end' className={classes.footerActions}>
      <div className={classes.customActions} hidden={footer.customActionsHidden}>
        {footer.footerActions}
      </div>
      <Button
        hidden={footer.defaultButtonHidden}
        className={footer.confirmButton.className}
        onClick={footer.confirmButton.onClick}
      >
        {footer.confirmButton.label}
      </Button>
    </Group>
  )
}
