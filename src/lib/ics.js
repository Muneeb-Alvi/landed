// iCalendar (RFC 5545) export of roadmap deadlines, as all-day events with a
// one-day reminder. Pure string building so it can be tested without a DOM.

const CRLF = '\r\n'

/** Escape TEXT values: backslash, semicolon, comma and newlines. */
export function escapeText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/**
 * Fold a content line to at most 75 octets per physical line, continuation
 * lines starting with a single space. Never splits a multi-byte character.
 */
export function foldLine(line) {
  const enc = new TextEncoder()
  const out = []
  let current = ''
  let bytes = 0
  for (const ch of line) {
    const size = enc.encode(ch).length
    const limit = out.length === 0 ? 75 : 74 // the leading space counts
    if (bytes + size > limit) {
      out.push(current)
      current = ch
      bytes = size
    } else {
      current += ch
      bytes += size
    }
  }
  out.push(current)
  return out.join(`${CRLF} `)
}

const pad = (n) => String(n).padStart(2, '0')
const icsDate = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
const icsStamp = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
  `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`

function nextDay(d) {
  const n = new Date(d.getTime())
  n.setDate(n.getDate() + 1)
  return n
}

function describe(step) {
  const lines = []
  if (step.custom) lines.push('Your own step, added in Landed.')
  else {
    if (step.realWait) lines.push(`Real wait (sample): ${step.realWait}`)
    if (step.costCNY?.[1] > 0) lines.push(`Cost (sample): CNY ${step.costCNY[0]}–${step.costCNY[1]}`)
  }
  lines.push('Landed 落地清华 — sample data for a prototype. Verify with official Tsinghua sources.')
  return lines.join('\n')
}

/**
 * @param steps  roadmap steps ({ id, deadline: Date, titleEn, titleZh, custom? })
 * @param opts   { now: Date, name: string }
 */
export function buildICS(steps, { now = new Date(), name = 'Landed arrival roadmap' } = {}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Landed//Arrival Roadmap//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(name)}`,
  ]
  for (const s of steps) {
    const summary = s.custom ? s.titleEn : `${s.titleEn} · ${s.titleZh}`
    lines.push(
      'BEGIN:VEVENT',
      `UID:${s.id}@landed`,
      `DTSTAMP:${icsStamp(now)}`,
      `DTSTART;VALUE=DATE:${icsDate(s.deadline)}`,
      `DTEND;VALUE=DATE:${icsDate(nextDay(s.deadline))}`,
      `SUMMARY:${escapeText(summary)}`,
      `DESCRIPTION:${escapeText(describe(s))}`,
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'TRIGGER:-P1D',
      `DESCRIPTION:${escapeText(`Due tomorrow: ${summary}`)}`,
      'END:VALARM',
      'END:VEVENT'
    )
  }
  lines.push('END:VCALENDAR')
  return lines.map(foldLine).join(CRLF) + CRLF
}

/** Browser-only: hand the calendar to the user as a download. */
export function downloadICS(text, filename = 'landed-deadlines.ics') {
  const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
