import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: 'FixKG',
  description: 'Сообщайте о городских проблемах и помогайте делать Бишкек удобнее.',
  generator: 'v0.app',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#F8FBFD' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" className={manrope.variable}><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
