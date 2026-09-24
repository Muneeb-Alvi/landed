// The five stages of the Landed route. Order here is the order shown everywhere.
export const STAGES = [
  { id: 'offer', num: '01', zh: '录取确认', en: 'Offer' },
  { id: 'visa', num: '02', zh: '签证办理', en: 'Visa' },
  { id: 'predeparture', num: '03', zh: '行前准备', en: 'Pre-departure' },
  { id: 'arrival', num: '04', zh: '抵达首周', en: 'Arrival week' },
  { id: 'firstmonth', num: '05', zh: '第一个月', en: 'First month' },
]

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s]))
