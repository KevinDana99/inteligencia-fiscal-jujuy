'use client'

import { useLoginSuccessToastBridge } from '../../hooks/useLoginSuccessToastBridge'

export function AuthLoginSuccessToastBridge({
  displayName
}: AuthLoginSuccessToastBridgeProps) {
  useLoginSuccessToastBridge(displayName)

  return null
}

interface AuthLoginSuccessToastBridgeProps {
  displayName?: string | null
}
