// All dates are handled as local calendar days. Times are irrelevant here and
// midday anchoring avoids the off-by-one that UTC parsing causes near midnight.

const MS_PER_DAY = 86400000

export function parseDay(value) {
  if (!value) return null
  const [y, m, d] = String(value).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export function today() {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12, 0, 0, 0)
}

export function addDays(date, days) {
  const d = new Date(date.getTime())
  d.setDate(d.getDate() + days)
  return d
}

export function daysBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY)
}

export function toISODay(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

// "04 SEP 2026" — mono, unambiguous for an international audience.
export function formatDay(date) {
  if (!date) return '—'
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

const MONTHS_TITLE = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "24 Sep" — for scannable strips where the year is obvious from context.
export function formatShort(date) {
  if (!date) return '—'
  return `${date.getDate()} ${MONTHS_TITLE[date.getMonth()]}`
}

export function formatNoteDate(iso) {
  const d = parseDay(iso)
  return d ? formatDay(d) : iso
}

// Student notes lose value fast. Anything older than this is flagged in the UI.
export const STALE_AFTER_DAYS = 540

export function isStale(iso, now = today()) {
  const d = parseDay(iso)
  return d ? daysBetween(d, now) > STALE_AFTER_DAYS : false
}
