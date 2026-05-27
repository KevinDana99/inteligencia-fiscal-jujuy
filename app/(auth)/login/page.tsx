import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginForm from '@/modules/auth/presentation/components/LoginForm'

export const metadata: Metadata = {
  title: 'IF - Login'
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
