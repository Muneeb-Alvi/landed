import { useEffect, useRef, useState } from 'react'
import { useApp } from './AppContext.js'
import { Alert, ArrowLeft, Close, Menu as MenuIcon } from './Icons.jsx'

/** Bilingual heading: Chinese on top, English caps underneath. */
export function Bilingual({ zh, en, size, onInk, as: Tag = 'h2', id, tabIndex }) {
  return (
    <Tag
      id={id}
      tabIndex={tabIndex}
      className={`bi${size === 'sm' ? ' sm' : ''}${onInk ? ' on-ink' : ''}`}
    >
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
    <aside className="sample-banner" aria-label="Sample data notice">
      <Alert size={14} />
      <span>Sample data for prototype — verify with official Tsinghua sources.</span>
    </aside>
  )
}

const LANGS = [
  { id: 'zh', label: '中', name: 'Chinese only' },
  { id: 'en', label: 'EN', name: 'English only' },
  { id: 'both', label: '中/EN', name: 'Chinese and English' },
]

/** 中 / EN / Both — hides one script through html[data-lang]. */
export function LangToggle() {
  const { lang, setLang } = useApp()
  return (
    <div className="lang-toggle" role="radiogroup" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          aria-checked={lang === l.id}
          aria-label={l.name}
          className={lang === l.id ? 'on' : ''}
          onClick={() => setLang(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

/** Small settings menu: roadmap, document check, about the data, start over. */
export function AppMenu() {
  const { hasRoadmap, go, startOver } = useApp()
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const wrap = useRef(null)
  const button = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    wrap.current?.querySelector('[role="menuitem"]')?.focus()
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Arrow keys move between items, as a menu should.
  const onMenuKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = [...wrap.current.querySelectorAll('[role="menuitem"]')]
    const i = items.indexOf(document.activeElement)
    const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length
    items[next].focus()
  }

  const pick = (fn) => () => {
    setOpen(false)
    fn()
  }

  return (
    <div className="menu-wrap" ref={wrap}>
      <button
        ref={button}
        type="button"
        className="iconbtn menu-btn"
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <MenuIcon size={20} />
      </button>
      {open && (
        <div className="menu" role="menu" aria-label="Menu" onKeyDown={onMenuKey}>
          <button type="button" role="menuitem" onClick={pick(() => go('/'))}>
            <L zh="首页" en="Home" />
          </button>
          {hasRoadmap && (
            <button type="button" role="menuitem" onClick={pick(() => go('/roadmap'))}>
              <L zh="我的路线图" en="My roadmap" />
            </button>
          )}
          <button type="button" role="menuitem" onClick={pick(() => go('/check'))}>
            <L zh="检查文件" en="Check a document" />
          </button>
          <button type="button" role="menuitem" onClick={pick(() => go('/about'))}>
            <L zh="关于数据" en="About the data" />
          </button>
          <button
            type="button"
            role="menuitem"
            className="danger"
            onClick={pick(() => setConfirming(true))}
          >
            <L zh="重新开始" en="Start over" />
          </button>
        </div>
      )}
      {confirming && (
        <ConfirmDialog
          titleZh="清除所有数据？"
          titleEn="Start over?"
          body="This clears your answers, ticks, hidden and custom steps, notes and tips from this device. It cannot be undone."
          confirmZh="清除"
          confirmEn="Clear everything"
          onCancel={() => {
            setConfirming(false)
            button.current?.focus()
          }}
          onConfirm={() => {
            setConfirming(false)
            startOver()
          }}
        />
      )}
    </div>
  )
}

/** Modal confirmation. Focus starts on Cancel, stays inside, Escape cancels. */
export function ConfirmDialog({ titleZh, titleEn, body, confirmZh, confirmEn, onCancel, onConfirm }) {
  const box = useRef(null)
  useEffect(() => {
    box.current?.querySelector('button')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Tab') {
        const items = [...box.current.querySelectorAll('button')]
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="dialog-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-body"
        ref={box}
      >
        <Bilingual zh={titleZh} en={titleEn} as="h2" id="dialog-title" />
        <p id="dialog-body" className="dialog-body">
          {body}
        </p>
        <div className="form-actions">
          <button type="button" className="btn secondary small" onClick={onCancel}>
            <L zh="取消" en="Cancel" />
          </button>
          <button type="button" className="btn small danger" onClick={onConfirm}>
            <L zh={confirmZh} en={confirmEn} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function AppBar({ onBack, backLabel = 'Back', right, wordmark = true }) {
  const { go } = useApp()
  return (
    <header className="appbar">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
      {onBack && (
        <button type="button" className="iconbtn" onClick={onBack} aria-label={backLabel}>
          <ArrowLeft size={20} />
        </button>
      )}
      {wordmark && (
        <a
          className="wordmark"
          href="#/"
          aria-label="Landed — home"
          onClick={(e) => {
            e.preventDefault()
            go('/')
          }}
        >
          Landed<span className="wm-dot">.</span>
        </a>
      )}
      <span className="spacer" />
      {right}
      <LangToggle />
      <AppMenu />
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

/** Shown while an on-demand screen loads. */
export function Loading() {
  return (
    <div className="shell">
      <div className="loading" role="status">
        <span className="loading-bar" aria-hidden="true" />
        <L zh="加载中" en="Loading…" />
      </div>
    </div>
  )
}
