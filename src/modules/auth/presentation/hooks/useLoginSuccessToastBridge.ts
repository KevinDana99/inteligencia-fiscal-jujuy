'use client'

import { useEffect } from 'react'
import { TOAST_DASHBOARD_MESSAGES, toast } from '@/components/core/toasts'
import { AUTH_LOGIN_SUCCESS_TOAST_COOKIE } from '@/lib/auth/login-success-toast'
import {
  buildExpiredClientCookie,
  hasClientCookie
} from '../utils/authLoginSuccessToastCookie'

export function useLoginSuccessToastBridge(displayName?: string | null) {
  useEffect(() => {
    if (!hasClientCookie(document.cookie, AUTH_LOGIN_SUCCESS_TOAST_COOKIE)) {
      return
    }

    document.cookie = buildExpiredClientCookie(
      AUTH_LOGIN_SUCCESS_TOAST_COOKIE,
      window.location.protocol === 'https:'
    )

    const normalizedDisplayName = displayName?.trim() || 'Usuario'

    toast.show(TOAST_DASHBOARD_MESSAGES.DASHBOARD_WELCOME_SUCCESS, {
      name: normalizedDisplayName
    })
  }, [displayName])
}
