import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './globals.css'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import type { ReactNode } from 'react'
import { Providers } from '@/components/core/providers'
import { APP_VIEWPORT, DEFAULT_METADATA } from '@/constants/metadata'
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

export const metadata = DEFAULT_METADATA
export const viewport = APP_VIEWPORT

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='es' {...mantineHtmlProps} className={dmSans.variable}>
      <head>
        <ColorSchemeScript defaultColorScheme='light' />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
