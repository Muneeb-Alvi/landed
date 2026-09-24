import { AppBar, Bilingual, Chip, SampleBanner } from '../components/Chrome.jsx'
import {
  Alert,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Coins,
  Refresh,
} from '../components/Icons.jsx'
import { formatDay } from '../lib/date.js'
import { formatRange, LATE_ARRIVAL_DAYS } from '../lib/roadmap.js'

const ANSWER_LABELS = {
  region: {
    'east-asia': '东亚 East Asia',
    'southeast-asia': '东南亚 SE Asia',
    'south-asia': '南亚 South Asia',
    africa: '非洲 Africa',
    europe: '欧洲 Europe',
    americas: '美洲 Americas',
    oceania: '大洋洲 Oceania',
  },
  degree: {
    bachelor: '本科 Bachelor',
    master: '硕士 Master',
    phd: '博士 PhD',
    exchange: '交换 Exchange',
  },
  campus: { beijing: '北京 Beijing', sigs: '深圳 SIGS' },
  funding: { scholarship: '奖学金 Scholarship', self: '自费 Self-funded' },
  housing: { dorm: '宿舍 Dorm', offcampus: '校外 Off-campus' },
}

function daysBadge(daysLeft) {
  if (daysLeft === 0) return { text: 'TODAY', tone: 'urgent' }
  if (daysLeft < 0) return { text: `OVERDUE ${Math.abs(daysLeft)}D`, tone: 'past' }
  if (daysLeft <= 14) return { text: `D-${daysLeft}`, tone: 'urgent' }
  return { text: `D-${daysLeft}`, tone: '' }
}

function StepRow({ step, onToggle, onOpen }) {
  const badge = daysBadge(step.daysLeft)
  return (
    <li className={`step-row${step.done ? ' done' : ''}`}>
      <button
        type="button"
        className="step-check"
        role="checkbox"
        aria-checked={step.done}
        aria-label={`Mark "${step.titleEn}" as done`}
        onClick={() => onToggle(step.id)}
      >
        <span className={`box${step.done ? ' checked' : ''}`}>
          {step.done && <Check size={16} color="#F3EEE4" />}
        </span>
      </button>

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

export default function Roadmap({ answers, roadmap, onToggle, onOpen, onEdit }) {
  const { nextStep, lateArrival, doFirst, cashflow } = roadmap

  return (
    <div className="shell">
      <SampleBanner />
      <AppBar />

      <div className="band">
        <Bilingual zh="我的路线图" en="My roadmap" onInk as="h1" />
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, alignItems: 'center' }}
        >
          {['degree', 'campus', 'funding', 'housing', 'region'].map((k) => (
            <span
              key={k}
              className="mono"
              style={{
                border: '1px solid rgba(185,199,198,.4)',
                padding: '3px 7px',
                textTransform: 'none',
                letterSpacing: '.04em',
                fontSize: 11,
              }}
            >
              {ANSWER_LABELS[k][answers[k]]}
            </span>
          ))}
          {answers.family && (
            <span
              className="mono"
              style={{
                background: '#E0592A',
                color: '#0E2A2F',
                padding: '3px 7px',
                textTransform: 'none',
                letterSpacing: '.04em',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              家属同行 With family
            </span>
          )}
        </div>
        <p className="mono" style={{ marginTop: 12, letterSpacing: '.06em' }}>
          抵达 Arrival · {formatDay(roadmap.arrival)}
        </p>
      </div>

      <div className="section">
        {lateArrival && (
          <div className="urgent" role="alert">
            <p className="u-title-zh">优先处理这三件</p>
            <p className="u-title-en">Do these 3 first</p>
            <p style={{ fontSize: 13.5, marginBottom: 6 }}>
              Arrival is in {roadmap.daysUntilArrival}{' '}
              {roadmap.daysUntilArrival === 1 ? 'day' : 'days'} — under {LATE_ARRIVAL_DAYS}. Non-urgent
              steps have been pushed to week two.
            </p>
            <ol>
              {doFirst.map((s, i) => (
                <li key={s.id}>
                  <span className="u-idx">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <strong className="zh">{s.titleZh}</strong>
                    <br />
                    {s.titleEn}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {nextStep && (
          <div className="countdown">
            <p className="card-label">下一个截止 · Next deadline</p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div>
                <p className="cd-num">
                  {nextStep.daysLeft < 0 ? `+${Math.abs(nextStep.daysLeft)}` : nextStep.daysLeft}
                </p>
                <p className="mono" style={{ color: '#B9C7C6', marginTop: 4 }}>
                  {nextStep.daysLeft < 0 ? 'days over' : 'days left'}
                </p>
              </div>
              <div style={{ flex: 1 }}>
                <p className="cd-step-zh">{nextStep.titleZh}</p>
                <p className="cd-step-en">{nextStep.titleEn}</p>
                <p className="mono" style={{ marginTop: 8, color: '#B9C7C6' }}>
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
          <div className="progress-track" style={{ marginTop: 10, background: 'rgba(26,29,30,.15)' }}>
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

        {roadmap.byStage.map((stage) => (
          <section className="stage-block" key={stage.id}>
            <div className="stage-head">
              <Chip>{stage.num}</Chip>
              <span>
                <span className="s-zh">{stage.zh}</span>
                <br />
                <span className="s-en">{stage.en}</span>
              </span>
              <span className="s-count">
                {stage.steps.filter((s) => s.done).length}/{stage.steps.length}
              </span>
            </div>
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
          </section>
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
