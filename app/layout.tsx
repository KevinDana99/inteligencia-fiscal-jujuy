import '@mantine/core/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import type { ReactNode } from 'react';
import { Providers } from '@/components/core/providers';

const dmSans = localFont({
  src: [
    {
      path: '../public/fonts/dm-sans/DMSans-Regular.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../public/fonts/dm-sans/DMSans-Italic.ttf',
      weight: '400',
      style: 'italic'
    },
    {
      path: '../public/fonts/dm-sans/DMSans-Medium.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../public/fonts/dm-sans/DMSans-MediumItalic.ttf',
      weight: '500',
      style: 'italic'
    },
    {
      path: '../public/fonts/dm-sans/DMSans-Bold.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../public/fonts/dm-sans/DMSans-BoldItalic.ttf',
      weight: '700',
      style: 'italic'
    }
  ],
  display: 'swap',
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: 'Catalog Showcase',
  description: 'Base project generated with the create-frontend-architecture skill.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" {...mantineHtmlProps} className={dmSans.variable}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
