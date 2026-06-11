'use client'

import type { ToastMessageType } from '@/components/core/toasts'
import { useLoginSuccessToastBridge } from '../../hooks/useLoginSuccessToastBridge'

export function AuthLoginSuccessToastBridge({
  displayName,
  message
}: AuthLoginSuccessToastBridgeProps) {
  useLoginSuccessToastBridge(displayName, message)

  return null
}

interface AuthLoginSuccessToastBridgeProps {
  displayName?: string | null
  message?: ToastMessageType
}
