import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelUserFormLabel({
  label,
  required = false
}: AdminPanelUserFormLabelProps) {
  return (
    <span className={classes.modalLabel}>
      {label}
      {required ? <span className={classes.modalRequired}>*</span> : null}
    </span>
  )
}

interface AdminPanelUserFormLabelProps {
  label: string
  required?: boolean
}
