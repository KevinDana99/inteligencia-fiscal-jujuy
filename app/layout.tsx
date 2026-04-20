import '@mantine/core/styles.css'
import './globals.css'
import type { Metadata } from 'next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import type { ReactNode } from 'react'
import { Providers } from '@/components/core/providers'
import { DM_Sans } from 'next/font/google'
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Catalog Showcase',
  description:
    'Base project generated with the create-frontend-architecture skill.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='es' {...mantineHtmlProps} className={dmSans.variable}>
      <head>
        <ColorSchemeScript defaultColorScheme='light' />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
