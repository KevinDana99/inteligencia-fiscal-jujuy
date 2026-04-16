import { Suspense } from 'react';
import { Container } from '@mantine/core';
import LoginPageGate from './LoginPageGate';

export default function LoginPage({
  searchParams
}: {
  searchParams: Promise<{
    mode?: string;
  }>;
}) {
  return (
    <Container size="xs" py={80}>
      <Suspense fallback={null}>
        <LoginPageGate searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
