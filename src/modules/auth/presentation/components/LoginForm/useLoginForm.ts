'use client'

import { useActionState, useRef, useState } from 'react'
import { signInAction } from '../../../data/actions'
import { INITIAL_SIGN_IN_STATE } from '../../hooks/mutations/signInState'

export function useLoginForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [recoveryNoticeVisible, setRecoveryNoticeVisible] = useState(false)
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

  const handleSubmitAttempt = () => {
    setRecoveryNoticeVisible(false)
    setSubmitAttempted(true)
  }

  const handleRecoveryNotice = () => {
    formRef.current?.reset()
    setRecoveryNoticeVisible(true)
    setSubmitAttempted(false)
  }

  const hideRecoveryNotice = () => {
    setRecoveryNoticeVisible(false)
    setSubmitAttempted(false)
  }

  return {
    isPending,
    error,
    formRef,
    formAction,
    recoveryNoticeVisible,
    hasError,
    handleSubmitAttempt,
    handleRecoveryNotice,
    hideRecoveryNotice
  }
}
