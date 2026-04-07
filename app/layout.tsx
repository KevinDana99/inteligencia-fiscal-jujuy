import '@mantine/core/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import type { ReactNode } from 'react';
import { Providers } from '@/components/core/providers';

export const metadata: Metadata = {
  title: 'Catalog Showcase',
  description: 'Base project generated with the create-frontend-architecture skill.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
