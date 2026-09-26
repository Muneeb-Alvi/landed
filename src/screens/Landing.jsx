import { useTitle } from '../components/AppContext.js'
import { AppBar, Bilingual, Chip, L, SampleBanner } from '../components/Chrome.jsx'
import { ArrowRight, Route, Users } from '../components/Icons.jsx'
import { PERSONAS } from '../data/personas.js'
import { STAGES } from '../data/stages.js'

const SURPRISES = [
  {
    zh: '顺序错了',
    en: 'A step needs a document you only get from another step.',
  },
  {
    zh: '低估时间',
    en: '"Five working days" becomes three weeks in September.',
  },
  {
    zh: '隐藏开销',
    en: 'Deposits, bedding, health check, SIM and transport all land before the first stipend.',
  },
  {
    zh: '无法付款',
    en: 'No local bank card yet, but things already require one.',
  },
  {
    zh: '过时信息',
    en: "Last year's advice repeated as if it were still true.",
  },
]

function StartButton({ onClick, className = '' }) {
  return (
    <button type="button" className={`btn ${className}`} onClick={onClick}>
      <span>
        <span className="btn-zh" style={{ display: 'block' }}>
          生成我的路线图
        </span>
        <span className="le">Build my roadmap</span>
      </span>
      <ArrowRight size={22} />
    </button>
  )
}

export default function Landing({ onStart, hasRoadmap, onResume }) {
  useTitle(null)
  return (
    <div className="shell landing">
      <SampleBanner />
      <AppBar wordmark={false} />
      <main id="main" tabIndex={-1}>

        <section className="hero">
          <div className="hero-text">
            <p className="kicker">清华大学 · International Arrival</p>
            <h1 className="wordmark-xl">
              Landed<span className="dot">.</span>
            </h1>
            <p className="tag-zh">从录取通知书到宿舍钥匙，一步不慌</p>
            <p className="tag-en">From offer letter to dorm key — no surprises</p>
          </div>

          <div className="hero-side">
            <div className="rule" />
            <p className="manifesto-zh">真正的落地，不是拿到录取通知书，而是下一步永远心里有数。</p>
            <p className="manifesto-en">
              Real arrival isn't getting the offer letter. It's knowing your next step before you
              need it.
            </p>
            <div className="hero-cta">
              <StartButton onClick={() => onStart()} />
              {hasRoadmap && (
                <button type="button" className="btn ghost-ink" onClick={onResume}>
                  <L zh="查看已保存的路线图" en="Open saved roadmap" />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="cases-title">
          <div className="section-head">
            <Chip>01</Chip>
            <Bilingual zh="从你的情况开始" en="Start from your situation" id="cases-title" />
          </div>
          <ul className="persona-grid">
            {Object.entries(PERSONAS).map(([id, p]) => (
              <li key={id}>
                <button type="button" className="persona" onClick={() => onStart(id)}>
                  <span className="persona-case">
                    <span className="lz persona-zh">{p.zh}</span>
                    <span className="le persona-en">{p.en}</span>
                  </span>
                  <span className="persona-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="persona-feature">
                    <L zh={p.arrowZh} en={p.arrowEn} />
                  </span>
                  <span className="persona-blurb">{p.blurb}</span>
                  <span className="persona-go">
                    <L zh="用这个开始" en="Start with this" /> <ArrowRight size={16} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="how-title">
          <div className="section-head">
            <Chip>02</Chip>
            <Bilingual zh="如何运作" en="How it works" id="how-title" />
          </div>
          <div className="two-sides">
            <div className="side">
              <p className="side-num">01</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 6 }}>
                <Route size={22} />
                <div>
                  <Bilingual zh="路线引擎" en="Roadmap engine" size="sm" as="h3" />
                  <p style={{ marginTop: 6, fontSize: 14 }}>
                    Six answers become an ordered step list with deadlines counted back from your
                    arrival day, a document checklist and a first-month cost estimate. Hide, move or
                    add steps — it is your plan.
                  </p>
                </div>
              </div>
            </div>
            <div className="side">
              <p className="side-num">02</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 6 }}>
                <Users size={22} />
                <div>
                  <Bilingual zh="学生情报" en="Student intel" size="sm" as="h3" />
                  <p style={{ marginTop: 6, fontSize: 14 }}>
                    Every step carries notes from recent students — real waits, real costs, one tip
                    each — tagged by cohort and campus, plus red flags pulled from what went wrong.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="stages-title">
          <div className="section-head">
            <Chip>03</Chip>
            <Bilingual zh="五个阶段" en="The five stages" id="stages-title" />
          </div>
          <ol className="route-strip">
            {STAGES.map((s) => (
              <li className="route-item" key={s.id}>
                <Chip ghost>{s.num}</Chip>
                <span className="route-text">
                  <span className="r-zh">{s.zh}</span>
                  <span className="r-en">{s.en}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="surprises-title">
          <div className="section-head">
            <Chip>04</Chip>
            <Bilingual zh="我们要避免的意外" en="Surprises we prevent" id="surprises-title" />
          </div>
          <ul className="surprise-list">
            {SURPRISES.map((s) => (
              <li key={s.zh}>
                <span className="zh" style={{ flex: '0 0 76px' }}>
                  {s.zh}
                </span>
                <span>{s.en}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="footer-note">
          <Bilingual zh="信任规则" en="Trust rules" size="sm" onInk as="h2" />
          <ul className="trust-list" style={{ marginTop: 10 }}>
            <li>
              <span>—</span>
              <span>Every note carries a cohort tag, e.g. "Fall 2026 · SIGS".</span>
            </li>
            <li>
              <span>—</span>
              <span>
                Official requirements link to an official source. Student notes add timing and cost;
                they never replace the rules.
              </span>
            </li>
            <li>
              <span>—</span>
              <span>Notes from your campus sort first, and notes over 18 months old are flagged.</span>
            </li>
            <li>
              <span>—</span>
              <span>
                This prototype runs on sample data. Nothing you enter leaves your device.
              </span>
            </li>
          </ul>
        </div>

        <div className="cta-dock">
          <StartButton onClick={() => onStart()} />
          {hasRoadmap && (
            <button
              type="button"
              className="btn secondary"
              style={{ marginTop: 10 }}
              onClick={onResume}
            >
              <L zh="查看已保存的路线图" en="Open saved roadmap" />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
