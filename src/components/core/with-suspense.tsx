import { Suspense, type ReactNode } from 'react';

export default function withSuspense<TProps extends object>(
  Component: (props: TProps) => ReactNode | Promise<ReactNode>,
  fallback: ReactNode
) {
  return function SuspendedComponent(props: TProps) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}
