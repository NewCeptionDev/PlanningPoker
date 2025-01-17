import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'

const jetbrains = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Planning Poker',
  description: 'Simple Planning Poker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <link
        rel='icon'
        href='/favicon-32x32.png'
        sizes='32x32'
        data-testid='favicon-32'
      />
      <link
        rel='icon'
        href='/favicon-16x16.png'
        sizes='16x16'
        data-testid='favicon-16'
      />
      <link
        rel='apple-touch-icon'
        href='/favicon-16x16.png'
        sizes='16x16'
        data-testid='favicon-apple-16'
      />
      <link
        rel='apple-touch-icon'
        href='/favicon-32x32.png'
        sizes='32x32'
        data-testid='favicon-apple-32'
      />
      <body
        className={jetbrains.className}
        data-testid='body'
      >
        <ThemeProvider
          attribute='class'
          data-testid='theme-provider'
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
