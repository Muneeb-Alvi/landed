import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTitle } from '../components/AppContext.js'
import { AppBar, Bilingual, Chip, L, SampleBanner } from '../components/Chrome.jsx'
import { ArrowLeft, ArrowRight, Check, Pencil, Users } from '../components/Icons.jsx'
import { labelFor } from '../data/labels.js'
import { PERSONAS } from '../data/personas.js'
import { addDays, formatDay, parseDay, toISODay, today } from '../lib/date.js'

export const QUESTIONS = [
  {
    key: 'region',
    zh: '你从哪里出发？',
    en: 'Where are you coming from?',
    helpEn: 'Region affects courier times, visa centre queues and flight costs.',
    options: [
      { value: 'east-asia', zh: '东亚', en: 'East Asia' },
      { value: 'southeast-asia', zh: '东南亚', en: 'Southeast Asia' },
      { value: 'south-asia', zh: '南亚', en: 'South Asia' },
      { value: 'africa', zh: '非洲', en: 'Africa' },
      { value: 'europe', zh: '欧洲', en: 'Europe' },
      { value: 'americas', zh: '美洲', en: 'Americas' },
      { value: 'oceania', zh: '大洋洲', en: 'Oceania' },
    ],
  },
  {
    key: 'degree',
    zh: '你的学位类型？',
    en: 'What are you studying?',
    helpEn: 'A one-semester exchange takes a different visa and skips several steps.',
    options: [
      { value: 'bachelor', zh: '本科', en: 'Bachelor' },
      { value: 'master', zh: '硕士', en: 'Master' },
      { value: 'phd', zh: '博士', en: 'PhD' },
      { value: 'exchange', zh: '交换生（一学期）', en: 'Exchange (one semester)' },
    ],
  },
  {
    key: 'campus',
    zh: '你在哪个校区？',
    en: 'Which campus?',
    helpEn: 'Arrival-week logistics and student notes differ between the two.',
    options: [
      { value: 'beijing', zh: '北京主校区', en: 'Beijing main campus' },
      { value: 'sigs', zh: '深圳国际研究生院', en: 'SIGS Shenzhen' },
    ],
  },
  {
    key: 'arrivalDate',
    type: 'date',
    zh: '你打算哪天抵达？',
    en: 'When do you arrive?',
    helpEn: 'Every deadline on your roadmap is counted back from this date.',
  },
  {
    key: 'funding',
    zh: '你的资金来源？',
    en: 'How is your study funded?',
    helpEn: 'Self-funded students get a week-by-week cash-flow plan.',
    options: [
      { value: 'scholarship', zh: '奖学金', en: 'Scholarship' },
      { value: 'self', zh: '自费', en: 'Self-funded' },
    ],
  },
  {
    key: 'housing',
    type: 'housing',
    zh: '你住在哪里？',
    en: 'Where will you live?',
    helpEn: 'Living off campus adds a 24-hour police registration step.',
    options: [
      { value: 'dorm', zh: '校内宿舍', en: 'On-campus dorm' },
      { value: 'offcampus', zh: '校外租房', en: 'Off-campus' },
    ],
  },
]

const defaultArrival = () => toISODay(addDays(today(), 60))

const BLANK = {
  region: '',
  degree: '',
  campus: '',
  arrivalDate: '',
  funding: '',
  housing: '',
  family: false,
}

const REVIEW = QUESTIONS.length // index of the review screen

const firstUnanswered = (a) => {
  const i = QUESTIONS.findIndex((q) => !a[q.key])
  return i === -1 ? REVIEW : i
}

function answerText(q, answers) {
  if (q.type === 'date') {
    const d = parseDay(answers.arrivalDate)
    return { zh: formatDay(d), en: formatDay(d) }
  }
  return labelFor(q.key, answers[q.key])
}

