import { Suspense } from 'react'
import type { Metadata } from 'next'
import { connection } from 'next/server'
import LoginForm from '@/modules/auth/presentation/components/LoginForm'

export const metadata: Metadata = {
  title: 'IF - Login'
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}

async function LoginPageContent() {
  await connection()

  return <LoginForm />
}
