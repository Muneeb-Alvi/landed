// "Do I need this?" — a YES / NO / MAYBE verdict for one step, plus a short
// "why you're seeing this" line, both generated from the onboarding answers.
//
//   NO     appliesTo rules the step out (reason: step.skipReason or generated)
//   MAYBE  step.maybeIf.when matches and its follow-up question is unanswered
//   YES    everything else (reason: the answers that put it on the roadmap)
//
// Pure functions only, so the roadmap engine and the tests can share them.

import { labelFor } from '../data/labels.js'

const COND_KEYS = ['degree', 'housing', 'funding', 'campus']

function matches(cond, answers) {
  if (!cond) return true
  for (const k of COND_KEYS) {
    if (cond[k] && !cond[k].includes(answers[k])) return false
  }
  if (cond.family === true && !answers.family) return false
  return true
}

/** The condition keys in step.appliesTo that the answers fail. */
export function failedConditions(step, answers) {
  const c = step.appliesTo
  if (!c) return []
  const failed = COND_KEYS.filter((k) => c[k] && !c[k].includes(answers[k]))
  if (c.family === true && !answers.family) failed.push('family')
  return failed
}

const joinEn = (items) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} or ${items.at(-1)}`

function generatedNoReason(step, answers, failed) {
  const k = failed[0]
  if (k === 'family') return { zh: '只在有家属同行时需要。', en: 'Only needed when family travels with you.' }
  const allowed = step.appliesTo[k].map((v) => labelFor(k, v))
  const yours = labelFor(k, answers[k])
  return {
    zh: `仅适用于${allowed.map((a) => a.zh).join('、')}，你是${yours.zh}。`,
    en: `Only for ${joinEn(allowed.map((a) => a.en))} — you chose ${yours.en}.`,
  }
}

/**
 * @returns {{ verdict: 'yes'|'no'|'maybe', reason?: {zh,en}, question?: {key,zh,en},
 *             answered?: boolean }}
 */
export function verdictFor(step, answers, followUps = {}) {
  if (step.custom) {
    return { verdict: 'yes', reason: { zh: '这是你自己添加的步骤。', en: 'You added this step yourself.' } }
  }

  const failed = failedConditions(step, answers)
  if (failed.length) {
    return { verdict: 'no', reason: step.skipReason || generatedNoReason(step, answers, failed) }
  }

  const m = step.maybeIf
  if (m && matches(m.when, answers)) {
    const question = { key: m.key, ...m.question }
    const answer = followUps[m.key]
    if (answer === undefined) return { verdict: 'maybe', question }
    if (answer !== m.appliesIf) return { verdict: 'no', reason: m.no, question, answered: true }
    return { verdict: 'yes', question, answered: true }
  }

  return { verdict: 'yes' }
}

// How many options each answer has, so "applies to all of them" can be skipped.
const ANSWER_COUNTS = { degree: 4, housing: 2, funding: 2, campus: 2 }

const WHY = {
  degree: (v) => ({ zh: `你是${labelFor('degree', v).zh}学生`, en: `you're a ${labelFor('degree', v).en} student` }),
  housing: (v) =>
    v === 'offcampus'
      ? { zh: '你住校外', en: "you're living off campus" }
      : { zh: '你住校内宿舍', en: "you're in a campus dorm" },
  funding: (v) =>
    v === 'self'
      ? { zh: '你是自费生', en: "you're self-funded" }
      : { zh: '你有奖学金', en: "you're on a scholarship" },
  campus: (v) => ({ zh: `你在${labelFor('campus', v).zh}校区`, en: `you're at the ${labelFor('campus', v).en} campus` }),
  family: () => ({ zh: '有家属同行', en: 'family is coming with you' }),
}

function timing(offset) {
  if (offset === 0) return { zh: '截止在抵达当天。', en: 'Due on arrival day.' }
  const n = Math.abs(offset)
  const unit = n === 1 ? 'day' : 'days'
  return offset < 0
    ? { zh: `截止在抵达前${n}天。`, en: `Due ${n} ${unit} before you arrive.` }
    : { zh: `截止在抵达后${n}天。`, en: `Due ${n} ${unit} after you arrive.` }
}

/**
 * "Why you're seeing this step", from the answers that matter to it.
 * Conditions that list every possible value (e.g. both funding types) are
 * left out — they don't explain anything.
 */
export function whyLine(step, answers, followUps = {}) {
  if (step.custom) return { zh: '这是你自己添加的步骤。', en: 'You added this step yourself.' }

  const c = step.appliesTo || {}
  const parts = []
  for (const k of COND_KEYS) {
    if (c[k] && c[k].length < ANSWER_COUNTS[k]) {
      parts.push({ key: k, ...WHY[k](answers[k]) })
    }
  }
  if (c.family === true) parts.push(WHY.family())

  const m = step.maybeIf
  if (m && !matches(m.when, answers)) {
    // Outside the MAYBE group, the answers that kept the student out of it are
    // the reason (e.g. self-funded students always need a cash buffer).
    for (const k of COND_KEYS) {
      if (m.when[k] && !parts.some((p) => p.key === k)) parts.push({ key: k, ...WHY[k](answers[k]) })
    }
  }
  if (m && matches(m.when, answers) && followUps[m.key] !== undefined) {
    const a = followUps[m.key]
    parts.push({
      zh: `你对"${m.question.zh}"回答了"${a ? '是' : '否'}"`,
      en: `you answered ${a ? 'yes' : 'no'} to "${m.question.en}"`,
    })
  }

  const t = timing(step.offsetDays)
  if (parts.length === 0) {
    return { zh: `所有新生都要完成这一步。${t.zh}`, en: `Every incoming student does this. ${t.en}` }
  }
  return {
    zh: `因为${parts.map((p) => p.zh).join('，')}。${t.zh}`,
    en: `Because ${parts.map((p) => p.en).join(' and ')}. ${t.en}`,
  }
}
