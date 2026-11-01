'use client'
import './kit.css'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import menu from './menu.json'

// ── data ─────────────────────────────────────────────────────────────────────
export type Option = { name: string; price: number }
/** `pick` = Khao Hom's recommended option (from order data, or set by the owner); `pickWhy` says which. */
export type Group = { id: string; name: string; min: number; max: number; options: Option[]; pick?: number; pickWhy?: string }
export type Dish = {
  id: string; name: string; th: string; price: number; sub: string; desc: string; prep: number
  signature: boolean; heat: number; groups: Group[]
}
export type Category = { id: string; name: string; items: Dish[] }
export const MENU = menu as { source: string; sample: string; categories: Category[] }
export const ALL_DISHES = MENU.categories.flatMap((c) => c.items.map((d) => ({ ...d, cat: c.name })))
export const dish = (prefix: string) => ALL_DISHES.find((d) => d.name.toLowerCase().startsWith(prefix.toLowerCase()))!

/** A chosen dish: selections are option indexes per group id. */
export type Line = { key: string; dish: Dish; qty: number; picks: Record<string, number[]>; note: string }
export const unitPrice = (d: Dish, picks: Record<string, number[]>) =>
  d.price + d.groups.reduce((s, g) => s + (picks[g.id] ?? []).reduce((t, i) => t + g.options[i].price, 0), 0)
export const lineTotal = (l: Line) => unitPrice(l.dish, l.picks) * l.qty
export const pickLabels = (l: Line) =>
  l.dish.groups.flatMap((g) => (l.picks[g.id] ?? []).map((i) => g.options[i].name))

// ── money: the only way a price is printed. Menus show 18.90, payment shows RM 18.90 ──
export function Money({ v, rm, neg, className }: { v: number; rm?: boolean; neg?: boolean; className?: string }) {
  const s = Math.abs(v).toFixed(2)
  return <span className={`mono ${className ?? ''}`}>{neg ? '−' : ''}{rm ? 'RM ' : ''}{s}</span>
}
/** Malaysian cash rounding to the nearest 5 sen. */
export const round5 = (v: number) => Math.round(v * 20) / 20

// ── marks ────────────────────────────────────────────────────────────────────
/** Spice is a Plex Mono LEVEL label in Prik Chili, never chili icons (brand book §colour). */
export function HeatMark({ level }: { level: number }) {
  if (!level) return null
  return <span className="chip heat" aria-label={`Spice level ${level} of 3`}>Level {level}</span>
}
export const Chip = ({ kind = 'quiet', children }: { kind?: string; children: ReactNode }) =>
  <span className={`chip ${kind}`}>{children}</span>

export function Placeholder({ d, style }: { d: Pick<Dish, 'name' | 'th'>; style?: React.CSSProperties }) {
  return <div className="ph" style={style} aria-hidden="true"><b>{d.name}</b>{d.th && <i>{d.th}</i>}</div>
}

export function Stepper({ value, onChange, min = 0, label }: { value: number; onChange: (n: number) => void; min?: number; label: string }) {
  return (
    <span className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label="One less" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label="One more" onClick={() => onChange(value + 1)}>+</button>
    </span>
  )
}

// ── dish row (QR menu / shop) ────────────────────────────────────────────────
export function DishRow({ d, inCart, onOpen }: { d: Dish; inCart: number; onOpen: () => void }) {
  return (
    <article className="dish" onClick={onOpen}>
      <div>
        <h3>{d.name}</h3>
        {d.th && <div className="thname">{d.th}</div>}
        {d.desc && <p>{d.desc}</p>}
        <div className="meta">
          <Money v={d.price} className="price" />
          {d.signature && <Chip kind="signature">Signature</Chip>}
          <HeatMark level={d.heat} />
        </div>
      </div>
      <div className="pic">
        <Placeholder d={d} />
        {inCart > 0 && <span className="incart" aria-label={`${inCart} in your order`}><Chip kind="new">×{inCart}</Chip></span>}
        <button className="add" aria-label={`Add ${d.name}`} onClick={(e) => { e.stopPropagation(); onOpen() }}>+</button>
      </div>
    </article>
  )
}

