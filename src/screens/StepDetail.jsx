import { AppBar, Bilingual, Chip, SampleBanner } from '../components/Chrome.jsx'
import {
  Alert,
  ArrowLeft,
  Check,
  Clock,
  Coins,
  External,
  Flag,
  ThumbUp,
} from '../components/Icons.jsx'
import { STAGE_BY_ID } from '../data/stages.js'
import { formatDay, formatNoteDate, isStale } from '../lib/date.js'
import { formatRange } from '../lib/roadmap.js'

function Note({ note, upvoted, flagged, onUpvote, onFlag }) {
  const stale = isStale(note.date)
  const count = note.upvotes + (upvoted ? 1 : 0)
  return (
    <li className={`note${stale ? ' stale' : ''}`}>
      <div className="note-head">
        <span className="cohort">{note.cohort}</span>
        <span className="note-date">{formatNoteDate(note.date)}</span>
        {stale && <span className="tag">可能过时 · May be outdated</span>}
        {flagged && <span className="tag accent">已标记 · Flagged</span>}
      </div>
      <p className="note-text">{note.text}</p>
      <div className="note-actions">
        <button
          type="button"
          className={`note-btn${upvoted ? ' on' : ''}`}
          aria-pressed={upvoted}
          onClick={() => onUpvote(note.key)}
        >
          <ThumbUp size={15} />
          <span>{count}</span>
        </button>
        <button
          type="button"
          className={`note-btn flag${flagged ? ' on' : ''}`}
          aria-pressed={flagged}
          onClick={() => onFlag(note.key)}
        >
          <Flag size={15} />
          <span>This changed</span>
        </button>
      </div>
    </li>
  )
}

export default function StepDetail({
  step,
  notes,
  upvotes,
  flags,
  onBack,
  onToggle,
  index,
  total,
}) {
  const stage = STAGE_BY_ID[step.stage]

  return (
    <div className="shell">
      <SampleBanner />
      <AppBar onBack={onBack} backLabel="Back to roadmap" />

      <div className="detail-hero">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Chip>{stage.num}</Chip>
          <span className="mono on-ink-muted">
            {stage.zh} · {stage.en}
          </span>
          <span className="spacer" style={{ flex: 1 }} />
          <span className="mono on-ink-muted">
            Step {String(index).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
        </div>

        <h1 className="d-zh">{step.titleZh}</h1>
        <p className="d-en">{step.titleEn}</p>

        <div className="factgrid">
          <div className="fact">
            <p className="f-label">截止 · Deadline</p>
            <p className="f-value">{formatDay(step.deadline)}</p>
          </div>
          <div className="fact">
            <p className="f-label">状态 · Status</p>
            <p className="f-value">
              {step.done
                ? '已完成 Done'
                : step.daysLeft < 0
                  ? `逾期 Overdue ${Math.abs(step.daysLeft)}d`
                  : `剩 ${step.daysLeft}d left`}
            </p>
          </div>
          <div className="fact">
            <p className="f-label">
              <Clock size={11} /> 实际耗时 · Real wait
            </p>
            <p className="f-value" style={{ fontSize: 12.5, lineHeight: 1.45 }}>
              {step.realWait}
            </p>
          </div>
          <div className="fact">
            <p className="f-label">
              <Coins size={11} /> 费用 · Cost
            </p>
            <p className="f-value">
              {step.costCNY[1] === 0 ? '免费 Free' : formatRange(step.costCNY)}
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        {step.deferred && (
          <div className="card accent">
            <p className="card-label">
              <Alert size={13} /> 已推迟 · Moved to week two
            </p>
            <p style={{ fontSize: 14 }}>
              Your arrival is close, so this non-urgent step was pushed to week two to keep your
              first days clear.
            </p>
          </div>
        )}

        <div className="section-head" style={{ marginBottom: 12 }}>
          <Chip ghost>01</Chip>
          <Bilingual zh="官方要求" en="Official requirement" size="sm" />
        </div>
        <div className="card">
          <p style={{ fontSize: 14.5, lineHeight: 1.65 }}>{step.officialRequirement}</p>
          <a
            className="official-link"
            href={step.officialSourceUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            <External size={16} />
            <span>Official source</span>
            <span className="placeholder-tag">Placeholder link</span>
          </a>
        </div>

        {step.shortStay && step.shortStayTip && (
          <div className="card">
            <p className="card-label">
              <Alert size={13} /> 短期停留提示 · Short-stay tip
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{step.shortStayTip}</p>
          </div>
        )}

        <div className="divider" />

        <div className="section-head" style={{ marginBottom: 12 }}>
          <Chip ghost>02</Chip>
          <Bilingual zh="学生情报" en="Student intel" size="sm" />
        </div>
        <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          Notes from recent students, newest first. Notes add timing and cost — they never replace
          the official rules. Upvotes and flags are saved on this device only.
        </p>

        <ul>
          {notes.map((n) => (
            <Note
              key={n.key}
              note={n}
              upvoted={!!upvotes[n.key]}
              flagged={!!flags[n.key]}
              onUpvote={(k) => onToggle.upvote(k)}
              onFlag={(k) => onToggle.flag(k)}
            />
          ))}
        </ul>
      </div>

      <div className="detail-dock">
        <button type="button" className="btn secondary" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <button type="button" className="btn" onClick={() => onToggle.step(step.id)}>
          {step.done ? (
            <span>
              <span className="btn-zh" style={{ display: 'block' }}>
                标记为未完成
              </span>
              Mark not done
            </span>
          ) : (
            <span>
              <span className="btn-zh" style={{ display: 'block' }}>
                标记为已完成
              </span>
              Mark as done
            </span>
          )}
          {!step.done && <Check size={22} />}
        </button>
      </div>
    </div>
  )
}
