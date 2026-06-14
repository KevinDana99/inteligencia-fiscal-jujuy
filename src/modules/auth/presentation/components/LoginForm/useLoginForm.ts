'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import {
  AUTH_SESSION_EXPIRED_NOTICE_COOKIE,
  AUTH_SESSION_EXPIRED_NOTICE_MESSAGE
} from '@/lib/auth/session-expired-notice'
import { signInAction } from '../../../data/actions'
import { INITIAL_SIGN_IN_STATE } from '../../hooks/mutations/signInState'
import {
  buildExpiredClientCookie,
  hasClientCookie
} from '../../utils/authLoginSuccessToastCookie'

export function useLoginForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [recoveryNoticeVisible, setRecoveryNoticeVisible] = useState(false)
  const [sessionExpiredNoticeVisible, setSessionExpiredNoticeVisible] =
    useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [state, formAction, isPending] = useActionState(
    signInAction,
    INITIAL_SIGN_IN_STATE
  )
  const error = state.message
  const hasError =
    state.success === false &&
    submitAttempted &&
    Boolean(error) &&
    !recoveryNoticeVisible &&
    !isPending

  useEffect(() => {
    if (!hasClientCookie(document.cookie, AUTH_SESSION_EXPIRED_NOTICE_COOKIE)) {
      return
    }

    document.cookie = buildExpiredClientCookie(
      AUTH_SESSION_EXPIRED_NOTICE_COOKIE,
      window.location.protocol === 'https:'
    )
    const noticeTimer = window.setTimeout(() => {
      setSessionExpiredNoticeVisible(true)
    }, 0)

    return () => window.clearTimeout(noticeTimer)
  }, [])

  const handleSubmitAttempt = () => {
    setRecoveryNoticeVisible(false)
    setSessionExpiredNoticeVisible(false)
    setSubmitAttempted(true)
  }

  const handleRecoveryNotice = () => {
    formRef.current?.reset()
    setRecoveryNoticeVisible(true)
    setSubmitAttempted(false)
  }

  const hideRecoveryNotice = () => {
    setRecoveryNoticeVisible(false)
    setSessionExpiredNoticeVisible(false)
    setSubmitAttempted(false)
  }

  return {
    isPending,
    error,
    formRef,
    formAction,
    recoveryNoticeVisible,
    sessionExpiredNoticeVisible,
    sessionExpiredNoticeMessage: AUTH_SESSION_EXPIRED_NOTICE_MESSAGE,
    hasError,
    handleSubmitAttempt,
    handleRecoveryNotice,
    hideRecoveryNotice
  }
}
