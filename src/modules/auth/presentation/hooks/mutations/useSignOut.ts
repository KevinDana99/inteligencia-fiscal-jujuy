'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOutAction } from '../../../data/actions'

export function useSignOut() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const signOut = () => {
    startTransition(() => {
      void signOutAction().then(() => {
        router.replace('/login')
        router.refresh()
      })
    })
  }

  return { signOut, isPending }
}
