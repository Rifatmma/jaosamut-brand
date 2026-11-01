'use client'
import { useState, type ReactNode } from 'react'
import {
  Money, Chip, HeatMark, Stepper, DishRow, DishSheet, Placeholder, Totals, SampleNote, useToast, dish, type Line,
} from '../kit/ui'

const SWATCHES = [
  ['Paper', '#FFFFFF', 'Page ground'], ['Herb Mist', '#EEF5E6', 'Panels, quiet fills'], ['Kaffir Ink', '#0C2B18', 'All text'],
  ['Ink Soft', '#4A5E51', 'Secondary text'], ['Pandan Green', '#33A02C', 'Brand blocks only'], ['Pandan Deep', '#23751D', 'Buttons, links'],
  ['Lime Zest', '#C9EC6B', 'Highlight fill, ink text'], ['Prik Chili', '#C4340B', 'Heat + errors'], ['Tamarind', '#9A6700', 'Staff warnings only'],
  ['Line', '#DCE6D3', 'Hairlines'], ['Line 2', '#C4D2B9', 'Input borders'],
]

function Sec({ id, n, title, note, children }: { id: string; n: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} style={{ scrollMarginTop: 44, padding: '40px 0', borderTop: '1px solid var(--line)' }}>
      <div className="row" style={{ alignItems: 'baseline', marginBottom: 6 }}>
        <span className="mono" style={{ color: 'var(--accent-deep)', fontSize: 13 }}>{n}</span>
        <h2 style={{ fontSize: 22 }}>{title}</h2>
      </div>
      {note && <p className="soft" style={{ margin: '0 0 20px', maxWidth: 680, fontSize: 14 }}>{note}</p>}
      {children}
    </section>
  )
}
const Spec = ({ children }: { children: ReactNode }) => <div className="label" style={{ marginTop: 8, textTransform: 'none', letterSpacing: '.02em' }}>{children}</div>

