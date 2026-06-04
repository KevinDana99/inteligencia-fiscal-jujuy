'use client'

import { useMemo } from 'react'

export function useAdminPanelPasswordStrengthBar({
  passwordStrength,
  passwordColor
}: UseAdminPanelPasswordStrengthBarOptions) {
  const barStyle = useMemo(
    () => ({
      width: `${passwordStrength * 20}%`,
      background: `var(--mantine-color-${passwordColor}-${passwordColor === 'teal' ? 6 : 5})`
    }),
    [passwordColor, passwordStrength]
  )

  return {
    barStyle
  }
}

interface UseAdminPanelPasswordStrengthBarOptions {
  passwordStrength: number
  passwordColor: string
}
