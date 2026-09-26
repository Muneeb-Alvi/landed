import { Alert, ArrowLeft } from './Icons.jsx'

/** Bilingual heading: Chinese on top, English caps underneath. */
export function Bilingual({ zh, en, size, onInk, as: Tag = 'h2' }) {
  return (
    <Tag className={`bi${size === 'sm' ? ' sm' : ''}${onInk ? ' on-ink' : ''}`}>
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
