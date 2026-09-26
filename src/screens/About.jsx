import { useState } from 'react'
import { useApp, useTitle } from '../components/AppContext.js'
import { AppBar, Bilingual, Chip, ConfirmDialog, L, LevelChip, SampleBanner } from '../components/Chrome.jsx'
import { ArrowLeft } from '../components/Icons.jsx'
import { STALE_AFTER_DAYS } from '../lib/date.js'
import { KEYS } from '../lib/storage.js'

const STORED = [
  ['answers', 'Your six onboarding answers and the family toggle'],
  ['checked', 'Steps you ticked off'],
  ['hidden', 'Steps you marked "not relevant to me"'],
  ['due', 'Due dates you moved by hand'],
  ['custom', 'Steps you added yourself'],
  ['myNotes', 'Your private notes on each step'],
  ['followUps', 'Your answers to MAYBE questions'],
  ['tips', 'Tips you shared (never sent anywhere)'],
  ['upvotes', 'Notes you upvoted'],
  ['flags', 'Notes you marked "this changed"'],
  ['docs', 'Documents you ticked on the checklist'],
  ['lang', 'Your language choice (kept on start over)'],
]

function Block({ num, zh, en, children }) {
  return (
    <section className="about-block">
      <div className="section-head" style={{ marginBottom: 10 }}>
        <Chip ghost>{num}</Chip>
        <Bilingual zh={zh} en={en} size="sm" />
      </div>
      <div className="about-body">{children}</div>
    </section>
  )
}

/** 关于数据 — what the data is, how notes are ordered, what stays on the device. */
export default function About({ onBack }) {
  useTitle('About the data')
  const { startOver } = useApp()
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="shell">
      <SampleBanner />
      <AppBar onBack={onBack} backLabel="Back" />
      <main id="main" tabIndex={-1}>

        <div className="band">
          <Bilingual zh="关于数据" en="About the data" onInk as="h1" />
          <p style={{ marginTop: 10, fontSize: 14 }}>
            Landed is a clickable prototype. Here is exactly what is real, what is sample, and what
            stays on your device.
          </p>
        </div>

        <div className="section about">
          <Block num="01" zh="全部是示例数据" en="Everything is sample data">
            <p>
              Every cost, wait time, red flag, student note and “verified” badge is{' '}
              <strong>fictional sample content</strong> written for this prototype. None of it comes
              from Tsinghua University. Official source links are deliberate placeholders. Use Landed
              to see how a plan could look, then check every rule with the university.
            </p>
          </Block>

          <Block num="02" zh="路线图如何生成" en="How the roadmap is built">
            <p>
              Each step has a deadline counted from your arrival date (arrival + offset; negative
              means before you land). Your answers decide which steps apply. When arrival is under 14
              days away, non-urgent steps move to week two. “This week” shows the three unfinished
              steps closest to today; “Key dates” shows the next three fixed deadlines.
            </p>
            <p>
              Every step has a verdict: <strong>YES</strong> (applies to you), <strong>NO</strong>{' '}
              (with the reason — see “Not for you” on the roadmap) or <strong>MAYBE</strong> (one
              follow-up question decides it).
            </p>
          </Block>

          <Block num="03" zh="学生情报如何排序" en="How notes are ordered">
            <ul className="trust-list">
              <li>
                <span>—</span>
                <span>
                  <strong>Most relevant</strong> (default): notes from your campus first, then newest,
                  then most upvoted.
                </span>
              </li>
              <li>
                <span>—</span>
                <span>
                  <strong>Newest</strong> and <strong>Most upvoted</strong> are one tap away.
                </span>
              </li>
              <li>
                <span>—</span>
                <span>
                  Notes older than {Math.round(STALE_AFTER_DAYS / 30)} months are flagged “may be
                  outdated”. Every note carries a cohort tag such as “Fall 2026 · SIGS”.
                </span>
              </li>
              <li>
                <span>—</span>
                <span>
                  “Verified current student” is a sample flag. The idea: a current student claims a
                  profile and the university confirms enrolment. No verification exists yet.
                </span>
              </li>
              <li>
                <span>—</span>
                <span>Student notes add timing and cost. They never replace the official rules.</span>
              </li>
            </ul>
          </Block>

          <Block num="04" zh="风险等级" en="Red flag levels">
            <ul className="about-levels">
              <li>
                <LevelChip level="high" /> Can cost you money, a deadline or your status.
              </li>
              <li>
                <LevelChip level="med" /> Adds time or cost if you miss it.
              </li>
              <li>
                <LevelChip level="low" /> Worth knowing.
              </li>
            </ul>
            <p>
              Step red flags restate what the sample notes already say. The document check uses the
              same levels from simple text rules — it is not AI and it will miss things.
            </p>
          </Block>

          <Block num="05" zh="保存在此设备" en="What stays on this device">
            <p>
              There is no account and no server. Everything below lives in your browser’s
              localStorage and never leaves this device. Clearing site data removes it.
            </p>
            <ul className="stored-list">
              {STORED.map(([name, what]) => (
                <li key={name}>
                  <code>{KEYS[name]}</code>
                  <span>{what}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn secondary small danger-outline"
              style={{ marginTop: 14 }}
              onClick={() => setConfirming(true)}
            >
              <L zh="重新开始" en="Start over — clear all data" />
            </button>
          </Block>
        </div>

        <div className="detail-dock">
          <button type="button" className="btn secondary" onClick={onBack}>
            <ArrowLeft size={20} />
            <L zh="返回" en="Back" />
          </button>
        </div>

        {confirming && (
          <ConfirmDialog
            titleZh="清除所有数据？"
            titleEn="Start over?"
            body="This clears your answers, ticks, hidden and custom steps, notes and tips from this device. It cannot be undone."
            confirmZh="清除"
            confirmEn="Clear everything"
            onCancel={() => setConfirming(false)}
            onConfirm={() => {
              setConfirming(false)
              startOver()
            }}
          />
        )}
      </main>
    </div>
  )
}
