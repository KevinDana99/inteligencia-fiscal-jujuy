import classes from './ToastContent.module.css'
import { getToastIconByStatus } from '../utils'
import { ToastContentProps } from '../types'

export function ToastContent({
  title,
  description,
  status = 'Success'
}: ToastContentProps) {
  const classMapper = {
    Success: {
      content: classes.contentSuccess
    },
    Danger: {
      content: classes.contentDanger
    },
    Info: {
      content: classes.contentInfo
    }
  }[status]
  return (
    <div className={classMapper.content}>
      <span>{getToastIconByStatus(status)}</span>
      <div className={classes.text}>
        <p className={classes.title}>{title}</p>
        {description ? (
          <p className={classes.description}>{description}</p>
        ) : null}
      </div>
    </div>
  )
}
