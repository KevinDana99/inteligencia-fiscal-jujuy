import { Suspense } from 'react'
import { connection } from 'next/server'
import { PAGE_METADATA } from '@/constants/metadata'
import { isMockAuthEnabled } from '@/lib/auth/is-mock-auth-enabled'
import LoginForm from '@/modules/auth/presentation/components/LoginForm'

export const metadata = PAGE_METADATA.login

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}

async function LoginPageContent() {
  await connection()

  return <LoginForm mockAuthEnabled={isMockAuthEnabled()} />
}
