'use client'

import { useEffect } from 'react'
import {
  TOAST_DASHBOARD_MESSAGES,
  toast,
  type ToastMessageType
} from '@/components/core/toasts'
import { AUTH_LOGIN_SUCCESS_TOAST_COOKIE } from '@/lib/auth/login-success-toast'
import {
  buildExpiredClientCookie,
  hasClientCookie
} from '../utils/authLoginSuccessToastCookie'

export function useLoginSuccessToastBridge(
  displayName?: string | null,
  message: ToastMessageType = TOAST_DASHBOARD_MESSAGES.DASHBOARD_WELCOME_SUCCESS
) {
  useEffect(() => {
    if (!hasClientCookie(document.cookie, AUTH_LOGIN_SUCCESS_TOAST_COOKIE)) {
      return
    }

    document.cookie = buildExpiredClientCookie(
      AUTH_LOGIN_SUCCESS_TOAST_COOKIE,
      window.location.protocol === 'https:'
    )

    const normalizedDisplayName = displayName?.trim() || 'Usuario'

    toast.show(message, {
      name: normalizedDisplayName
    })
  }, [displayName, message])
}
