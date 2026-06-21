'use client';

import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import type { CSSVariablesResolver } from '@mantine/core';
import type { ReactNode } from 'react';
import { ToastViewport } from '@/components/core/toasts';
import { theme } from '@/theme';
import 'dayjs/locale/es';

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
      <ToastViewport />
      <DatesProvider settings={{ locale: 'es', firstDayOfWeek: 1 }}>
        {children}
      </DatesProvider>
    </MantineProvider>
  );
}
