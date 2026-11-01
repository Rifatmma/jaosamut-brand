import Link from 'next/link'

// Case-study overview. Static: everything here is public portfolio material.
const C = { ink: '#0C2B18', soft: '#4A5E51', green: '#33A02C', deep: '#23751D', mist: '#EEF5E6', lime: '#C9EC6B', line: '#DCE6D3' }

const WORK = [
  { href: '/brand/', title: 'Brand Book', img: '/brand/jaosamut-primary-green.webp', fit: 'contain',
    text: '15 sections: the wok-and-wave symbol, the wok "O" wordmark, Fresh Market palette, type, voice, motion, pattern, uniform and takeaway.' },
  { href: '/khao-hom/', title: 'Khao Hom ข้าวหอม', img: '/khao-hom/img/turnaround/01-front.webp', fit: 'contain',
    text: 'The mascot character sheet, built for AI video: turnaround, 20 expressions, lip-sync mouths, poses, festive outfits, props and voice.' },
  { href: '/ui-kit/', title: 'UI Kit', img: '/brand/mockups/jaosamut-takeaway-set.jpg', fit: 'cover',
    text: 'The design system for the ordering app and POS: tokens, type, dish rows, option sheets, steppers, totals and states.' },
]

const ROLE = ['Brand strategy & positioning', 'Logo system & wordmark', 'Colour, type & voice', 'Mascot design & character sheet', 'UI kit & product design', 'Packaging & uniform direction']

export default function Overview() {
  const wrap: React.CSSProperties = { maxWidth: 1120, margin: '0 auto', paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }
  const mono: React.CSSProperties = { fontFamily: 'var(--font-mono), monospace', fontSize: 11.5, letterSpacing: '.16em', textTransform: 'uppercase' }
  return (
    <main style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif', color: C.ink, background: '#FFFFFF', lineHeight: 1.55 }}>
      <header style={{ background: C.green, color: '#FFFFFF' }}>
        <div style={{ ...wrap, paddingBlock: 'clamp(56px, 10vh, 120px)', display: 'grid', gap: 20 }}>
          <span style={{ ...mono, color: C.lime }}>Case study · Brand identity &amp; product design</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/jaosamut-primary-white-on-green.webp" alt="JAOSAMUT จ้าวสมุทร Thai Seafood" style={{ width: 'min(860px, 100%)', height: 'auto' }} />
          <p style={{ fontSize: 'clamp(18px, 2.2vw, 23px)', maxWidth: '44ch', margin: 0 }}>
            A fresh identity, a mascot and a product design system for a Thai seafood house in Cyberjaya, Malaysia.
          </p>
          <p style={{ ...mono, margin: 0, color: '#FFFFFF' }}>Designed by Rif-at Wanwang · 2026</p>
        </div>
      </header>

      <section style={{ ...wrap, paddingBlock: 'clamp(48px, 8vh, 96px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
        <div>
          <p style={{ ...mono, color: C.deep, margin: '0 0 8px' }}>The brief</p>
          <p style={{ margin: 0, fontSize: 17 }}>
            Jaosamut, จ้าวสมุทร, means &ldquo;King of the Ocean&rdquo;. The restaurant needed to stop looking like every other Thai
            restaurant and start looking like what it is: Thai seafood, cooked by Thai hands, at an everyday price.
          </p>
        </div>
        <div>
          <p style={{ ...mono, color: C.deep, margin: '0 0 8px' }}>The idea</p>
          <p style={{ margin: 0, fontSize: 17 }}>
            One mark, two truths: a chef&apos;s hand tossing a wok on high heat, its flames curling like breaking waves.
            The wok returns as the &ldquo;O&rdquo; in the wordmark, and Khao Hom, the kitchen cat, carries the warmth into video and the app.
          </p>
        </div>
        <div>
          <p style={{ ...mono, color: C.deep, margin: '0 0 8px' }}>My role</p>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 3, fontSize: 15.5, color: C.soft }}>
            {ROLE.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      </section>

      <section style={{ ...wrap, paddingBottom: 'clamp(56px, 10vh, 120px)' }}>
        <p style={{ ...mono, color: C.deep, margin: '0 0 14px' }}>The work</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {WORK.map((w) => (
            <Link key={w.href} href={w.href} style={{ color: 'inherit', textDecoration: 'none', border: `1px solid ${C.line}`, display: 'grid', gridTemplateRows: 'auto 1fr' }}>
              <div style={{ background: C.mist, aspectRatio: '4 / 3', display: 'grid', placeItems: 'center', overflow: 'hidden', padding: w.fit === 'contain' ? 24 : 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.img} alt="" style={{ width: '100%', height: '100%', objectFit: w.fit as 'contain' | 'cover' }} />
              </div>
              <div style={{ padding: 18, display: 'grid', gap: 6, alignContent: 'start' }}>
                <h2 style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 400, fontSize: 24, letterSpacing: '-.015em', margin: 0 }}>{w.title}</h2>
                <p style={{ margin: 0, color: C.soft, fontSize: 15 }}>{w.text}</p>
                <span style={{ ...mono, color: C.deep, marginTop: 6 }}>View →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer style={{ background: C.ink, color: '#B9C7B5' }}>
        <div style={{ ...wrap, paddingBlock: 28, ...mono, fontSize: 11 }}>
          JAOSAMUT — THAI SEAFOOD · จ้าวสมุทร · CYBERJAYA · Portfolio by Rif-at Wanwang. All artwork © Jaosamut, shown for portfolio purposes.
        </div>
      </footer>
    </main>
  )
}
