import { IconEye, IconEyeOff } from '@tabler/icons-react'

export function AdminPanelUserPasswordVisibilityIcon({
  reveal
}: AdminPanelUserPasswordVisibilityIconProps) {
  return reveal ? (
    <IconEyeOff size={18} stroke={1.8} />
  ) : (
    <IconEye size={18} stroke={1.8} />
  )
}

interface AdminPanelUserPasswordVisibilityIconProps {
  reveal: boolean
}
