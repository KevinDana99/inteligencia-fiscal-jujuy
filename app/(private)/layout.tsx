import { Suspense, type ReactNode } from 'react';
import PrivateLayoutGate from './PrivateLayoutGate';

export default function PrivateLayout({
  children
}: {
  children: ReactNode;
}) {
  return <Suspense fallback={null}><PrivateLayoutGate>{children}</PrivateLayoutGate></Suspense>;
}
