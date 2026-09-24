import { useState } from 'react'
import { AppBar, Bilingual, Chip, SampleBanner } from '../components/Chrome.jsx'
import { ArrowLeft, ArrowRight, Check, Users } from '../components/Icons.jsx'
import { toISODay, addDays, today } from '../lib/date.js'

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

export default function Onboarding({ initial, onDone, onCancel }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => ({
    region: '',
    degree: '',
    campus: '',
    arrivalDate: '',
    funding: '',
    housing: '',
    family: false,
    ...(initial || {}),
  }))

  const q = QUESTIONS[index]
  const value = answers[q.key]
  const canAdvance = q.type === 'date' ? !!value : !!value
  const isLast = index === QUESTIONS.length - 1

  const set = (key, v) => setAnswers((a) => ({ ...a, [key]: v }))

  const next = () => {
    if (!canAdvance) return
    if (isLast) onDone(answers)
    else setIndex((i) => i + 1)
  }

  const back = () => {
    if (index === 0) onCancel()
    else setIndex((i) => i - 1)
  }

  const choose = (v) => {
    set(q.key, v)
    // Single-choice questions advance on their own; the last one waits so the
    // family toggle underneath it stays reachable.
    if (!isLast) window.setTimeout(() => setIndex((i) => (i === index ? i + 1 : i)), 160)
  }

  return (
    <div className="shell">
      <SampleBanner />
      <AppBar onBack={back} backLabel="Previous question" />

      <div className="progress-wrap">
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={QUESTIONS.length}
          aria-valuenow={index + 1}
          aria-label="Onboarding progress"
        >
          <div
            className="progress-fill"
            style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <div className="progress-meta mono">
          <span>
            Question {String(index + 1).padStart(2, '0')} / {QUESTIONS.length}
          </span>
          <span>问题 {index + 1}</span>
        </div>
      </div>

      <div className="q-body">
        <div className="q-head">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Chip>{String(index + 1).padStart(2, '0')}</Chip>
            <Bilingual zh={q.zh} en={q.en} as="h1" />
          </div>
          <p className="muted" style={{ marginTop: 10, fontSize: 13.5 }}>
            {q.helpEn}
          </p>
        </div>

        {q.type === 'date' ? (
          <label className="date-field">
            <span className="mono muted" style={{ display: 'block', marginBottom: 8 }}>
              抵达日期 / Arrival date
            </span>
            <input
              type="date"
              value={value || ''}
              min={toISODay(today())}
              onChange={(e) => set('arrivalDate', e.target.value)}
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
          <div className="opts">
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
                  <span>
                    <span className="opt-zh">{o.zh}</span>
                    <br />
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
            aria-pressed={answers.family}
            onClick={() => set('family', !answers.family)}
          >
            <Users size={22} />
            <span>
              <span className="opt-zh">是否有家属同行？</span>
              <br />
              <span className="opt-en">Coming with family?</span>
            </span>
            <span className={`switch${answers.family ? ' on' : ''}`} aria-hidden="true">
              <span />
            </span>
          </button>
        )}
      </div>

      <div className="q-dock">
        <button type="button" className="btn secondary back" onClick={back} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <button type="button" className="btn" onClick={next} disabled={!canAdvance}>
          <span>
            <span className="btn-zh" style={{ display: 'block' }}>
              {isLast ? '生成路线图' : '下一步'}
            </span>
            {isLast ? 'Build roadmap' : 'Next'}
          </span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  )
}
