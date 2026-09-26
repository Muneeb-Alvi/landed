import { addDays, toISODay, today } from '../lib/date.js'

// The four use cases from the Landed poster. Each opens onboarding with the
// answer that defines it pre-filled; the student fills in the rest.
export const PERSONAS = {
  late: {
    zh: '临近抵达',
    en: 'Late arrival',
    arrowZh: '优先级排序',
    arrowEn: 'Priority sorting',
    blurb: 'Arriving in under two weeks. The three things that matter first, the rest pushed to week two.',
    answers: () => ({ arrivalDate: toISODay(addDays(today(), 10)) }),
  },
  family: {
    zh: '携家属同行',
    en: 'Arriving with family',
    arrowZh: '多人手续',
    arrowEn: 'Multi-person paperwork',
    blurb: 'Dependent visas and registration for every family member, merged into one timeline.',
    answers: () => ({ family: true }),
  },
  exchange: {
    zh: '一学期交换',
    en: 'One-semester exchange',
    arrowZh: '精简步骤',
    arrowEn: 'Step trimming',
    blurb: 'X2 visa, fewer steps, and a clear reason for every step you can skip.',
    answers: () => ({ degree: 'exchange' }),
  },
  budget: {
    zh: '预算紧张',
    en: 'Tight budget',
    arrowZh: '现金流规划',
    arrowEn: 'Cash-flow planning',
    blurb: 'Week-by-week spending for the first month, before the first stipend or transfer lands.',
    answers: () => ({ funding: 'self' }),
  },
}
