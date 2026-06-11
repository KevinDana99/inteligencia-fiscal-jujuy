import { Suspense, type ReactNode } from 'react';
import PrivateLayoutFallback from './PrivateLayoutFallback';
import PrivateLayoutGate from './PrivateLayoutGate';

export default function PrivateLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<PrivateLayoutFallback />}>
      <PrivateLayoutGate>{children}</PrivateLayoutGate>
    </Suspense>
  );
}
