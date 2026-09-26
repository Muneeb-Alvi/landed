/**
 * SAMPLE DATA — the document checklist.
 *
 * Every entry restates a document already named in a step's officialRequirement
 * or notes in steps.js; nothing here is sourced from Tsinghua University.
 * A document shows up when at least one step in `neededFor` is on the
 * student's roadmap.
 *
 *   id, zh, en
 *   neededFor — step ids that ask for it
 *   hint      — one line on where it comes from or what to watch
 */
export const DOCUMENTS = [
  {
    id: 'passport',
    zh: '护照',
    en: 'Passport',
    neededFor: ['visa-x1', 'visa-x2', 'campus-registration', 'sim-card', 'mobile-pay', 'bank-account', 'residence-permit', 'police-registration'],
    hint: 'Needed in person for SIM, bank and registration.',
  },
  {
    id: 'admission-notice',
    zh: '录取通知书（原件）',
    en: 'Admission notice (original)',
    neededFor: ['visa-x1', 'visa-x2', 'campus-registration', 'pack-essentials'],
    hint: 'Arrives by courier with the JW202.',
  },
  {
    id: 'jw202',
    zh: 'JW202 / JW201 表（原件）',
    en: 'JW202 / JW201 form (original)',
    neededFor: ['visa-x1', 'visa-x2', 'campus-registration'],
    hint: 'Check every field the day it arrives; do not fold it.',
  },
  {
    id: 'physical-exam-form',
    zh: '外国人体格检查表',
    en: 'Foreigner physical examination form',
    neededFor: ['physical-exam', 'visa-x1', 'health-check-verification'],
    hint: 'Every page and the photo stamped by the clinic.',
  },
  {
    id: 'photos',
    zh: '白底证件照 8–10 张',
    en: '8–10 passport photos, white background',
    neededFor: ['campus-card', 'residence-permit', 'bank-account'],
    hint: 'Campus card, bank and exit-entry bureau all asked for one.',
  },
  {
    id: 'relationship-docs',
    zh: '结婚/出生证明（公证+翻译）',
    en: 'Marriage / birth certificates (notarised, translated)',
    neededFor: ['dependent-visa', 'dependent-registration'],
    hint: 'Notarised translation took over two weeks in one note.',
  },
  {
    id: 'tenancy',
    zh: '租房合同与房东房产证明',
    en: 'Tenancy contract + landlord’s ownership document',
    neededFor: ['offcampus-search', 'police-registration'],
    hint: 'Without the ownership document registration may be refused.',
  },
  {
    id: 'registration-slip',
    zh: '住宿登记回执',
    en: 'Accommodation registration slip',
    neededFor: ['police-registration', 'residence-permit'],
    hint: 'The exit-entry bureau asks for it later.',
  },
  {
    id: 'health-certificate',
    zh: '体检核验证明',
    en: 'Health verification certificate',
    neededFor: ['health-check-verification', 'residence-permit'],
    hint: 'Required for the residence permit.',
  },
  {
    id: 'university-letter',
    zh: '学校出具的在读/居留函',
    en: 'University letter for the residence permit',
    neededFor: ['residence-permit', 'bank-account'],
    hint: 'Issued after campus registration.',
  },
]

/** Documents relevant to the given roadmap steps, with the steps that need them. */
export function documentsFor(steps) {
  const byId = new Map(steps.map((s) => [s.id, s]))
  return DOCUMENTS.map((d) => ({
    ...d,
    steps: d.neededFor.map((id) => byId.get(id)).filter(Boolean),
  })).filter((d) => d.steps.length > 0)
}
