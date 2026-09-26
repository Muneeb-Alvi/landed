import { describe, expect, it } from 'vitest'
import { buildRoadmap, orderNotes, pickKeyDates, pickThisWeek, stepNotes } from './roadmap.js'
import { verdictFor, whyLine } from './verdict.js'
import { getStep } from './roadmap.js'
import { parseDay, toISODay } from './date.js'

const NOW = parseDay('2026-09-01')
const base = {
  region: 'europe',
  degree: 'master',
  campus: 'beijing',
  arrivalDate: '2026-11-01',
  funding: 'self',
  housing: 'dorm',
  family: false,
}
const build = (answers = {}, user = {}) => buildRoadmap({ ...base, ...answers }, user, NOW)
const ids = (r) => r.steps.map((s) => s.id)

describe('buildRoadmap', () => {
  it('returns null without an arrival date', () => {
    expect(buildRoadmap({ ...base, arrivalDate: '' }, {}, NOW)).toBeNull()
  })

  it('counts deadlines back from arrival', () => {
    const r = build()
    const flight = r.steps.find((s) => s.id === 'book-flight') // offsetDays -35
    expect(toISODay(flight.deadline)).toBe('2026-09-27')
    expect(flight.daysLeft).toBe(26)
  })

  it('sizes the baseline, exchange and family roadmaps', () => {
    expect(build().totalCount).toBe(18)
    // exchange: X2 instead of X1; permit, bank, health verification gone; exam is MAYBE
    const ex = build({ degree: 'exchange' })
    expect(ids(ex)).toContain('visa-x2')
    expect(ids(ex)).not.toContain('visa-x1')
    expect(ids(ex)).not.toContain('residence-permit')
    expect(ex.steps.find((s) => s.id === 'physical-exam').verdict.verdict).toBe('maybe')
    expect(build({ family: true }).totalCount).toBe(20)
  })

  it('answering a MAYBE question updates the roadmap', () => {
    const yes = build({ degree: 'exchange' }, { followUps: { staysOver180: true } })
    const no = build({ degree: 'exchange' }, { followUps: { staysOver180: false } })
    expect(ids(yes)).toContain('physical-exam')
    expect(ids(no)).not.toContain('physical-exam')
    expect(no.skippedSteps.map((s) => s.id)).toContain('physical-exam')
  })

  it('hidden steps leave the timeline, totals and progress', () => {
    const before = build()
    const after = build({}, { hidden: { 'book-flight': true } })
    expect(after.totalCount).toBe(before.totalCount - 1)
    expect(after.hiddenSteps.map((s) => s.id)).toEqual(['book-flight'])
    expect(after.preArrivalCost[1]).toBe(before.preArrivalCost[1] - 12000)
  })

  it('moved due dates re-sort the step and keep the suggestion', () => {
    const r = build({}, { due: { 'book-flight': '2026-09-02' } })
    const flight = r.steps.find((s) => s.id === 'book-flight')
    expect(flight.moved).toBe(true)
    expect(toISODay(flight.suggestedDeadline)).toBe('2026-09-27')
    expect(flight.daysLeft).toBe(1)
    expect(r.thisWeek.map((s) => s.id)).toContain('book-flight')
  })

  it('custom steps join the timeline and the cost buckets', () => {
    const before = build()
    const r = build({}, {
      custom: [{ id: 'custom-1', title: 'Renew licence', date: '2026-11-03', stage: 'arrival', cost: 300 }],
    })
    const c = r.steps.find((s) => s.id === 'custom-1')
    expect(c.custom).toBe(true)
    expect(c.effectiveOffset).toBe(2)
    expect(r.totalCount).toBe(before.totalCount + 1)
    expect(r.firstThirtyCost[0]).toBe(before.firstThirtyCost[0] + 300)
    expect(r.byStage.find((st) => st.id === 'arrival').steps.map((s) => s.id)).toContain('custom-1')
  })

  it('late arrival defers deferrable steps to week two', () => {
    const r = build({ arrivalDate: '2026-09-08' })
    expect(r.lateArrival).toBe(true)
    const pay = r.steps.find((s) => s.id === 'mobile-pay')
    expect(pay.deferred).toBe(true)
    expect(pay.effectiveOffset).toBe(7)
  })
})

describe('this week and key dates', () => {
  const steps = [
    { id: 'a', daysLeft: -90, done: false },
    { id: 'b', daysLeft: 3, done: false },
    { id: 'c', daysLeft: -2, done: false },
    { id: 'd', daysLeft: 5, done: true },
    { id: 'e', daysLeft: 12, done: false, hard: true },
    { id: 'f', daysLeft: 4, done: false, hard: true },
    { id: 'g', daysLeft: -1, done: false, hard: true },
  ]

  it('picks the 3 unfinished steps nearest today, soonest first', () => {
    expect(pickThisWeek(steps).map((s) => s.id)).toEqual(['c', 'g', 'b'])
  })

  it('key dates are upcoming, unfinished hard deadlines', () => {
    expect(pickKeyDates(steps).map((s) => s.id)).toEqual(['f', 'e'])
  })
})

describe('verdicts', () => {
  it('explains a NO with the step reason', () => {
    const v = verdictFor(getStep('visa-x1'), { ...base, degree: 'exchange' })
    expect(v.verdict).toBe('no')
    expect(v.reason.en).toMatch(/X2/)
  })

  it('generates a why line from the answers that matter', () => {
    expect(whyLine(getStep('police-registration'), { ...base, housing: 'offcampus' }).en).toBe(
      "Because you're living off campus. Due 1 day after you arrive."
    )
    expect(whyLine(getStep('sim-card'), base).en).toMatch(/^Every incoming student/)
  })
})

describe('notes', () => {
  const notes = [
    { key: 'old-sigs', cohort: 'Fall 2025 · SIGS', date: '2025-06-01', upvotes: 90 },
    { key: 'new-bj', cohort: 'Fall 2026 · Beijing', date: '2026-06-01', upvotes: 10 },
    { key: 'mid-bj', cohort: 'Spring 2026 · Beijing', date: '2026-02-01', upvotes: 50 },
  ]
  const order = (sort, campus = 'sigs') =>
    orderNotes(notes, { campus }, {}, sort).map((n) => n.key)

  it('sorts by relevance, newest and upvotes', () => {
    expect(order('relevant')).toEqual(['old-sigs', 'new-bj', 'mid-bj'])
    expect(order('newest')).toEqual(['new-bj', 'mid-bj', 'old-sigs'])
    expect(order('upvoted')).toEqual(['old-sigs', 'mid-bj', 'new-bj'])
  })

  it('keeps seed note keys stable and merges local tips', () => {
    const step = getStep('accept-offer')
    const tips = [{ id: 't1', cohort: 'Fall 2026 · Beijing', date: '2026-09-01', text: 'x' }]
    const out = stepNotes(step, base, {}, tips, 'newest')
    expect(out[0]).toMatchObject({ key: 'tip|t1', mine: true })
    expect(out.map((n) => n.key)).toContain('Fall 2026 · Beijing|2026-04-11|0')
  })
})