/** Last screen: every answer with an edit link, then build. */
function Review({ answers, persona, onEdit, onToggleFamily }) {
  return (
    <div className="q-body">
      <div className="q-head">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Chip>
            <Check size={14} />
          </Chip>
          <Bilingual zh="确认你的回答" en="Review your answers" as="h1" id="q-title" tabIndex={-1} />
        </div>
        <p className="muted" style={{ marginTop: 10, fontSize: 13.5 }}>
          Your roadmap is built from these. Change anything now or later from the roadmap.
          {persona && ` Pre-filled for “${persona.en}”.`}
        </p>
      </div>
      <dl className="review-list">
        {QUESTIONS.map((q, i) => {
          const t = answerText(q, answers)
          return (
            <div className="review-row" key={q.key}>
              <dt>
                <span className="lz">{q.zh}</span>
                <span className="le">{q.en}</span>
              </dt>
              <dd>
                <span className="review-val">
                  <span className="lz">{t.zh}</span>
                  <span className="lsep"> · </span>
                  <span className="le">{t.en}</span>
                </span>
                <button
                  type="button"
                  className="text-btn review-edit"
                  aria-label={`Edit: ${q.en}`}
                  onClick={() => onEdit(i)}
                >
                  <Pencil size={14} /> <L zh="修改" en="Edit" />
                </button>
              </dd>
            </div>
          )
        })}
        <div className="review-row">
          <dt>
            <span className="lz">是否有家属同行？</span>
            <span className="le">Coming with family?</span>
          </dt>
          <dd>
            <span className="review-val">
              {answers.family ? <L zh="是" en="Yes" /> : <L zh="否" en="No" />}
            </span>
            <button type="button" className="text-btn review-edit" onClick={onToggleFamily}>
              <L zh="切换" en="Change" />
            </button>
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default function Onboarding({ initial, onDone, onCancel }) {
  const [params] = useSearchParams()
  const personaId = params.get('persona')
  const persona = PERSONAS[personaId] || null

  const [answers, setAnswers] = useState(() =>
    persona ? { ...BLANK, ...persona.answers() } : { ...BLANK, ...(initial || {}) }
  )
  // Start at the first gap; a returning student with every answer lands on review.
  const [index, setIndex] = useState(() => firstUnanswered(answers))
  // After "Edit" on the review screen, answering jumps back to the review.
  const [returnToReview, setReturnToReview] = useState(false)

  const isReview = index === REVIEW
  const q = QUESTIONS[index]
  const value = q ? answers[q.key] : null
  const canAdvance = isReview ? QUESTIONS.every((x) => answers[x.key]) : !!value
  const isLast = index === QUESTIONS.length - 1

  useTitle(isReview ? 'Review your answers' : `Question ${index + 1} of ${QUESTIONS.length}`)

  // Move focus to the new question's heading so keyboard and screen-reader
  // users start at the top of each step — but not on first render.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    document.getElementById('q-title')?.focus()
  }, [index])

  const set = (key, v) => setAnswers((a) => ({ ...a, [key]: v }))

  const advance = () => {
    if (returnToReview) {
      setReturnToReview(false)
      setIndex(REVIEW)
    } else {
      setIndex((i) => Math.min(i + 1, REVIEW))
    }
  }

  const next = () => {
    if (!canAdvance) return
    if (isReview) onDone(answers)
    else advance()
  }

  const back = () => {
    if (returnToReview) {
      setReturnToReview(false)
      setIndex(REVIEW)
    } else if (index === 0) onCancel()
    else setIndex((i) => i - 1)
  }

  const choose = (v) => {
    set(q.key, v)
    // Single-choice questions advance on their own; the last one waits so the
    // family toggle underneath it stays reachable.
    // The guard stops a double tap from skipping a question.
    if (!isLast) {
      window.setTimeout(() => {
        setIndex((i) => (i === index ? (returnToReview ? REVIEW : i + 1) : i))
        setReturnToReview(false)
      }, 160)
    }
  }

  const step = Math.min(index + 1, QUESTIONS.length)

  return (
    <div className="shell narrow">
      <SampleBanner />
      <AppBar onBack={back} backLabel={index === 0 ? 'Back to home' : 'Previous question'} />
      <main id="main" tabIndex={-1}>

        <div className="progress-wrap">
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length + 1}
            aria-valuenow={index + 1}
            aria-label="Onboarding progress"
          >
            <div
              className="progress-fill"
              style={{ width: `${((index + 1) / (QUESTIONS.length + 1)) * 100}%` }}
            />
          </div>
          <div className="progress-meta mono">
            <span>
              {isReview ? 'Review' : `Question ${String(step).padStart(2, '0')} / ${QUESTIONS.length}`}
            </span>
            <span>{isReview ? '确认' : `问题 ${step}`}</span>
          </div>
        </div>

        {persona && (
          <div className="persona-banner">
            <span>
              <L zh="预设" en="Pre-filled for" />:{' '}
              <strong>
                <L zh={persona.zh} en={persona.en} />
              </strong>
            </span>
          </div>
        )}

        {isReview ? (
          <Review
            answers={answers}
            persona={persona}
            onEdit={(i) => {
              setReturnToReview(true)
              setIndex(i)
            }}
            onToggleFamily={() => set('family', !answers.family)}
          />
        ) : (
          <div className="q-body">
            <div className="q-head">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Chip>{String(index + 1).padStart(2, '0')}</Chip>
                <Bilingual zh={q.zh} en={q.en} as="h1" id="q-title" tabIndex={-1} />
              </div>
              <p className="muted" style={{ marginTop: 10, fontSize: 13.5 }}>
                {q.helpEn}
              </p>
            </div>

            {q.type === 'date' ? (
              <label className="date-field">
                <span className="mono muted" style={{ display: 'block', marginBottom: 8 }}>
                  <L zh="抵达日期" en="Arrival date" sep=" / " />
                </span>
                <input
                  type="date"
                  value={value || ''}
                  min={toISODay(today())}
                  onChange={(e) => set('arrivalDate', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && next()}
                />
                {!value && (
                  <button
                    type="button"
                    className="btn secondary"
                    style={{ marginTop: 12 }}
                    onClick={() => set('arrivalDate', defaultArrival())}
                  >
                    Use a date 60 days out
                  </button>
                )}
              </label>
            ) : (
              <div className="opts" role="group" aria-labelledby="q-title">
                {q.options.map((o) => {
                  const selected = value === o.value
                  return (
                    <button
                      type="button"
                      key={o.value}
                      className={`opt${selected ? ' selected' : ''}`}
                      aria-pressed={selected}
                      onClick={() => choose(o.value)}
                    >
                      <span className="opt-text">
                        <span className="opt-zh">{o.zh}</span>
                        <span className="opt-en">{o.en}</span>
                      </span>
                      {selected && <Check size={20} className="opt-mark" />}
                    </button>
                  )
                })}
              </div>
            )}

            {isLast && (
              <button
                type="button"
                className={`toggle-row${answers.family ? ' on' : ''}`}
                role="switch"
                aria-checked={answers.family}
                onClick={() => set('family', !answers.family)}
              >
                <Users size={22} />
                <span className="opt-text">
                  <span className="opt-zh">是否有家属同行？</span>
                  <span className="opt-en">Coming with family?</span>
                </span>
                <span className={`switch${answers.family ? ' on' : ''}`} aria-hidden="true">
                  <span />
                </span>
              </button>
            )}
          </div>
        )}

        <div className="q-dock">
          <button type="button" className="btn secondary back" onClick={back} aria-label="Back">
            <ArrowLeft size={22} />
          </button>
          <button type="button" className="btn" onClick={next} disabled={!canAdvance}>
            <span>
              <span className="btn-zh" style={{ display: 'block' }}>
                {isReview ? '生成我的路线图' : returnToReview ? '返回确认' : '下一步'}
              </span>
              <span className="le">
                {isReview ? 'Build my roadmap' : returnToReview ? 'Back to review' : 'Next'}
              </span>
            </span>
            <ArrowRight size={22} />
          </button>
        </div>
      </main>
    </div>
  )
}
