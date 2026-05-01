import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'optiondeck — options strategy payoff visualizer',
  description:
    'Add option legs, see your payoff diagram instantly. Know your breakeven, max profit, and max loss before you place the trade.',
  openGraph: {
    title: 'optiondeck',
    description: 'Options strategy payoff visualizer. No login. No broker.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
        {children}
      </body>
    </html>
  )
}
