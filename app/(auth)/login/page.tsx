import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginPageGate from './LoginPageGate';

export const metadata: Metadata = {
  title: 'Login'
};

export default function LoginPage({
  searchParams
}: {
  searchParams: Promise<{
    mode?: string;
  }>;
}) {
  return (
    <Suspense fallback={null}>
      <LoginPageGate searchParams={searchParams} />
    </Suspense>
  );
}
