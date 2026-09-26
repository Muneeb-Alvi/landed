import { useEffect } from 'react'
import { Alert, ArrowLeft, Close } from './Icons.jsx'

/** Bilingual heading: Chinese on top, English caps underneath. */
export function Bilingual({ zh, en, size, onInk, as: Tag = 'h2', id }) {
  return (
    <Tag id={id} className={`bi${size === 'sm' ? ' sm' : ''}${onInk ? ' on-ink' : ''}`}>
      <span className="bi-zh">{zh}</span>
      <span className="bi-en">{en}</span>
    </Tag>
  )
}

/**
 * Inline bilingual label: "中文 · English". Each half carries a class so the
 * language toggle can hide one side without touching the markup.
 */
export function L({ zh, en, sep = ' · ' }) {
  return (
    <>
      <span className="lz">{zh}</span>
      <span className="lsep">{sep}</span>
      <span className="le">{en}</span>
    </>
  )
}

export function Chip({ children, ghost }) {
  return <span className={`chip${ghost ? ' ghost' : ''}`}>{children}</span>
}

/** Persistent prototype disclaimer — visible on every screen. */
export function SampleBanner() {
  return (
    <div className="sample-banner" role="note">
      <Alert size={14} />
      <span>Sample data for prototype — verify with official Tsinghua sources.</span>
    </div>
  )
}

export function AppBar({ onBack, backLabel = 'Back', right }) {
  return (
    <header className="appbar">
      {onBack && (
        <button type="button" className="iconbtn" onClick={onBack} aria-label={backLabel}>
          <ArrowLeft size={20} />
        </button>
      )}
      <span className="wordmark">
        Landed<span className="wm-dot">.</span>
      </span>
      <span className="spacer" />
      {right}
    </header>
  )
}

const TOAST_MS = 6000

/**
 * One toast at a time, bottom of the screen, with an optional action (Undo).
 * The live region is always mounted so screen readers announce new messages.
 */
export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined
    const t = window.setTimeout(onDismiss, TOAST_MS)
    return () => window.clearTimeout(t)
  }, [toast, onDismiss])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <span className="toast-msg">
            <L zh={toast.zh} en={toast.en} />
          </span>
          {toast.action && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                toast.action.run()
                onDismiss()
              }}
            >
              <L zh={toast.action.zh} en={toast.action.en} sep=" " />
            </button>
          )}
          <button type="button" className="toast-close" aria-label="Dismiss" onClick={onDismiss}>
            <Close size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

const LEVEL_TEXT = {
  high: { zh: '高', en: 'HIGH' },
  med: { zh: '中', en: 'MED' },
  low: { zh: '低', en: 'LOW' },
}

/** Severity chip. The word carries the meaning; colour only reinforces it. */
export function LevelChip({ level, count }) {
  const t = LEVEL_TEXT[level]
  return (
    <span className={`level-chip ${level}`}>
      <span className="lz">{t.zh}</span>
      <span className="lsep"> </span>
      <span className="le">{t.en}</span>
      {count > 1 && <span aria-hidden="true"> ×{count}</span>}
      {count > 1 && <span className="sr-only"> ({count} flags)</span>}
    </span>
  )
}

export function FlagChips({ summary }) {
  if (!summary.length) return null
  return (
    <span className="flag-chips" aria-label="Red flags">
      {summary.map((f) => (
        <LevelChip key={f.level} level={f.level} count={f.count} />
      ))}
    </span>
  )
}
