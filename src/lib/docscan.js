// Rule-based document check. Runs entirely in the browser: no AI, no network.
//
// It splits pasted text into lines (and long lines into sentences), then looks
// for three things on each: dates, money amounts and risky phrases. Each hit
// has a level; a line takes the highest level among its hits. An obligation
// ("must", "required") on the same line as a time limit or date is escalated,
// because that combination is what a missed deadline usually looks like.
//
// It is deliberately simple and will miss things. The UI says so.

export const LEVEL_RANK = { high: 0, med: 1, low: 2 }
const maxLevel = (a, b) => (!a ? b : !b ? a : LEVEL_RANK[a] <= LEVEL_RANK[b] ? a : b)

const MONTH =
  '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)'
const ORD = '(?:st|nd|rd|th)?'

const DATE_PATTERNS = [
  /\b\d{4}[-/.]\d{1,2}[-/.]\d{1,2}\b/g, // 2026-09-24
  /\b\d{1,2}[/.]\d{1,2}[/.](?:\d{4}|\d{2})\b/g, // 24/09/2026
  new RegExp(`\\b\\d{1,2}${ORD}\\s+(?:of\\s+)?${MONTH}\\.?(?:,?\\s+\\d{4})?\\b`, 'gi'), // 24 Sep 2026
  new RegExp(`\\b${MONTH}\\.?\\s+\\d{1,2}${ORD}(?:,?\\s+\\d{4})?\\b`, 'gi'), // September 24, 2026
  /\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日/g, // 2026年9月24日
  /(?<![年\d])\d{1,2}\s*月\s*\d{1,2}\s*日/g, // 9月24日
]

const MONEY_PATTERNS = [
  /\b(?:CNY|RMB|USD|EUR|GBP|HKD)\s?\d[\d,]*(?:\.\d+)?/gi, // CNY 1,200
  /[¥￥$€£]\s?\d[\d,]*(?:\.\d+)?/g, // ¥1,200
  /\b\d[\d,]*(?:\.\d+)?\s?(?:yuan|RMB|CNY|USD|dollars?|euros?)\b/gi, // 1,200 yuan
  /\d[\d,]*(?:\.\d+)?\s?元/g, // 1200元
]

// Phrases, most severe first. `obligation` marks the ones that escalate when a
// time limit or date shares the line.
export const PHRASE_RULES = [
  {
    id: 'non-refundable',
    level: 'high',
    zh: '不可退款',
    en: 'Non-refundable',
    re: /\bnon[-\s]?refundable\b|\bnot\s+(?:be\s+)?refund(?:able|ed)\b|\bno\s+refunds?\b|不予退[还款]|概不退[还款]|不退[还款]/gi,
  },
  {
    id: 'penalty',
    level: 'high',
    zh: '罚款/违约',
    en: 'Penalty or fine',
    re: /\bpenalt(?:y|ies)\b|\bfined?\b|\bfines\b|\blate\s+fees?\b|罚款|违约金|滞纳金/gi,
  },
  {
    id: 'auto-renew',
    level: 'high',
    zh: '自动续约',
    en: 'Auto-renews',
    re: /\bauto(?:matic(?:ally)?)?[-\s]?renew(?:s|al|ed|ing)?\b|自动续[约费期订]/gi,
  },
  {
    id: 'forfeit',
    level: 'high',
    zh: '作废/没收',
    en: 'Forfeit',
    re: /\bforfeit(?:s|ed|ure)?\b|\bwill\s+be\s+(?:cancelled|canceled|revoked|released)\b|作废|没收|取消资格/gi,
  },
  {
    id: 'time-limit',
    level: 'med',
    zh: '时限',
    en: 'Time limit',
    re: /\bwithin\s+(?:\d+|one|two|three|four|five|six|seven|ten|fourteen|thirty)\s+(?:working\s+|business\s+|calendar\s+)?(?:days?|hours?|weeks?|months?)\b|\d+\s*(?:个工作日|个月|天|日|小时|周)(?:之)?内/gi,
  },
  {
    id: 'deadline',
    level: 'med',
    zh: '截止',
    en: 'Deadline',
    re: /\bdeadline\b|\bno\s+later\s+than\b|\bdue\s+(?:by|on|date)\b|\bexpir(?:es|y|ation)\b|\bclos(?:es|ing)\s+on\b|截止|最迟|逾期/gi,
  },
  {
    id: 'deposit',
    level: 'med',
    zh: '押金',
    en: 'Deposit',
    re: /\bdeposits?\b|押金|保证金|定金/gi,
  },
  {
    id: 'cancellation',
    level: 'med',
    zh: '取消条款',
    en: 'Cancellation terms',
    re: /\bcancell?ation\b|\bterminat(?:e|ion)\b|解约|退租/gi,
  },
  {
    id: 'must',
    level: 'low',
    zh: '必须',
    en: 'Obligation',
    obligation: true,
    re: /\bmust\b|\bmandatory\b|\bis\s+required\b|\bare\s+required\b|\bshall\b|必须|务必|应当/gi,
  },
]