export default function UiKit() {
  const [qty, setQty] = useState(2)
  const [loading, setLoading] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [lines, setLines] = useState<Line[]>([
    { key: 'a', dish: dish('Tom Yum Seafood'), qty: 1, picks: { spice: [1], size: [1] }, note: '' },
    { key: 'b', dish: dish('Chicken Cashew Nuts'), qty: 2, picks: { spice: [0], addon: [0] }, note: '' },
  ])
  const [mark, setMark] = useState(false)
  const [toast, say] = useToast()
  const tomyum = dish('Tom Yum Seafood')

  return (
    <main className="k" style={{ padding: '32px 16px 80px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div className="label">Product design system</div>
        <h1 className="display" style={{ fontSize: 'clamp(32px, 6vw, 56px)', margin: '8px 0 12px' }}>UI kit.</h1>
        <p className="soft" style={{ maxWidth: 680, fontSize: 16 }}>
          The pieces every Jaosamut screen is built from: QR menu, shop, POS, kitchen display and office. Everything here is live:
          click it, tab to it, resize the window.
        </p>
        <nav className="hscroll" style={{ margin: '20px 0 0' }} aria-label="Kit sections">
          {[['colour', 'Colour'], ['type', 'Type'], ['buttons', 'Buttons'], ['chips', 'Chips'], ['fields', 'Fields'], ['dish', 'Dish'], ['money', 'Money'], ['feedback', 'Feedback'], ['office', 'Office'], ['kitchen', 'Kitchen']].map(([id, l]) => (
            <a key={id} href={`#${id}`} className="filter" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>{l}</a>
          ))}
        </nav>

        <Sec id="colour" n="01" title="Colour" note="Paper and ink do most of the work. Pandan Green is for brand blocks; Pandan Deep carries buttons and links because white on Pandan Green is only 3.38:1. Lime is a highlight fill, chili is heat and errors, tamarind never leaves staff screens.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            {SWATCHES.map(([n, h, u]) => (
              <div key={n} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ height: 64, background: h, borderBottom: '1px solid var(--line)' }} />
                <div style={{ padding: '8px 10px' }}><b style={{ fontSize: 14 }}>{n}</b><div className="mono soft" style={{ fontSize: 12 }}>{h}</div><div className="faint" style={{ fontSize: 12 }}>{u}</div></div>
              </div>
            ))}
          </div>
        </Sec>

        <Sec id="type" n="02" title="Type" note="Archivo Black once per screen at most. IBM Plex Sans for everything people read, Plex Mono for every number, Kanit for Thai.">
          <div style={{ display: 'grid', gap: 16 }}>
            <div><div className="display" style={{ fontSize: 40 }}>Table 07</div><Spec>Archivo Black · display · one per screen</Spec></div>
            <div><div style={{ fontSize: 22, fontWeight: 600 }}>Tom Yum Seafood</div><div className="th faint" style={{ fontSize: 16 }}>ต้มยำทะเล</div><Spec>Plex Sans 600 · dish name · Kanit 600 Thai subtitle</Spec></div>
            <div><p style={{ margin: 0, maxWidth: 520 }}>Clear and sour, lemongrass and lime leaf, prawns and squid from the morning market.</p><Spec>Plex Sans 400 · 15/22 body</Spec></div>
            <div><span className="mono" style={{ fontSize: 22 }}>19.90</span> &nbsp; <span className="mono" style={{ fontSize: 22 }}>RM 19.90</span><Spec>Plex Mono · menus print 19.90, payment prints RM 19.90</Spec></div>
            <div><span className="label">Spice level · Pick 1</span><Spec>Plex Mono 11 caps +14% tracking · labels</Spec></div>
          </div>
        </Sec>

        <Sec id="buttons" n="03" title="Buttons" note="Four kinds, four sizes (36 / 44 / 52 / 56 for POS). The label says the action. One primary per view.">
          <div className="row wrap">
            <button className="btn primary" onClick={() => say('Saved')}>Save recipe</button>
            <button className="btn secondary">Save draft</button>
            <button className="btn ghost">Edit</button>
            <button className="btn danger" onClick={() => say('Voided 1× Tom Yum Seafood', () => say('Void undone'))}>Void item</button>
            <button className="btn primary" disabled>Approve &amp; post</button>
            <button className="btn primary" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1400) }} disabled={loading}>
              {loading ? <><span className="spin" />Sending…</> : 'Send to kitchen'}
            </button>
          </div>
          <div className="row wrap" style={{ marginTop: 12 }}>
            <button className="btn primary sm">sm 36</button><button className="btn primary">md 44</button>
            <button className="btn primary lg">lg 52</button><button className="btn primary pos">POS 56</button>
          </div>
        </Sec>

        <Sec id="chips" n="04" title="Chips, marks and filters" note="SIGNATURE and NEW are the only loud chips. Spice is a LEVEL label in Prik Chili: no chili icons, never a red fill. Status chips always carry a word, never colour alone.">
          <div className="row wrap">
            <Chip kind="signature">Signature</Chip><Chip kind="new">New</Chip><HeatMark level={1} /><HeatMark level={2} /><HeatMark level={3} />
            <Chip kind="ok">In kitchen</Chip><Chip kind="warn">Check</Chip><Chip kind="err">Off by 9.00</Chip>
            <Chip kind="channel">GrabFood</Chip><Chip>Dine-in</Chip>
          </div>
          <div className="row wrap" style={{ marginTop: 12 }}>
            {['All', 'Tomyum', 'Seafood', 'Ikan'].map((f, i) => <button key={f} className="filter" aria-pressed={i === 1}>{f}</button>)}
          </div>
        </Sec>

        <Sec id="fields" n="05" title="Fields" note="Label above, help below. Amber means “check this” (low confidence from the receipt reader) and clears when someone confirms it.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <label className="field"><span>Customer name</span><input className="input" placeholder="Aiman" /><span className="help">For the takeaway bag.</span></label>
            <label className="field"><span>Phone</span><input className="input mono" defaultValue="+60 12-345 6789" /></label>
            <label className="field"><span>Unit price</span><input className="input num" defaultValue="38.00" /></label>
            <label className={`field ${mark ? '' : 'low'}`}>
              <span>Quantity</span><input className="input num" defaultValue="30" />
              <span className="help">{mark ? 'Confirmed' : <>Smudged on the photo · <button className="btn ghost sm" style={{ height: 20, padding: 0, color: 'var(--warn)' }} onClick={() => setMark(true)}>Looks right</button></>}</span>
            </label>
            <div className="field"><span>Quantity stepper</span><Stepper value={qty} onChange={setQty} min={1} label="Quantity" /></div>
          </div>
        </Sec>

        <Sec id="dish" n="06" title="Dish row, placeholder and dish sheet" note="Until a dish is photographed it shows its name on a quiet surface. No stock photos, no AI food. Tap the row to open the sheet; Spice level is required and blocks Add until picked.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
            <div style={{ maxWidth: 520 }}>
              <DishRow d={tomyum} inCart={0} onOpen={() => setSheet(true)} />
              <DishRow d={dish('Sotong Telur Masin')} inCart={2} onOpen={() => setSheet(true)} />
            </div>
            <div className="row" style={{ gap: 10 }}>
              <Placeholder d={dish('Shrimp Salted Egg')} style={{ width: 120, height: 120 }} />
              <Placeholder d={dish('Chicken Cashew Nuts')} style={{ width: 120, height: 120 }} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}><SampleNote>SAMPLE · illustrative flags and add-ons</SampleNote></div>
        </Sec>

        <Sec id="money" n="07" title="Money and totals" note="All prices go through one Money component. Tabular mono, right-aligned in tables, discounts in green with a true minus. Cash bills round to 5 sen.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="card" style={{ padding: 16 }}>
              {lines.map((l) => (
                <div key={l.key} className="row" style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                  <span className="mono">{l.qty}×</span><span className="grow">{l.dish.name}</span><Money v={l.dish.price * l.qty} />
                </div>
              ))}
              <div style={{ marginTop: 12 }}><Totals lines={lines} cash /></div>
            </div>
            <div className="totals card" style={{ padding: 16 }}>
              <div><span>Subtotal</span><Money v={63.3} /></div>
              <div className="disc"><span>Member cashback</span><Money v={1.9} neg /></div>
              <div><span>Delivery · Lalamove 6.2 km</span><Money v={9.4} /></div>
              <div className="grand"><span>Total</span><Money v={70.8} rm /></div>
            </div>
          </div>
        </Sec>

        <Sec id="feedback" n="08" title="Banners, flags and toasts" note="Toasts for things you can undo (5 seconds). Dialogs only for things you can’t. A failed check says what is wrong and by how much.">
          <div style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
            <div className="banner warn"><b>Offline.</b> 3 orders waiting to sync. Card and DuitNow are paused.</div>
            <div className="banner err"><b>Printer not found.</b> Kitchen tickets are still on the KDS.</div>
            <div className="banner ok"><b>Day closed.</b> Cash matched to the sen.</div>
            <div className="flag"><span aria-hidden>✕</span><div><b>Lines don’t add up.</b> RM 9.00 missing. Check line 4.</div></div>
            <div><button className="btn secondary" onClick={() => say('Removed Chicken Cashew Nuts', () => say('Back in the order'))}>Show a toast with Undo</button></div>
          </div>
        </Sec>

        <Sec id="office" n="09" title="Office: stat tiles and tables" note="Every number compares with the 4-week average. Tables: 44 px rows, sticky header, numbers right-aligned.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div className="stat"><span className="label">Sales today</span><span className="v">RM 4,386.50</span><span className="d up">▲ 12% vs 4-week avg</span></div>
            <div className="stat"><span className="label">Food cost</span><span className="v">31.8%</span><span className="d up">▼ 3% vs 4-week avg</span></div>
          </div>
          <div className="card" style={{ marginTop: 12, overflowX: 'auto' }}>
            <table className="dt">
              <thead><tr><th>Ingredient</th><th className="r">On hand</th><th className="r">Par</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>Prawn, white</td><td className="r">2.4 kg</td><td className="r">6.0 kg</td><td><Chip kind="err">Low</Chip></td></tr>
                <tr><td>Squid</td><td className="r">4.1 kg</td><td className="r">4.0 kg</td><td><Chip kind="ok">OK</Chip></td></tr>
                <tr><td>Salted egg</td><td className="r">38 pcs</td><td className="r">30 pcs</td><td><Chip kind="ok">OK</Chip></td></tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8 }}><SampleNote>SAMPLE NUMBERS</SampleNote></div>
        </Sec>

        <Sec id="kitchen" n="10" title="Kitchen: dark mode" note="The KDS and night screens use the same kit on Kaffir Ink. Lime becomes the primary action; allergies are boxed in chili and never cut off.">
          <div className="k dark" style={{ padding: 16, borderRadius: 8, minHeight: 0 }}>
            <div className="ticket amber" style={{ maxWidth: 320 }}>
              <header><span className="no">#0139</span><span className="chip channel">GrabFood</span><span className="age">11:05</span></header>
              <ul>
                <li><span className="q">2×</span><span className="n">Chicken Cashew Nuts</span><div className="mods">Not spicy · + White rice</div></li>
                <li className="done"><span className="q">1×</span><span className="n">Tomyum Chicken</span><div className="mods">Mild</div></li>
              </ul>
              <div className="allergy">⚠ NO PEANUTS. Customer allergic</div>
              <footer><button className="btn primary pos block">Bump</button></footer>
            </div>
          </div>
        </Sec>
      </div>
      {sheet && <DishSheet d={tomyum} onClose={() => setSheet(false)} onAdd={(l) => { setLines((ls) => [...ls, l]); setSheet(false); say(`${l.qty}× ${l.dish.name} added to the Money example`) }} />}
      {toast}
    </main>
  )
}
