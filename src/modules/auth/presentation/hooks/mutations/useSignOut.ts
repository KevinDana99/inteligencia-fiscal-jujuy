'use client'

import { useTransition } from 'react'
import { signOutAction } from '../../../data/actions'

function isNextRedirectError(error: unknown): boolean {
  if (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof error.digest === 'string' &&
    error.digest.startsWith('NEXT_REDIRECT')
  ) {
    return true
  }

  if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    return true
  }

  if (typeof error === 'string' && error === 'NEXT_REDIRECT') {
    return true
  }

  return String(error).includes('NEXT_REDIRECT')
}

export function useSignOut() {
  const [isPending, startTransition] = useTransition()

  const signOut = () => {
    startTransition(() => {
      void signOutAction().catch((error) => {
        if (isNextRedirectError(error)) {
          return
        }

        throw error
      })
    })
  }

  return { signOut, isPending }
}
