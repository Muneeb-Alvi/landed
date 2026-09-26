import { useState } from 'react'
import { AppBar, Bilingual, Chip, L, SampleBanner } from '../components/Chrome.jsx'
import {
  Alert,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coins,
  Refresh,
} from '../components/Icons.jsx'
import { ANSWER_LABELS } from '../data/labels.js'
import { formatDay } from '../lib/date.js'
import { daysLabel, formatRange, LATE_ARRIVAL_DAYS } from '../lib/roadmap.js'

function CheckBox({ step, onToggle, label }) {
  return (
    <button
      type="button"
      className="step-check"
      role="checkbox"
      aria-checked={step.done}
      aria-label={label || `Mark "${step.titleEn}" as done`}
      onClick={() => onToggle(step.id)}
    >
      <span className={`box${step.done ? ' checked' : ''}`}>
        {step.done && <Check size={16} color="var(--accent)" className="tick" />}
      </span>
    </button>
  )
}

/** 本周三件事 — always at the top; turns urgent when arrival is close. */
function ThisWeek({ roadmap, onToggle, onOpen }) {
  const { thisWeek, lateArrival, daysUntilArrival } = roadmap
  return (
    <section className={`this-week${lateArrival ? ' late' : ''}`} aria-labelledby="tw-title">
      <h2 id="tw-title" className="tw-title">
        <span className="tw-zh">{lateArrival ? '优先处理这三件' : '本周三件事'}</span>
        <span className="tw-en">{lateArrival ? 'Do these 3 first' : 'This week: 3 things'}</span>
      </h2>
      {lateArrival && (
        <p className="tw-sub">
          Arrival is in {daysUntilArrival} {daysUntilArrival === 1 ? 'day' : 'days'} — under{' '}
          {LATE_ARRIVAL_DAYS}. Non-urgent steps have been pushed to week two.
        </p>
      )}
      {thisWeek.length === 0 ? (
        <p className="tw-empty">
          <L zh="全部完成" en="Nothing left to do — every step is ticked off." />
        </p>
      ) : (
        <ol className="tw-list">
          {thisWeek.map((s) => {
            const d = daysLabel(s.daysLeft)
            return (
              <li key={s.id} className={s.done ? 'done' : ''}>
                <CheckBox step={s} onToggle={onToggle} />
                <button type="button" className="tw-open" onClick={() => onOpen(s.id)}>
                  <span className="tw-step-zh">{s.titleZh}</span>
                  <span className="tw-step-en">{s.titleEn}</span>
                </button>
                <span className={`tw-days ${d.tone}`}>{d.text}</span>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

function StepRow({ step, onToggle, onOpen }) {
  const badge = daysLabel(step.daysLeft)
  return (
    <li className={`step-row${step.done ? ' done' : ''}`}>
      <CheckBox step={step} onToggle={onToggle} />

      <button type="button" className="step-open" onClick={() => onOpen(step.id)}>
        <span style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ flex: 1 }}>
            <span className="st-zh">{step.titleZh}</span>
            <br />
            <span className="st-en">{step.titleEn}</span>
          </span>
          <ChevronRight size={18} />
        </span>
        <span className="step-meta">
          <span className="date-badge">{formatDay(step.deadline)}</span>
          <span className={`days-badge ${badge.tone}`}>{badge.text}</span>
          {step.costCNY[1] > 0 && (
            <span className="date-badge">{formatRange(step.costCNY)}</span>
          )}
          {step.deferred && <span className="tag accent">推迟 · Week 2</span>}
          {step.shortStay && step.shortStayTip && <span className="tag">短期 · Short stay</span>}
        </span>
      </button>
    </li>
  )
}

/** Stages holding this week's steps start open; everything else starts folded. */
function initialOpenStages(roadmap) {
  const open = new Set(roadmap.thisWeek.map((s) => s.stage))
  if (open.size === 0) {
    const firstUnfinished = roadmap.byStage.find((st) => st.steps.some((s) => !s.done))
    if (firstUnfinished) open.add(firstUnfinished.id)
  }
  return open
}

function StageBlock({ stage, open, onToggleOpen, lateArrival, onToggle, onOpen }) {
  const done = stage.steps.filter((s) => s.done).length
  const listId = `stage-list-${stage.id}`
  return (
    <section className="stage-block">
      <h3 className="stage-h">
        <button
          type="button"
          className="stage-head"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => onToggleOpen(stage.id)}
        >
          <Chip>{stage.num}</Chip>
          <span className="s-text">
            <span className="s-zh">{stage.zh}</span>
            <span className="s-en">{stage.en}</span>
          </span>
          <span className="s-count">
            {done}/{stage.steps.length}
          </span>
          <ChevronDown size={18} className={`s-chev${open ? ' open' : ''}`} />
        </button>
      </h3>
      {/* Folded lists stay in the DOM (hidden) so print can expand them. */}
      <div id={listId} className="stage-list" hidden={!open}>
        <ul>
          {stage.steps.map((s) => (
            <StepRow key={s.id} step={s} onToggle={onToggle} onOpen={onOpen} />
          ))}
        </ul>
        {lateArrival && stage.steps.some((s) => s.deferred) && (
          <p className="week2-note">
            <Clock size={12} /> Non-urgent steps in this stage moved to week two
          </p>
        )}
      </div>
    </section>
  )
}

export default function Roadmap({ answers, roadmap, onToggle, onOpen, onEdit }) {
  const { nextStep, lateArrival, cashflow } = roadmap
  const [openStages, setOpenStages] = useState(() => initialOpenStages(roadmap))
  const allOpen = roadmap.byStage.every((st) => openStages.has(st.id))

  const toggleStage = (id) =>
    setOpenStages((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const setAll = (open) =>
    setOpenStages(open ? new Set(roadmap.byStage.map((st) => st.id)) : new Set())

  return (
    <div className="shell">
      <SampleBanner />
      <AppBar />

      <div className="band">
        <Bilingual zh="我的路线图" en="My roadmap" onInk as="h1" />
        <div className="answer-pills">
          {['degree', 'campus', 'funding', 'housing', 'region'].map((k) => (
            <span key={k} className="answer-pill">
              <L zh={ANSWER_LABELS[k][answers[k]].zh} en={ANSWER_LABELS[k][answers[k]].en} sep=" " />
            </span>
          ))}
          {answers.family && (
            <span className="answer-pill pill-accent">
              <L zh="家属同行" en="With family" sep=" " />
            </span>
          )}
        </div>
        <p className="mono" style={{ marginTop: 12, letterSpacing: '.06em' }}>
          <L zh="抵达" en="Arrival" /> · {formatDay(roadmap.arrival)}
        </p>
      </div>

      <div className="section">
        <ThisWeek roadmap={roadmap} onToggle={onToggle} onOpen={onOpen} />
        {nextStep && (
          <div className="countdown">
            <p className="card-label">下一个截止 · Next deadline</p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div>
                <p className="cd-num">
                  {nextStep.daysLeft < 0 ? `+${Math.abs(nextStep.daysLeft)}` : nextStep.daysLeft}
                </p>
                <p className="mono on-ink-muted" style={{ marginTop: 4 }}>
                  {nextStep.daysLeft < 0 ? 'days over' : 'days left'}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p className="cd-step-zh">{nextStep.titleZh}</p>
                <p className="cd-step-en">{nextStep.titleEn}</p>
                <p className="mono on-ink-muted" style={{ marginTop: 8 }}>
                  {formatDay(nextStep.deadline)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="summary-grid">
          <div className="stat">
            <p className="card-label">
              <Coins size={13} /> 行前 · Before you fly
            </p>
            <p className="stat-num">{formatRange(roadmap.preArrivalCost)}</p>
            <p className="stat-sub">CNY · sample</p>
          </div>
          <div className="stat">
            <p className="card-label">
              <Coins size={13} /> 落地30天 · First 30 days
            </p>
            <p className="stat-num">{formatRange(roadmap.firstThirtyCost)}</p>
            <p className="stat-sub">CNY · sample</p>
          </div>
        </div>

        <div className="stat" style={{ marginBottom: 14 }}>
          <p className="card-label">
            <Check size={13} /> 进度 · Progress
          </p>
          <p className="stat-num">
            {roadmap.doneCount}
            <span style={{ fontSize: 20, color: 'var(--muted)' }}> / {roadmap.totalCount}</span>
          </p>
          <div className="progress-track on-paper" style={{ marginTop: 10 }}>
            <div
              className="progress-fill"
              style={{ width: `${(roadmap.doneCount / roadmap.totalCount) * 100}%` }}
            />
          </div>
          <p className="stat-sub">
            {roadmap.overdueCount > 0
              ? `${roadmap.overdueCount} overdue · saved on this device`
              : 'Saved on this device'}
          </p>
        </div>

        {cashflow && (
          <div className="card cashflow">
            <p className="card-label">
              <Calendar size={13} /> 现金流 · Week-by-week spending
            </p>
            <Bilingual zh="自费现金流规划" en="Self-funded cash flow" size="sm" as="h3" />
            <p className="muted" style={{ fontSize: 13, margin: '8px 0 12px' }}>
              What leaves your pocket each week after you land, including everyday costs. The first
              stipend or transfer often arrives after week four.
            </p>
            {cashflow.map((w) => (
              <div className="week-row" key={w.id}>
                <span className="week-label">
                  {w.zh}
                  <br />
                  {w.en}
                </span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${Math.max(6, w.share * 100)}%` }} />
                </span>
                <span className="week-amt">{formatRange([w.low, w.high])}</span>
              </div>
            ))}
          </div>
        )}

        {answers.degree === 'exchange' && (
          <div className="card">
            <p className="card-label">
              <Alert size={13} /> 短期停留 · Short stay
            </p>
            <Bilingual zh="一学期交换的差别" en="What changes for exchange" size="sm" as="h3" />
            <ul className="trust-list" style={{ marginTop: 8 }}>
              <li>
                <span>—</span>
                <span>You apply for an X2 short-stay visa instead of an X1.</span>
              </li>
              <li>
                <span>—</span>
                <span>
                  The residence permit and bank account steps are hidden — a stay of 180 days or less
                  does not convert to a residence permit.
                </span>
              </li>
              <li>
                <span>—</span>
                <span>Steps that still apply carry a short-stay tip inside.</span>
              </li>
            </ul>
          </div>
        )}

        <div className="timeline-head">
          <Bilingual zh="全部步骤" en="All steps" size="sm" />
          <button type="button" className="text-btn" onClick={() => setAll(!allOpen)}>
            {allOpen ? <L zh="全部收起" en="Collapse all" /> : <L zh="全部展开" en="Expand all" />}
          </button>
        </div>
        {roadmap.byStage.map((stage) => (
          <StageBlock
            key={stage.id}
            stage={stage}
            open={openStages.has(stage.id)}
            onToggleOpen={toggleStage}
            lateArrival={lateArrival}
            onToggle={onToggle}
            onOpen={onOpen}
          />
        ))}
      </div>

      <div className="detail-dock">
        <button type="button" className="btn secondary" onClick={onEdit}>
          <Refresh size={20} />
          <span>
            <span className="btn-zh" style={{ display: 'block' }}>
              修改答案
            </span>
            Edit answers
          </span>
        </button>
      </div>
    </div>
  )
}
