'use client';

import { MantineProvider } from '@mantine/core';
import type { CSSVariablesResolver } from '@mantine/core';
import type { ReactNode } from 'react';
import { theme } from '@/theme';

const cssVariablesResolver: CSSVariablesResolver = (mantineTheme) => ({
  variables: mantineTheme.other.cssVariables,
  light: {},
  dark: {}
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      theme={theme}
      forceColorScheme='light'
      cssVariablesResolver={cssVariablesResolver}
    >
      {children}
    </MantineProvider>
  );
}
