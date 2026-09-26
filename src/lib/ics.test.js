import { describe, expect, it } from 'vitest'
import { buildICS, escapeText, foldLine } from './ics.js'
import { parseDay } from './date.js'

const NOW = new Date(Date.UTC(2026, 8, 1, 9, 30, 0))
const steps = [
  { id: 'visa-x1', titleEn: 'Apply for the X1 student visa', titleZh: '申请X1学习签证', deadline: parseDay('2026-09-16'), realWait: '4–7 working days', costCNY: [400, 1100] },
  { id: 'custom-1', custom: true, titleEn: 'Renew licence, sign form; bring pen', titleZh: 'x', deadline: parseDay('2026-12-31') },
]

describe('buildICS', () => {
  const ics = buildICS(steps, { now: NOW })
  const lines = ics.split('\r\n')

  it('wraps events in a VCALENDAR with CRLF line endings', () => {
    expect(lines[0]).toBe('BEGIN:VCALENDAR')
    expect(lines).toContain('VERSION:2.0')
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/\n/)
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2)
  })

  it('writes all-day events that end the next day', () => {
    expect(lines).toContain('DTSTART;VALUE=DATE:20260916')
    expect(lines).toContain('DTEND;VALUE=DATE:20260917')
    expect(lines).toContain('DTEND;VALUE=DATE:20270101') // year rollover
    expect(lines).toContain('DTSTAMP:20260901T093000Z')
    expect(lines).toContain('UID:visa-x1@landed')
    expect(lines).toContain('TRIGGER:-P1D')
  })

  it('escapes text and labels the data as sample', () => {
    expect(ics).toContain('SUMMARY:Renew licence\\, sign form\\; bring pen')
    expect(ics.replace(/\r\n /g, '')).toContain('sample data for a prototype')
  })

  it('folds every line to 75 octets', () => {
    const enc = new TextEncoder()
    for (const l of lines) expect(enc.encode(l).length).toBeLessThanOrEqual(75)
  })
})

describe('helpers', () => {
  it('escapes backslash, semicolon, comma and newline', () => {
    expect(escapeText('a\\b;c,d\ne')).toBe('a\\\\b\\;c\\,d\\ne')
  })

  it('never splits a multi-byte character when folding', () => {
    const folded = foldLine('SUMMARY:' + '落地清华'.repeat(20))
    const unfolded = folded.replace(/\r\n /g, '')
    expect(unfolded).toBe('SUMMARY:' + '落地清华'.repeat(20))
    expect(folded).not.toContain('�')
  })
})
