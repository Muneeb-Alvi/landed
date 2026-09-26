import { describe, expect, it } from 'vitest'
import { SAMPLE_DOCUMENT, scanDocument, scanLine, splitLines } from './docscan.js'

describe('scanLine', () => {
  it('returns null for a line with nothing to flag', () => {
    expect(scanLine('Quiet hours are 23:00–07:00.')).toBeNull()
  })

  it('finds dates in several formats', () => {
    const found = (t) => scanLine(t).findings.filter((f) => f.kind === 'date').map((f) => f.match)
    expect(found('Arrive on 2026-09-24.')).toEqual(['2026-09-24'])
    expect(found('Arrive on 24 Sep 2026.')).toEqual(['24 Sep 2026'])
    expect(found('Arrive on September 24, 2026.')).toEqual(['September 24, 2026'])
    expect(found('请于2026年9月24日前报到')).toEqual(['2026年9月24日'])
  })

  it('finds money in several formats', () => {
    const found = (t) => scanLine(t).findings.filter((f) => f.kind === 'money').map((f) => f.match)
    expect(found('A fee of CNY 1,200 applies.')).toEqual(['CNY 1,200'])
    expect(found('Pay ¥350 or $50.')).toEqual(['¥350', '$50'])
    expect(found('押金2000元')).toEqual(['2000元'])
  })

  it('rates risky phrases', () => {
    expect(scanLine('The deposit is non-refundable.').level).toBe('high')
    expect(scanLine('This lease will auto-renew each term.').level).toBe('high')
    expect(scanLine('A penalty applies.').level).toBe('high')
    expect(scanLine('The deadline is in the portal.').level).toBe('med')
    expect(scanLine('You must bring your passport.').level).toBe('low')
  })

  it('escalates an obligation with a time limit to HIGH', () => {
    const r = scanLine('You must register within 24 hours of arrival.')
    expect(r.level).toBe('high')
    expect(r.escalated).toBe(true)
  })
})

describe('scanDocument', () => {
  it('splits long lines into sentences and keeps line numbers', () => {
    const units = splitLines('a\n\n' + 'Sentence one is long enough. '.repeat(8))
    expect(units[0]).toEqual({ n: 1, text: 'a' })
    expect(units.length).toBeGreaterThan(2)
    expect(units.every((u, i) => i === 0 || u.n === 3)).toBe(true)
  })

  it('summarises the sample document', () => {
    const r = scanDocument(SAMPLE_DOCUMENT)
    expect(r.counts).toEqual({ high: 4, med: 0, low: 1 })
    expect(r.dates).toEqual(['15 December 2026'])
    expect(r.amounts).toEqual(['CNY 1,500', '¥1,200', '50 yuan', 'RMB 200'])
    expect(r.lines.map((l) => l.n)).toEqual([3, 4, 5, 6, 7])
  })

  it('handles empty input', () => {
    expect(scanDocument('')).toEqual({ lines: [], dates: [], amounts: [], counts: { high: 0, med: 0, low: 0 } })
  })
})
