'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Portfolio tabs. Deliberately no login, no POS links.
const TABS = [
  { href: '/', label: 'Overview', exact: true },
  { href: '/brand/', label: 'Brand Book' },
  { href: '/khao-hom/', label: 'Khao Hom' },
  { href: '/ui-kit/', label: 'UI Kit' },
]

export default function Tabs() {
  const path = usePathname() || '/'
  return (
    <nav aria-label="Portfolio sections" style={{
      position: 'sticky', top: 0, zIndex: 20, background: '#0C2B18', display: 'flex', flexWrap: 'wrap', gap: 4,
      paddingBlock: 8, paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))',
      fontFamily: 'var(--font-mono), monospace',
    }}>
      <span style={{ color: '#C9EC6B', fontSize: 12, letterSpacing: '.16em', alignSelf: 'center', marginRight: 12 }}>JAOSAMUT · CASE STUDY</span>
      {TABS.map((t) => {
        const on = t.exact ? path === '/' : path.startsWith(t.href.replace(/\/$/, ''))
        return (
          <Link key={t.href} href={t.href} aria-current={on ? 'page' : undefined} style={{
            color: on ? '#0C2B18' : '#F1F4EC', background: on ? '#C9EC6B' : 'transparent',
            textDecoration: 'none', fontSize: 13, letterSpacing: '.06em', padding: '6px 12px', borderRadius: 999,
          }}>{t.label}</Link>
        )
      })}
    </nav>
  )
}
