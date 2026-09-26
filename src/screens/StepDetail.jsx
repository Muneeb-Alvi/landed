import { useEffect, useState } from 'react'
import { AppBar, Bilingual, Chip, L, LevelChip, SampleBanner } from '../components/Chrome.jsx'
import {
  Alert,
  ArrowLeft,
  Check,
  Clock,
  Coins,
  External,
  EyeOff,
  Flag,
  Refresh,
  ThumbUp,
  Trash,
} from '../components/Icons.jsx'
import { STAGE_BY_ID, STAGES } from '../data/stages.js'
import { formatDay, formatNoteDate, isStale, toISODay } from '../lib/date.js'
import { formatRange, sortFlags } from '../lib/roadmap.js'
import { whyLine } from '../lib/verdict.js'

const VERDICT_TEXT = {
  yes: { zh: '需要', en: 'YES', sub: { zh: '适用于你', en: 'Applies to you' } },
  no: { zh: '不需要', en: 'NO', sub: { zh: '不适用于你', en: "Doesn't apply to you" } },
  maybe: { zh: '待确认', en: 'MAYBE', sub: { zh: '取决于一个问题', en: 'Depends on one answer' } },
}

/** 我需要做吗？ — the verdict pill, its reason and, for MAYBE, the follow-up. */
function VerdictBlock({ step, answers, followUps, onAnswer }) {
  const v = step.verdict
  const t = VERDICT_TEXT[v.verdict]
  const why = whyLine(step, answers, followUps)
  return (
    <section className={`verdict ${v.verdict}`} aria-labelledby="verdict-title">
      <h2 className="card-label" id="verdict-title">
        <L zh="我需要做吗？" en="Do I need this?" />
      </h2>
      <p className="verdict-row">
        <span className={`verdict-pill ${v.verdict}`}>
          <span className="lz">{t.zh}</span>
          <span className="lsep"> · </span>
          <span className="le">{t.en}</span>
        </span>
        <span className="verdict-sub">
          <L zh={t.sub.zh} en={t.sub.en} />
        </span>
      </p>
      {v.reason && v.verdict !== 'yes' && (
        <p className="verdict-reason">
          <span className="lz">{v.reason.zh}</span>
          <span className="le">{v.reason.en}</span>
        </p>
      )}

      {v.question && !v.answered && (
        <div className="followup" role="group" aria-labelledby="fu-q">
          <p id="fu-q" className="followup-q">
            <span className="lz">{v.question.zh}</span>
            <span className="le">{v.question.en}</span>
          </p>
          <div className="form-actions">
            <button type="button" className="btn small" onClick={() => onAnswer(v.question.key, true)}>
              <L zh="是" en="Yes" />
            </button>
            <button
              type="button"
              className="btn secondary small"
              onClick={() => onAnswer(v.question.key, false)}
            >
              <L zh="否" en="No" />
            </button>
          </div>
        </div>
      )}
      {v.question && v.answered && (
        <p className="followup-done">
          <span className="le">
            {v.question.en} — you said {followUps[v.question.key] ? 'yes' : 'no'}.
          </span>
          <button
            type="button"
            className="text-btn"
            onClick={() => onAnswer(v.question.key, undefined)}
          >
            <L zh="修改" en="Change" />
          </button>
        </p>
      )}

      {v.verdict !== 'no' && (
        <p className="why">
          <span className="why-label">
            <L zh="为什么会看到这一步" en="Why you're seeing this" />
          </span>
          <span className="lz">{why.zh}</span>
          <span className="le">{why.en}</span>
        </p>
      )}
    </section>
  )
}

