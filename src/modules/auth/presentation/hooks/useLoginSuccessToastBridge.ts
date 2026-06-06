'use client'

import { useEffect } from 'react'
import { toast } from '@/components/core/toasts'
import {
  AUTH_LOGIN_SUCCESS_TOAST_COOKIE,
  AUTH_LOGIN_SUCCESS_TOAST_DESCRIPTION
} from '@/lib/auth/login-success-toast'
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

    const normalizedDisplayName = displayName?.trim()

    toast.success({
      title: normalizedDisplayName
        ? `Hola, ${normalizedDisplayName}`
        : 'Sesión iniciada',
      description: AUTH_LOGIN_SUCCESS_TOAST_DESCRIPTION
    })
  }, [displayName])
}
