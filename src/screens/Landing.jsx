import { STAGES } from '../data/stages.js'
import { Bilingual, Chip, SampleBanner } from '../components/Chrome.jsx'
import { ArrowRight, Route, Users } from '../components/Icons.jsx'

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

export default function Landing({ onStart, hasRoadmap, onResume }) {
  return (
    <div className="shell">
      <SampleBanner />

      <section className="hero">
        <p className="kicker">清华大学 · International Arrival</p>
        <h1 className="wordmark-xl">
          Landed<span className="dot">.</span>
        </h1>
        <p className="tag-zh">从录取通知书到宿舍钥匙，一步不慌</p>
        <p className="tag-en">From offer letter to dorm key — no surprises</p>

        <div className="rule" />

        <p className="manifesto-zh">真正的落地，不是拿到录取通知书，而是下一步永远心里有数。</p>
        <p className="manifesto-en">
          Real arrival isn't getting the offer letter. It's knowing your next step before you need
          it.
        </p>
      </section>

      <section className="section">
        <div className="section-head">
          <Chip>01</Chip>
          <Bilingual zh="五个阶段" en="The five stages" />
        </div>
        <ul className="route-strip">
          {STAGES.map((s) => (
            <li className="route-item" key={s.id}>
              <Chip ghost>{s.num}</Chip>
              <span className="route-text">
                <span className="r-zh">{s.zh}</span>
                <br />
                <span className="r-en">{s.en}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <Chip>02</Chip>
          <Bilingual zh="我们要避免的意外" en="Surprises we prevent" />
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <Chip>03</Chip>
          <Bilingual zh="两端共建" en="Two sides" />
        </div>
        <div className="two-sides">
          <div className="side">
            <p className="side-num">01</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 6 }}>
              <Route size={22} />
              <div>
                <Bilingual zh="新生" en="Incoming students" size="sm" as="h3" />
                <p style={{ marginTop: 6, fontSize: 14 }}>
                  Get the roadmap: an ordered checklist, a countdown and a cost estimate.
                </p>
              </div>
            </div>
          </div>
          <div className="side">
            <p className="side-num">02</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 6 }}>
              <Users size={22} />
              <div>
                <Bilingual zh="学长学姐" en="Current students" size="sm" as="h3" />
                <p style={{ marginTop: 6, fontSize: 14 }}>
                  Annotate steps, update costs and answer questions for the next cohort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="footer-note">
        <Bilingual zh="信任规则" en="Trust rules" size="sm" onInk as="h3" />
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
            <span>Newest notes sort first, and notes over 18 months old are flagged.</span>
          </li>
        </ul>
      </div>

      <div className="cta-dock">
        <button type="button" className="btn" onClick={onStart}>
          <span>
            <span className="btn-zh" style={{ display: 'block' }}>
              生成我的路线图
            </span>
            Build my roadmap
          </span>
          <ArrowRight size={22} />
        </button>
        {hasRoadmap && (
          <button
            type="button"
            className="btn secondary"
            style={{ marginTop: 10 }}
            onClick={onResume}
          >
            <span>
              <span className="btn-zh" style={{ display: 'block' }}>
                查看已保存的路线图
              </span>
              Open saved roadmap
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
