import { STEPS } from '../data/steps.js'
import { STAGES } from '../data/stages.js'
import { addDays, daysBetween, parseDay, today as todayFn } from './date.js'

// Arrival is "imminent" below this many days, which switches the roadmap into
// triage mode: a do-these-first banner and deferrable steps pushed to week two.
export const LATE_ARRIVAL_DAYS = 14

// SAMPLE: everyday spending (food, transport, small household) used by the
// cash-flow card so the weeks reflect real outgoings, not just step fees.
export const LIVING_COST_PER_WEEK_CNY = [450, 900]

/** Does this step apply to the answers given? Absent conditions mean "everyone". */
export function appliesTo(step, answers) {
  const c = step.appliesTo
  if (!c) return true
  if (c.degree && !c.degree.includes(answers.degree)) return false
  if (c.housing && !c.housing.includes(answers.housing)) return false
  if (c.funding && !c.funding.includes(answers.funding)) return false
  if (c.campus && !c.campus.includes(answers.campus)) return false
  if (c.family === true && !answers.family) return false
  return true
}

const cohortCampus = (cohort) => (/SIGS/i.test(cohort) ? 'sigs' : 'beijing')

/**
 * Order notes within a step: same-campus notes first (they are the ones that
 * match the reader's situation), then newest, then most upvoted.
 */
function orderNotes(notes, answers, upvotes) {
  return [...notes]
    .map((n, i) => ({
      ...n,
      key: `${n.cohort}|${n.date}|${i}`,
      matchesCampus: cohortCampus(n.cohort) === answers.campus,
    }))
    .sort((a, b) => {
      if (a.matchesCampus !== b.matchesCampus) return a.matchesCampus ? -1 : 1
      if (a.date !== b.date) return a.date < b.date ? 1 : -1
      const av = a.upvotes + (upvotes?.[a.key] ? 1 : 0)
      const bv = b.upvotes + (upvotes?.[b.key] ? 1 : 0)
      return bv - av
    })
}

export function getStep(id) {
  return STEPS.find((s) => s.id === id) || null
}

export function stepNotes(step, answers, upvotes) {
  return orderNotes(step.notes || [], answers, upvotes)
}

/**
 * Build the personalised roadmap.
 * Deadlines are arrivalDate + offsetDays; negative offsets fall before arrival.
 */
export function buildRoadmap(answers, checked = {}, now = todayFn()) {
  const arrival = parseDay(answers?.arrivalDate)
  if (!arrival) return null

  const daysUntilArrival = daysBetween(now, arrival)
  const lateArrival = daysUntilArrival >= 0 && daysUntilArrival < LATE_ARRIVAL_DAYS

  let steps = STEPS.filter((s) => appliesTo(s, answers)).map((s) => {
    const deadline = addDays(arrival, s.offsetDays)
    return {
      ...s,
      deadline,
      effectiveOffset: s.offsetDays,
      daysLeft: daysBetween(now, deadline),
      done: !!checked[s.id],
      deferred: false,
      shortStay: answers.degree === 'exchange',
    }
  })

  // Triage: the three unfinished steps whose deadlines sit closest to today,
  // in either direction. Ordering by raw offset would surface steps that are
  // months overdue and useless ("accept your offer") over the ones that are
  // actually about to bite.
  let doFirst = []
  if (lateArrival) {
    doFirst = steps
      .filter((s) => !s.done)
      .sort((a, b) => {
        const d = Math.abs(a.daysLeft) - Math.abs(b.daysLeft)
        if (d !== 0) return d
        return b.daysLeft - a.daysLeft // on a tie, the upcoming one first
      })
      .slice(0, 3)
      .sort((a, b) => a.daysLeft - b.daysLeft)
    const doFirstIds = new Set(doFirst.map((s) => s.id))

    steps = steps.map((s) => {
      if (!s.deferrable || s.done || doFirstIds.has(s.id) || s.offsetDays >= 7) return s
      const offset = 7 // start of week two
      const deadline = addDays(arrival, offset)
      return {
        ...s,
        deferred: true,
        effectiveOffset: offset,
        deadline,
        daysLeft: daysBetween(now, deadline),
      }
    })
  }

  steps.sort((a, b) => a.effectiveOffset - b.effectiveOffset)

  const byStage = STAGES.map((stage) => ({
    ...stage,
    steps: steps.filter((s) => s.stage === stage.id),
  })).filter((s) => s.steps.length > 0)

  const sum = (list) =>
    list.reduce(
      (acc, s) => [acc[0] + (s.costCNY?.[0] || 0), acc[1] + (s.costCNY?.[1] || 0)],
      [0, 0]
    )

  const preArrival = steps.filter((s) => s.effectiveOffset < 0)
  const firstThirty = steps.filter((s) => s.effectiveOffset >= 0 && s.effectiveOffset <= 30)

  const livingFirstMonth = [LIVING_COST_PER_WEEK_CNY[0] * 4, LIVING_COST_PER_WEEK_CNY[1] * 4]
  const firstThirtyStepCost = sum(firstThirty)
  const firstThirtyCost = [
    firstThirtyStepCost[0] + livingFirstMonth[0],
    firstThirtyStepCost[1] + livingFirstMonth[1],
  ]

  // The countdown should point at something you can still act on, so it takes
  // the nearest unfinished step that has not passed. Overdue work is counted
  // separately rather than parked in the countdown forever.
  const unfinished = steps.filter((s) => !s.done)
  const overdue = unfinished.filter((s) => s.daysLeft < 0)
  const nextStep =
    unfinished.find((s) => s.daysLeft >= 0) || overdue[overdue.length - 1] || null

  const doneCount = steps.filter((s) => s.done).length

  return {
    arrival,
    daysUntilArrival,
    lateArrival,
    steps,
    byStage,
    doFirst,
    nextStep,
    doneCount,
    overdueCount: overdue.length,
    totalCount: steps.length,
    preArrivalCost: sum(preArrival),
    firstThirtyCost,
    cashflow: answers.funding === 'self' ? buildCashflow(firstThirty, arrival) : null,
  }
}

/** Week-by-week outgoings for the first 30 days, for self-funded students. */
export function buildCashflow(firstThirtySteps, arrival) {
  const weeks = [
    { id: 'w1', zh: '第一周', en: 'Week 1', from: 0, to: 6 },
    { id: 'w2', zh: '第二周', en: 'Week 2', from: 7, to: 13 },
    { id: 'w3', zh: '第三周', en: 'Week 3', from: 14, to: 20 },
    { id: 'w4', zh: '第四周', en: 'Week 4', from: 21, to: 30 },
  ].map((w) => {
    const items = firstThirtySteps.filter(
      (s) => s.effectiveOffset >= w.from && s.effectiveOffset <= w.to
    )
    const stepCost = items.reduce(
      (acc, s) => [acc[0] + (s.costCNY?.[0] || 0), acc[1] + (s.costCNY?.[1] || 0)],
      [0, 0]
    )
    return {
      ...w,
      startDate: addDays(arrival, w.from),
      items,
      low: stepCost[0] + LIVING_COST_PER_WEEK_CNY[0],
      high: stepCost[1] + LIVING_COST_PER_WEEK_CNY[1],
    }
  })

  const peak = Math.max(...weeks.map((w) => w.high), 1)
  return weeks.map((w) => ({ ...w, share: w.high / peak }))
}

export function formatCNY(n) {
  return `¥${n.toLocaleString('en-US')}`
}

export function formatRange([low, high]) {
  return low === high ? formatCNY(low) : `${formatCNY(low)}–${formatCNY(high)}`
}
