import type { ReactNode } from 'react';
import { connection } from 'next/server';
import { requireServerAuthSession } from '@/lib/auth/require-session';

export default async function PrivateLayoutGate({
  children
}: {
  children: ReactNode;
}) {
  await connection();
  await requireServerAuthSession();

  return children;
}