function Note({ note, upvoted, flagged, onUpvote, onFlag }) {
  const stale = isStale(note.date)
  const count = note.upvotes + (upvoted ? 1 : 0)
  return (
    <li className={`note${stale ? ' stale' : ''}`}>
      <div className="note-head">
        <span className="cohort">{note.cohort}</span>
        <span className="note-date">{formatNoteDate(note.date)}</span>
        {stale && (
          <span className="tag">
            <L zh="可能过时" en="May be outdated" />
          </span>
        )}
        {flagged && (
          <span className="tag accent">
            <L zh="已标记" en="Flagged" />
          </span>
        )}
      </div>
      <p className="note-text">{note.text}</p>
      <div className="note-actions">
        <button
          type="button"
          className={`note-btn${upvoted ? ' on' : ''}`}
          aria-pressed={upvoted}
          aria-label={`Helpful — ${count} upvotes`}
          onClick={() => onUpvote(note.key)}
        >
          <ThumbUp size={15} />
          <span aria-hidden="true">{count}</span>
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

/** Due date, hide/restore and (for custom steps) editing — the student's own plan. */
function PlanBlock({ step, isHidden, actions, onHide, onDelete }) {
  const dateValue = toISODay(step.deadline)
  return (
    <section className="card plan" aria-labelledby="plan-title">
      <p className="card-label" id="plan-title">
        <L zh="我的安排" en="Your plan" />
      </p>

      {step.custom && (
        <>
          <label className="field">
            <span className="field-label">
              <L zh="标题" en="Title" />
            </span>
            <input
              type="text"
              value={step.title}
              maxLength={80}
              onChange={(e) => actions.updateCustom(step.id, { title: e.target.value })}
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field-label">
                <L zh="阶段" en="Stage" />
              </span>
              <select
                value={step.stage}
                onChange={(e) => actions.updateCustom(step.id, { stage: e.target.value })}
              >
                {STAGES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.num} {st.en}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">
                <L zh="费用" en="Cost (CNY)" />
              </span>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={step.costCNY[0] || ''}
                placeholder="0"
                onChange={(e) => actions.updateCustom(step.id, { cost: e.target.value })}
              />
            </label>
          </div>
        </>
      )}

      <label className="field">
        <span className="field-label">
          <L zh="截止日期" en="Due date" />
        </span>
        <input
          type="date"
          value={dateValue}
          onChange={(e) => {
            if (!e.target.value) return
            if (step.custom) actions.updateCustom(step.id, { date: e.target.value })
            else actions.setDue(step.id, e.target.value)
          }}
        />
      </label>
      {!step.custom && (
        <p className="suggested">
          <L zh="建议日期" en="Suggested" /> {formatDay(step.suggestedDeadline)}
          {step.moved && (
            <button type="button" className="text-btn" onClick={() => actions.setDue(step.id, null)}>
              <L zh="恢复建议" en="Reset" />
            </button>
          )}
        </p>
      )}

      <div className="plan-actions">
        {step.custom ? (
          <button type="button" className="btn secondary small" onClick={onDelete}>
            <Trash size={18} />
            <L zh="删除此步骤" en="Delete step" />
          </button>
        ) : isHidden ? (
          <button
            type="button"
            className="btn secondary small"
            onClick={() => actions.restoreStep(step.id)}
          >
            <Refresh size={18} />
            <L zh="恢复到路线图" en="Restore to roadmap" />
          </button>
        ) : (
          <button type="button" className="btn secondary small" onClick={onHide}>
            <EyeOff size={18} />
            <L zh="与我无关" en="Not relevant to me" />
          </button>
        )}
      </div>
    </section>
  )
}

/** Private notes. Saved as you type, never shared. */
function MyNotes({ stepId, value, onChange }) {
  const [text, setText] = useState(value)
  useEffect(() => setText(value), [stepId, value])
  return (
    <section className="card">
      <label className="field" style={{ marginBottom: 0 }}>
        <span className="card-label">
          <L zh="我的笔记" en="My notes" />
        </span>
        <textarea
          rows={4}
          value={text}
          maxLength={2000}
          placeholder="Only you can see this. e.g. booked for 14 Aug, reference 7F3K"
          onChange={(e) => {
            setText(e.target.value)
            onChange(stepId, e.target.value)
          }}
        />
        <span className="field-hint">
          <L zh="仅保存在此设备" en="Private · saved on this device only" />
        </span>
      </label>
    </section>
  )
}

export default function StepDetail({
  step,
  isHidden,
  isSkipped,
  answers,
  followUps,
  notes,
  upvotes,
  flags,
  myNote,
  onBack,
  actions,
  onHide,
  onDelete,
  index,
  total,
}) {
  const stage = STAGE_BY_ID[step.stage]

  return (
    <div className="shell">
      <SampleBanner />
      <AppBar onBack={onBack} backLabel="Back to roadmap" />

      <div className="detail-hero">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip>{stage.num}</Chip>
          <span className="mono on-ink-muted">
            <L zh={stage.zh} en={stage.en} />
          </span>
          <span className="spacer" style={{ flex: 1 }} />
          {index > 0 && (
            <span className="mono on-ink-muted">
              Step {String(index).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </span>
          )}
        </div>

        {step.custom ? (
          <>
            <h1 className="d-en d-custom">{step.titleEn}</h1>
            <p className="mono on-ink-muted" style={{ marginTop: 6 }}>
              <L zh="自定义步骤" en="Your own step" />
            </p>
          </>
        ) : (
          <>
            <h1 className="d-zh">{step.titleZh}</h1>
            <p className="d-en">{step.titleEn}</p>
          </>
        )}

        <div className="factgrid">
          <div className="fact">
            <p className="f-label">
              <L zh="截止" en="Deadline" />
            </p>
            <p className="f-value">{formatDay(step.deadline)}</p>
          </div>
          <div className="fact">
            <p className="f-label">
              <L zh="状态" en="Status" />
            </p>
            <p className="f-value">
              {isSkipped
                ? '不适用 Not for you'
                : isHidden
                ? '已隐藏 Hidden'
                : step.done
                  ? '已完成 Done'
                  : step.daysLeft < 0
                    ? `逾期 Overdue ${Math.abs(step.daysLeft)}d`
                    : `剩 ${step.daysLeft}d left`}
            </p>
          </div>
          {!step.custom && (
            <div className="fact">
              <p className="f-label">
                <Clock size={11} /> <L zh="实际耗时" en="Real wait" />
              </p>
              <p className="f-value" style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                {step.realWait}
              </p>
            </div>
          )}
          <div className="fact">
            <p className="f-label">
              <Coins size={11} /> <L zh="费用" en="Cost" />
            </p>
            <p className="f-value">
              {step.costCNY[1] === 0 ? '免费 Free' : formatRange(step.costCNY)}
            </p>
          </div>
        </div>
      </div>

      <div className="section detail-body">
        <VerdictBlock
          step={step}
          answers={answers}
          followUps={followUps}
          onAnswer={actions.answerFollowUp}
        />
        {isHidden && (
          <div className="card accent" role="note">
            <p className="card-label">
              <EyeOff size={13} /> <L zh="已隐藏" en="Hidden from your roadmap" />
            </p>
            <p style={{ fontSize: 14 }}>
              This step is left out of your timeline, totals and progress. Restore it any time.
            </p>
          </div>
        )}

        {step.deferred && (
          <div className="card accent">
            <p className="card-label">
              <Alert size={13} /> <L zh="已推迟" en="Moved to week two" />
            </p>
            <p style={{ fontSize: 14 }}>
              Your arrival is close, so this non-urgent step was pushed to week two to keep your
              first days clear.
            </p>
          </div>
        )}

        {step.redFlags?.length > 0 && (
          <section className="card red-flags" aria-labelledby="rf-title">
            <h2 className="card-label" id="rf-title">
              <Alert size={13} /> <L zh="风险提示" en="Red flags" /> · sample
            </h2>
            <ul>
              {sortFlags(step.redFlags).map((f) => (
                <li key={f.en} className="rf-row">
                  <LevelChip level={f.level} />
                  <span className="rf-text">
                    <span className="lz rf-zh">{f.zh}</span>
                    <span className="le">{f.en}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="field-hint">Drawn from the student notes below — check the official rules.</p>
          </section>
        )}

        {!step.custom && (
          <>
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
                  <Alert size={13} /> <L zh="短期停留提示" en="Short-stay tip" />
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{step.shortStayTip}</p>
              </div>
            )}
          </>
        )}

        {!isSkipped && (
          <PlanBlock
            step={step}
            isHidden={isHidden}
            actions={actions}
            onHide={onHide}
            onDelete={onDelete}
          />
        )}
        <MyNotes stepId={step.id} value={myNote} onChange={actions.setMyNote} />

        {!step.custom && (
          <>
            <div className="divider" />

            <div className="section-head" style={{ marginBottom: 12 }}>
              <Chip ghost>02</Chip>
              <Bilingual zh="学生情报" en="Student intel" size="sm" />
            </div>
            <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
              Notes from recent students. Notes add timing and cost — they never replace the
              official rules. Upvotes and flags are saved on this device only.
            </p>

            <ul>
              {notes.map((n) => (
                <Note
                  key={n.key}
                  note={n}
                  upvoted={!!upvotes[n.key]}
                  flagged={!!flags[n.key]}
                  onUpvote={actions.toggleUpvote}
                  onFlag={actions.toggleFlag}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="detail-dock">
        <button type="button" className="btn secondary back" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        {!isHidden && !isSkipped && (
          <button type="button" className="btn" onClick={() => actions.toggleStep(step.id)}>
            {step.done ? (
              <span>
                <span className="btn-zh" style={{ display: 'block' }}>
                  标记为未完成
                </span>
                <span className="le">Mark not done</span>
              </span>
            ) : (
              <span>
                <span className="btn-zh" style={{ display: 'block' }}>
                  标记为已完成
                </span>
                <span className="le">Mark as done</span>
              </span>
            )}
            {!step.done && <Check size={22} />}
          </button>
        )}
      </div>
    </div>
  )
}
