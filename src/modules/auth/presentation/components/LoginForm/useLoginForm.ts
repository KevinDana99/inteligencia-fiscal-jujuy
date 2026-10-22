'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import {
  AUTH_SESSION_EXPIRED_NOTICE_COOKIE,
  AUTH_SESSION_EXPIRED_NOTICE_MESSAGE
} from '@/lib/auth/session-expired-notice'
import { signInAction } from '../../../data/actions/commands/signInAction'
import { INITIAL_SIGN_IN_STATE } from '../../hooks/mutations/signInState'
import {
  buildExpiredClientCookie,
  hasClientCookie
} from '../../utils/authLoginSuccessToastCookie'

type LoginNotice = 'none' | 'recovery' | 'session-expired'

export function useLoginForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [activeNotice, setActiveNotice] = useState<LoginNotice>('none')
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [state, formAction, isPending] = useActionState(
    signInAction,
    INITIAL_SIGN_IN_STATE
  )
  const error = state.message
  const recoveryNoticeVisible = activeNotice === 'recovery'
  const sessionExpiredNoticeVisible = activeNotice === 'session-expired'
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
      setActiveNotice((currentNotice) =>
        currentNotice === 'recovery' ? currentNotice : 'session-expired'
      )
    }, 0)

    return () => window.clearTimeout(noticeTimer)
  }, [])

  const handleSubmitAttempt = () => {
    setActiveNotice('none')
    setSubmitAttempted(true)
  }

  const handleRecoveryNotice = () => {
    formRef.current?.reset()
    setActiveNotice('recovery')
    setSubmitAttempted(false)
  }

  const hideRecoveryNotice = () => {
    setActiveNotice('none')
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
