import type { ReactNode } from 'react'
import { IconCircleCheck } from '@tabler/icons-react'
import classes from './ToastContent.module.css'

export function ToastContent({ title, description, icon }: ToastContentProps) {
  return (
    <div className={classes.content}>
      <span className={classes.iconSlot}>
        {icon ?? (
          <IconCircleCheck
            aria-hidden
            className={classes.icon}
            stroke={1.8}
          />
        )}
      </span>

      <div className={classes.text}>
        <p className={classes.title}>{title}</p>
        {description ? (
          <p className={classes.description}>{description}</p>
        ) : null}
      </div>
    </div>
  )
}

interface ToastContentProps {
  title: string
  description?: string
  icon?: ReactNode
}
