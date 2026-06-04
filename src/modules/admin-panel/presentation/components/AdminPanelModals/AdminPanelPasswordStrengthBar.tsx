import { useAdminPanelPasswordStrengthBar } from '../../hooks'
import classes from '../../styles/AdminPanel.module.css'

export function AdminPanelPasswordStrengthBar({
  passwordStrength,
  passwordColor
}: AdminPanelPasswordStrengthBarProps) {
  const { barStyle } = useAdminPanelPasswordStrengthBar({
    passwordStrength,
    passwordColor
  })

  return (
    <div className={classes.passwordStrengthRoot}>
      <div className={classes.passwordStrengthBar} style={barStyle} />
    </div>
  )
}

interface AdminPanelPasswordStrengthBarProps {
  passwordStrength: number
  passwordColor: string
}
