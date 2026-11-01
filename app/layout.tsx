import { Archivo_Black, IBM_Plex_Sans, IBM_Plex_Mono, Kanit } from 'next/font/google'
import Tabs from './components/Tabs'

// Public portfolio. Static pages only: no login, no POS, no data.
const display = Archivo_Black({ subsets: ['latin'], weight: '400', variable: '--font-display' })
const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-sans' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })
const thai = Kanit({ subsets: ['thai', 'latin'], weight: '600', variable: '--font-thai' })

export const metadata = {
  title: 'Jaosamut — Brand Identity, Mascot & UI Kit · Rif-at Wanwang',
  description: 'Case study: brand identity, the Khao Hom mascot character sheet and the UI kit for JAOSAMUT จ้าวสมุทร, a Thai seafood house in Cyberjaya. Designed by Rif-at Wanwang.',
  icons: { icon: '/brand/png/jaosamut-favicon-32.webp', apple: '/brand/png/jaosamut-app-icon-180.webp' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} ${thai.variable}`}>
      <body style={{ margin: 0, background: '#FFFFFF' }}><Tabs />{children}</body>
    </html>
  )
}
