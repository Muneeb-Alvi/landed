// Display labels for onboarding answers, shared by the roadmap header, the
// onboarding review screen and the "why you're seeing this" lines.
export const ANSWER_LABELS = {
  region: {
    'east-asia': { zh: '东亚', en: 'East Asia' },
    'southeast-asia': { zh: '东南亚', en: 'SE Asia' },
    'south-asia': { zh: '南亚', en: 'South Asia' },
    africa: { zh: '非洲', en: 'Africa' },
    europe: { zh: '欧洲', en: 'Europe' },
    americas: { zh: '美洲', en: 'Americas' },
    oceania: { zh: '大洋洲', en: 'Oceania' },
  },
  degree: {
    bachelor: { zh: '本科', en: 'Bachelor' },
    master: { zh: '硕士', en: 'Master' },
    phd: { zh: '博士', en: 'PhD' },
    exchange: { zh: '交换', en: 'Exchange' },
  },
  campus: { beijing: { zh: '北京', en: 'Beijing' }, sigs: { zh: '深圳', en: 'SIGS' } },
  funding: { scholarship: { zh: '奖学金', en: 'Scholarship' }, self: { zh: '自费', en: 'Self-funded' } },
  housing: { dorm: { zh: '宿舍', en: 'Dorm' }, offcampus: { zh: '校外', en: 'Off-campus' } },
}

export const labelFor = (key, value) => ANSWER_LABELS[key]?.[value] || { zh: '—', en: '—' }