function collect(text, patterns) {
  const hits = []
  for (const re of patterns) {
    re.lastIndex = 0
    for (const m of text.matchAll(re)) hits.push({ match: m[0].trim(), index: m.index })
  }
  // Drop hits contained inside a longer hit (e.g. "24 Sep" inside "24 Sep 2026").
  hits.sort((a, b) => a.index - b.index || b.match.length - a.match.length)
  const out = []
  let end = -1
  for (const h of hits) {
    if (h.index >= end) {
      out.push(h)
      end = h.index + h.match.length
    }
  }
  return out
}

/** Split into scan units: lines, and long lines into sentences. */
export function splitLines(text) {
  const units = []
  String(text || '')
    .split(/\r?\n/)
    .forEach((line, i) => {
      const trimmed = line.trim()
      if (!trimmed) return
      const parts =
        trimmed.length > 160 ? trimmed.split(/(?<=[.!?。！？；;])\s*(?=\S)/) : [trimmed]
      parts.forEach((p) => p.trim() && units.push({ n: i + 1, text: p.trim() }))
    })
  return units
}

/** Scan one line. Returns null when nothing was found. */
export function scanLine(text) {
  const findings = []
  for (const h of collect(text, DATE_PATTERNS)) {
    findings.push({ kind: 'date', level: 'low', zh: '日期', en: 'Date', match: h.match })
  }
  for (const h of collect(text, MONEY_PATTERNS)) {
    findings.push({ kind: 'money', level: 'low', zh: '金额', en: 'Amount', match: h.match })
  }
  for (const rule of PHRASE_RULES) {
    for (const h of collect(text, [rule.re])) {
      findings.push({
        kind: 'phrase',
        rule: rule.id,
        level: rule.level,
        zh: rule.zh,
        en: rule.en,
        match: h.match,
      })
    }
  }
  if (findings.length === 0) return null

  let level = findings.reduce((acc, f) => maxLevel(acc, f.level), null)
  const hasObligation = findings.some((f) => f.rule === 'must')
  const hasClock = findings.some((f) => f.kind === 'date' || f.rule === 'time-limit' || f.rule === 'deadline')
  let escalated = false
  if (hasObligation && hasClock && level !== 'high') {
    level = 'high'
    escalated = true
  }
  return { level, escalated, findings }
}

/**
 * Scan pasted text.
 * Returns { lines, dates, amounts, counts } where `lines` holds only the lines
 * with at least one finding, in document order.
 */
export function scanDocument(text) {
  const lines = []
  for (const unit of splitLines(text)) {
    const result = scanLine(unit.text)
    if (result) lines.push({ ...unit, ...result })
  }
  const uniq = (kind) => [
    ...new Set(lines.flatMap((l) => l.findings.filter((f) => f.kind === kind).map((f) => f.match))),
  ]
  const counts = { high: 0, med: 0, low: 0 }
  lines.forEach((l) => counts[l.level]++)
  return { lines, dates: uniq('date'), amounts: uniq('money'), counts }
}

// Fictional text for the "Try a sample" button. Not from any real document.
export const SAMPLE_DOCUMENT = `SAMPLE — fictional dormitory agreement for testing this tool

1. The accommodation deposit of CNY 1,500 is non-refundable once the room is allocated.
2. Students must complete check-in within 3 days of the registration date.
3. Rent of ¥1,200 per month is due by the 5th of each month. Late payments incur a late fee of 50 yuan per day.
4. This agreement will automatically renew for the next semester unless cancelled in writing no later than 15 December 2026.
5. Keys must be returned on departure. Lost keys: RMB 200.
6. Quiet hours are 23:00–07:00.`
