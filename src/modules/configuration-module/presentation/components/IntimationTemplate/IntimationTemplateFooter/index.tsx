'use client'

import { Button, Group } from '@mantine/core'
import type { ReactNode } from 'react'
import { useIntimationTemplateFooter } from '../../../hooks/intimation-template'
import classes from './IntimationTemplateFooter.module.css'

type IntimationTemplateFooterProps = {
  footerActions?: ReactNode
  onConfirm?: () => void
  isConfirmPending?: boolean
  confirmLabel?: string
  confirmButtonClassName?: string
}

export function IntimationTemplateFooter({
  footerActions,
  onConfirm,
  isConfirmPending,
  confirmLabel,
  confirmButtonClassName
}: IntimationTemplateFooterProps) {
  const footer = useIntimationTemplateFooter({
    footerActions,
    onConfirm,
    isConfirmPending,
    confirmLabel,
    confirmButtonClassName,
    classes
  })

  return (
    <Group justify='flex-end' className={classes.footerActions}>
      {footer.customActionsHidden ? null : (
        <div className={classes.customActions}>{footer.footerActions}</div>
      )}
      {footer.defaultButtonHidden ? null : (
        <Button
          className={footer.confirmButton.className}
          onClick={footer.confirmButton.onClick}
          loading={footer.confirmButton.loading}
        >
          {footer.confirmButton.label}
        </Button>
      )}
    </Group>
  )
}
