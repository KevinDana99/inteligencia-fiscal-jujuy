import '@mantine/core/styles.css'
import './globals.css'
import type { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import type { ReactNode } from 'react'
import { Providers } from '@/components/core/providers'
import localFont from 'next/font/local'

const dmSans = localFont({
  src: [
    {
      path: '../src/fonts/dm-sans/DMSans-Regular.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../src/fonts/dm-sans/DMSans-Medium.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../src/fonts/dm-sans/DMSans-Bold.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../src/fonts/dm-sans/DMSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal'
    }
  ],
  variable: '--font-dm-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Inteligencia Fiscal - Jujuy',
  description:
    'Base project generated with the create-frontend-architecture skill.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='es' {...mantineHtmlProps} className={dmSans.variable}>
      <head>
        <ColorSchemeScript defaultColorScheme='light' />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
