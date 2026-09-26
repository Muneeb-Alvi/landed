import { useMemo, useState } from 'react'
import { AppBar, Bilingual, L, LevelChip, SampleBanner } from '../components/Chrome.jsx'
import { Alert, ArrowLeft, Close } from '../components/Icons.jsx'
import { SAMPLE_DOCUMENT, scanDocument } from '../lib/docscan.js'

const KIND_ORDER = { phrase: 0, date: 1, money: 2 }

/** Paste text from an admission letter, dorm contract or email; get flagged lines. */
export default function CheckDocument({ onBack }) {
  const [text, setText] = useState('')
  const result = useMemo(() => scanDocument(text), [text])
  const hasText = text.trim().length > 0

  return (
    <div className="shell">
      <SampleBanner />
      <AppBar onBack={onBack} backLabel="Back" />

      <div className="band">
        <Bilingual zh="检查一份文件" en="Check a document" onInk as="h1" />
        <p style={{ marginTop: 10, fontSize: 14 }}>
          Paste text from an admission letter, dorm contract or email. Landed pulls out dates, money
          amounts and risky phrases so you know which lines to read twice.
        </p>
      </div>

      <div className="section check-layout">
        <div className="check-input">
          <div className="card accent check-disclaimer" role="note">
            <p className="card-label">
              <Alert size={13} /> <L zh="规则检查" en="Rule-based check" />
            </p>
            <p style={{ fontSize: 14 }}>
              <strong>Rule-based check. Always read the original.</strong> A simple pattern match
              runs in your browser — nothing is uploaded, sent or saved. It will miss things.
            </p>
          </div>

          <label className="field">
            <span className="field-label">
              <L zh="粘贴文本" en="Paste text" />
            </span>
            <textarea
              className="check-text"
              rows={10}
              value={text}
              spellCheck={false}
              placeholder="Paste the text of a letter, contract or email here…"
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <div className="form-actions">
            <button type="button" className="btn secondary small" onClick={() => setText(SAMPLE_DOCUMENT)}>
              <L zh="试用示例" en="Try a sample" />
            </button>
            {hasText && (
              <button type="button" className="btn secondary small" onClick={() => setText('')}>
                <Close size={16} />
                <L zh="清空" en="Clear" />
              </button>
            )}
          </div>
        </div>

        <div className="check-results" aria-live="polite">
          {!hasText ? (
            <div className="empty-state">
              <p className="empty-zh">还没有内容</p>
              <p className="empty-en">Paste some text, or try the sample, to see flagged lines.</p>
            </div>
          ) : result.lines.length === 0 ? (
            <div className="empty-state">
              <p className="empty-zh">没有发现标记</p>
              <p className="empty-en">
                No dates, amounts or risky phrases matched. That does not mean there are none —
                read the original.
              </p>
            </div>
          ) : (
            <>
              <div className="check-summary">
                {['high', 'med', 'low'].map((lv) => (
                  <div key={lv} className="check-count">
                    <LevelChip level={lv} />
                    <span className="check-count-num">{result.counts[lv]}</span>
                  </div>
                ))}
              </div>

              <div className="summary-grid">
                <div className="stat">
                  <p className="card-label">
                    <L zh="日期" en="Dates found" />
                  </p>
                  <ul className="found-list">
                    {result.dates.length ? result.dates.map((d) => <li key={d}>{d}</li>) : <li>—</li>}
                  </ul>
                </div>
                <div className="stat">
                  <p className="card-label">
                    <L zh="金额" en="Amounts found" />
                  </p>
                  <ul className="found-list">
                    {result.amounts.length ? result.amounts.map((a) => <li key={a}>{a}</li>) : <li>—</li>}
                  </ul>
                </div>
              </div>

              <Bilingual zh="标记的句子" en="Flagged lines" size="sm" as="h2" />
              <ol className="flagged-lines">
                {result.lines.map((l, i) => (
                  <li key={`${l.n}-${i}`} className={`flagged ${l.level}`}>
                    <div className="flagged-head">
                      <LevelChip level={l.level} />
                      <span className="flagged-n">Line {l.n}</span>
                    </div>
                    <p className="flagged-text">{l.text}</p>
                    <ul className="finding-tags">
                      {[...l.findings]
                        .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind])
                        .map((f, j) => (
                          <li key={j} className={`finding ${f.kind}`}>
                            <L zh={f.zh} en={f.en} />: <span className="finding-match">{f.match}</span>
                          </li>
                        ))}
                    </ul>
                    {l.escalated && (
                      <p className="field-hint">Obligation + time limit on the same line → HIGH</p>
                    )}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>

      <div className="detail-dock">
        <button type="button" className="btn secondary" onClick={onBack}>
          <ArrowLeft size={20} />
          <L zh="返回" en="Back" />
        </button>
      </div>
    </div>
  )
}
