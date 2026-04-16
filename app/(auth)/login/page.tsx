import { Suspense } from 'react';
import LoginPageGate from './LoginPageGate';

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
