import {
  DEFAULT_USER_ROLE_LABEL,
  USER_ROLE_LABELS,
  type UserRole
} from '@/constants'

export function getRoleLabel(userType: UserRole | null | undefined): string {
  if (!userType) {
    return DEFAULT_USER_ROLE_LABEL
  }

  return USER_ROLE_LABELS[userType] ?? DEFAULT_USER_ROLE_LABEL
}