// ── dish sheet: modifier groups with min/max, note, qty and a live total ─────
export function DishSheet({ d, initial, staff, onClose, onAdd }: {
  d: Dish; initial?: Line; staff?: boolean; onClose: () => void; onAdd: (l: Line) => void
}) {
  const [qty, setQty] = useState(initial?.qty ?? 1)
  const [note, setNote] = useState(initial?.note ?? '')
  const [picks, setPicks] = useState<Record<string, number[]>>(() =>
    initial?.picks ?? Object.fromEntries(d.groups.filter((g) => g.min === 1 && g.max === 1 && g.id !== 'spice').map((g) => [g.id, [0]])))
  const [tried, setTried] = useState(false)
  const missing = d.groups.filter((g) => (picks[g.id]?.length ?? 0) < g.min)
  const total = unitPrice(d, picks) * qty
  useEscape(onClose)

  const toggle = (g: Group, i: number) => setPicks((p) => {
    const cur = p[g.id] ?? []
    if (g.max === 1) return { ...p, [g.id]: [i] }
    if (cur.includes(i)) return { ...p, [g.id]: cur.filter((x) => x !== i) }
    return cur.length >= g.max ? p : { ...p, [g.id]: [...cur, i] }
  })
  const submit = () => {
    if (missing.length) { setTried(true); return }
    onAdd({ key: initial?.key ?? `${d.id}-${Date.now()}`, dish: d, qty, picks, note: note.trim() })
  }

  return (
    <div className="scrim" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={d.name} onClick={(e) => e.stopPropagation()}>
        <div className="body">
          <button className="close" aria-label="Close" onClick={onClose}>×</button>
          {!staff && <Placeholder d={d} style={{ height: 160, marginBottom: 16 }} />}
          <div className="row wrap" style={{ gap: 6, marginBottom: 6 }}>
            {d.signature && <Chip kind="signature">Signature</Chip>}
            <HeatMark level={d.heat} />
          </div>
          <h2 style={{ fontSize: 22, lineHeight: 1.2, paddingRight: 44 }}>{d.name}</h2>
          {d.th && <div className="th faint" style={{ fontSize: 15 }}>{d.th}</div>}
          {d.desc && <p className="soft" style={{ margin: '8px 0 0', fontSize: 14 }}>{d.desc}</p>}
          <div style={{ margin: '10px 0 14px' }}><Money v={d.price} rm className="price" /></div>
          {d.groups.map((g) => {
            const sel = picks[g.id] ?? []
            const rule = g.min === 1 && g.max === 1 ? 'Pick 1' : g.min ? `Pick ${g.min}–${g.max}` : `Optional · up to ${g.max}`
            return (
              <fieldset key={g.id} className={`group ${tried && sel.length < g.min ? 'missing' : ''}`} style={{ border: 0, margin: 0, padding: '16px 0 8px', borderTop: '1px solid var(--line)' }}>
                <header>
                  <legend style={{ padding: 0 }}><h4>{g.name}</h4></legend>
                  {g.min ? <Chip kind={tried && sel.length < g.min ? 'err' : 'quiet'}>Required</Chip> : null}
                </header>
                <div className="label" style={{ marginBottom: 4 }}>{rule}</div>
                {g.pick != null && !staff && <KhaoHomTip text={g.pickWhy} />}
                {g.options.map((o, i) => (
                  <label key={o.name} className="opt">
                    <input type={g.max === 1 ? 'radio' : 'checkbox'} name={`${d.id}-${g.id}`} checked={sel.includes(i)}
                      disabled={g.max > 1 && !sel.includes(i) && sel.length >= g.max} onChange={() => toggle(g, i)} />
                    <span>{o.name}</span>
                    {g.pick === i && <Chip kind="signature">Khao Hom&apos;s pick</Chip>}
                    <span className="p">{o.price ? <>+<Money v={o.price} /></> : ''}</span>
                  </label>
                ))}
              </fieldset>
            )
          })}
          <label className="field" style={{ marginTop: 12 }}>
            <span>{staff ? 'Kitchen note' : 'Note for the kitchen'}</span>
            <textarea className="input" rows={2} value={note} placeholder="Allergies, no peanuts, sauce on the side…" onChange={(e) => setNote(e.target.value)} />
          </label>
        </div>
        <div className="foot">
          <Stepper value={qty} min={1} onChange={setQty} label="Quantity" />
          <button className="btn primary lg grow" onClick={submit}>
            {initial ? 'Update' : 'Add'} {qty} · <Money v={total} rm />
          </button>
        </div>
      </div>
    </div>
  )
}

/** Khao Hom's recommendation line in a modifier group. He appears small, never beside the logo. */
export function KhaoHomTip({ text }: { text?: string }) {
  return (
    <div className="khtip">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/khao-hom/img/expressions-1/05-cheeky.webp" alt="" width={36} height={36} />
      <span><b>Khao Hom&apos;s pick</b>{text ? <> · {text}</> : null}</span>
    </div>
  )
}

// ── small behaviours ─────────────────────────────────────────────────────────
export function useEscape(fn: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && fn()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [fn])
}
export function useToast() {
  const [t, setT] = useState<{ msg: string; undo?: () => void } | null>(null)
  useEffect(() => { if (!t) return; const id = setTimeout(() => setT(null), 5000); return () => clearTimeout(id) }, [t])
  const node = t && (
    <div className="toast" role="status">
      <span>{t.msg}</span>
      {t.undo && <button onClick={() => { t.undo!(); setT(null) }}>Undo</button>}
    </div>
  )
  return [node, (msg: string, undo?: () => void) => setT({ msg, undo })] as const
}
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(id) }, [ms])
  return now
}
export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function Totals({ lines, cash }: { lines: Line[]; cash?: boolean }) {
  const sub = useMemo(() => lines.reduce((s, l) => s + lineTotal(l), 0), [lines])
  const due = cash ? round5(sub) : sub
  return (
    <div className="totals">
      <div><span className="soft">Subtotal</span><Money v={sub} /></div>
      <div><span className="soft">SST</span><span className="soft">not registered</span></div>
      {cash && due !== sub && <div><span className="soft">Rounding</span><Money v={due - sub} neg={due < sub} /></div>}
      <div className="grand"><span>Total</span><Money v={due} rm /></div>
    </div>
  )
}

/** The sample-data stamp every screen carries until real data arrives. */
export const SampleNote = ({ children }: { children: ReactNode }) => <span className="note-sample">{children}</span>

export function Logo({ name = 'primary-green', h = 28, alt = 'JAOSAMUT จ้าวสมุทร' }: { name?: string; h?: number; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/brand/jaosamut-${name}.webp`} alt={alt} style={{ height: h, width: 'auto', display: 'block' }} />
}
