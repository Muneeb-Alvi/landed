/**
 * SAMPLE DATA — prototype only.
 *
 * Every wait time, cost and student note below is fictional sample content
 * written for this prototype. Nothing here is sourced from Tsinghua University
 * and none of it should be used to plan a real move. Official source links are
 * deliberate placeholders.
 *
 * Step shape:
 *   id, stage, titleZh, titleEn, offsetDays (relative to arrival date; negative = before)
 *   appliesTo  — condition object; a step is included only if every key matches
 *                the user's answers. Omitted keys mean "applies to everyone".
 *                  degree:  ['bachelor','master','phd','exchange']
 *                  housing: ['dorm','offcampus']
 *                  funding: ['scholarship','self']
 *                  campus:  ['beijing','sigs']
 *                  family:  true  (only when travelling with family)
 *   officialRequirement, officialSourceUrl (PLACEHOLDER)
 *   realWait     — what students report it actually takes
 *   costCNY      — [low, high] in CNY
 *   shortStayTip — extra line shown to one-semester exchange students
 *   deferrable   — may be pushed to week two when the arrival date is imminent
 *   hard         — a fixed deadline (legal clock or closing window); feeds KEY DATES
 *   redFlags     — [{ level: 'high'|'med'|'low', zh, en }] SAMPLE warnings, each
 *                  restating something already in this step's notes or requirement
 *   notes        — [{ cohort, date, text, upvotes }]
 */

export const STEPS = [
  // ---------------------------------------------------------------- 01 OFFER
  {
    id: 'accept-offer',
    stage: 'offer',
    titleZh: '确认接受录取',
    titleEn: 'Accept your offer',
    offsetDays: -120,
    officialRequirement:
      'Confirm acceptance in the online admissions system before the deadline stated in your offer. Unconfirmed offers may be released to waitlisted applicants.',
    officialSourceUrl: 'https://example.org/landed-placeholder/admissions-accept',
    realWait: 'Instant, but the confirmation email can take 1–2 days',
    costCNY: [0, 0],
    hard: true,
    redFlags: [
      { level: 'med', zh: '确认邮件常进垃圾箱', en: 'Confirmation email often lands in spam' },
      { level: 'low', zh: '该页面之后可能无法再打开', en: 'Save a PDF \u2014 the acceptance page may close later' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-04-11',
        text:
          'Accepted on the portal and then heard nothing for two days and panicked. The confirmation email lands in spam — search the sender domain before you email the office.',
        upvotes: 41,
      },
      {
        cohort: 'Spring 2026 · SIGS',
        date: '2026-01-19',
        text:
          'Download a PDF of the acceptance screen right away. I needed it later for a scholarship form and the portal had already closed that page.',
        upvotes: 27,
      },
    ],
  },
  {
    id: 'admission-docs',
    stage: 'offer',
    titleZh: '领取录取通知书与JW202表',
    titleEn: 'Receive admission notice & JW202 form',
    offsetDays: -100,
    officialRequirement:
      'The admission notice and the JW202 (or JW201) visa application form are mailed to the address you gave in the application. Both originals are required for the student visa application.',
    officialSourceUrl: 'https://example.org/landed-placeholder/admission-documents',
    realWait: 'Courier takes 2–4 weeks; longer outside East Asia',
    costCNY: [0, 300],
    redFlags: [
      { level: 'high', zh: 'JW202 有错字，修改约需11天', en: 'Typos on JW202 took ~11 days to fix' },
      { level: 'med', zh: '快递费货到付款', en: 'Courier fee charged on delivery' },
      { level: 'med', zh: '折叠的 JW202 曾被拒收', en: 'A folded JW202 was rejected' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-05-28',
        text:
          'Courier fee was charged on delivery, not at sending. Have about CNY 250 equivalent ready in local currency on the day.',
        upvotes: 63,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-06-14',
        text:
          'My JW202 arrived with a typo in my passport number. Fixing it took 11 days, so check every field the hour it arrives.',
        upvotes: 88,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-07-02',
        text:
          'Do not laminate or fold the JW202. The visa centre rejected a folded one in my queue and the student had to request a reissue.',
        upvotes: 35,
      },
    ],
  },
  {
    id: 'dorm-application',
    stage: 'offer',
    titleZh: '申请校内宿舍',
    titleEn: 'Apply for an on-campus dorm',
    offsetDays: -95,
    appliesTo: { housing: ['dorm'] },
    officialRequirement:
      'On-campus accommodation is applied for separately from admission and is allocated while places remain. A deposit is payable at check-in.',
    officialSourceUrl: 'https://example.org/landed-placeholder/housing-application',
    realWait: 'Allocation result in 3–5 weeks',
    costCNY: [1200, 2600],
    redFlags: [
      { level: 'high', zh: '开放后约72小时内房源抢光', en: 'Rooms fill in the first ~72 hours' },
      { level: 'med', zh: '押金与首月房租分开支付', en: 'Deposit is a separate payment from first rent' },
    ],
    shortStayTip:
      'Short-stay rooms are a separate quota from full-degree rooms — say one semester on the form or you may be quoted a full-year rate.',
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-06-03',
        text:
          'Applied the day it opened and still got my third choice. Rooms fill in the first 72 hours, so set an alarm for the opening time in Beijing hours, not yours.',
        upvotes: 74,
      },
      {
        cohort: 'Spring 2026 · SIGS',
        date: '2026-01-27',
        text:
          'SIGS deposit was a separate payment from the first month of rent. Budget for both landing in the same week.',
        upvotes: 39,
      },
    ],
  },
  {
    id: 'offcampus-search',
    stage: 'offer',
    titleZh: '寻找校外住房',
    titleEn: 'Find off-campus housing',
    offsetDays: -90,
    appliesTo: { housing: ['offcampus'] },
    officialRequirement:
      'Students living off campus must have a tenancy contract and the landlord’s property ownership document, both of which are needed for accommodation registration after arrival.',
    officialSourceUrl: 'https://example.org/landed-placeholder/off-campus-housing',
    realWait: 'Viewing to signed contract: 1–3 weeks once you are in the city',
    costCNY: [6000, 14000],
    redFlags: [
      { level: 'high', zh: '预付三个月房租加一个月中介费', en: '3 months rent up front + 1 month agency fee' },
      { level: 'high', zh: '没有房产证无法办理住宿登记', en: 'No ownership certificate \u2192 registration refused' },
      { level: 'med', zh: '远程看好的房源可能并不存在', en: 'Remote listings may not exist' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-06-21',
        text:
          'Standard here was three months rent up front plus one month agency fee. That was the single biggest cash shock of my move.',
        upvotes: 112,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-08-09',
        text:
          'Ask for the landlord’s ownership certificate before signing. Without it the police station would not complete my accommodation registration.',
        upvotes: 96,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-07-30',
        text:
          'Booked a hostel for the first ten days rather than signing remotely. Two listings I had shortlisted did not exist when I went to view them.',
        upvotes: 58,
      },
    ],
  },

  // ----------------------------------------------------------------- 02 VISA
  {
    id: 'physical-exam',
    stage: 'visa',
    titleZh: '境外体格检查表',
    titleEn: 'Foreigner physical examination form',
    offsetDays: -75,
    officialRequirement:
      'Students staying longer than six months complete the Foreigner Physical Examination Form at an approved clinic, including blood tests, chest imaging and an ECG. Results are generally valid for six months.',
    officialSourceUrl: 'https://example.org/landed-placeholder/physical-examination',
    realWait: 'Appointment 1–2 weeks out; results 5–10 working days',
    costCNY: [700, 1900],
    redFlags: [
      { level: 'high', zh: '照片未盖章，表格被拒', en: 'Unstamped photo \u2192 form refused' },
      { level: 'med', zh: '抽血需空腹，否则要重约', en: 'Blood test needs fasting or you rebook' },
    ],
    shortStayTip:
      'A stay under six months often does not need the full form — confirm before paying for the whole panel.',
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-06-30',
        text:
          'Bring the official form with you to the clinic and make them stamp every page plus the photo. My first set came back without the photo stamp and was refused.',
        upvotes: 104,
      },
      {
        cohort: 'Spring 2026 · SIGS',
        date: '2026-02-08',
        text:
          'Fasting from midnight for the blood test — nobody told me and I had to rebook, which cost another nine days.',
        upvotes: 67,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-06-18',
        text:
          'Do this before the visa appointment, not after. The six-month validity clock is rarely the thing that bites you; the lab backlog is.',
        upvotes: 45,
      },
    ],
  },
  {
    id: 'visa-appointment',
    stage: 'visa',
    titleZh: '预约签证申请',
    titleEn: 'Book the visa appointment',
    offsetDays: -60,
    officialRequirement:
      'Applications are submitted in person at the Chinese visa application service centre covering your place of residence. Appointment slots are booked online in advance.',
    officialSourceUrl: 'https://example.org/landed-placeholder/visa-appointment',
    realWait: 'Nearest slot is typically 2–4 weeks out; longer in July and August',
    costCNY: [0, 0],
    redFlags: [
      { level: 'high', zh: '七月底最早预约约在26天后', en: 'Late-July slots were ~26 days out' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-07-06',
        text:
          'In late July the first free slot was 26 days away. Book the appointment the moment your JW202 arrives, even if the other papers are not ready yet.',
        upvotes: 131,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-07-21',
        text:
          'Cancellations appear early morning local time. I refreshed at 08:00 for three days and pulled my date forward by two weeks.',
        upvotes: 72,
      },
    ],
  },
  {
    id: 'visa-x1',
    stage: 'visa',
    titleZh: '申请X1学习签证',
    titleEn: 'Apply for the X1 student visa',
    offsetDays: -50,
    appliesTo: { degree: ['bachelor', 'master', 'phd'] },
    officialRequirement:
      'The X1 visa covers study of more than 180 days. Submit the visa form, passport, admission notice, JW202 and physical examination form. The X1 is an entry visa only — a residence permit must be applied for after arrival.',
    officialSourceUrl: 'https://example.org/landed-placeholder/x1-visa',
    realWait: 'Standard processing 4–7 working days after submission',
    costCNY: [400, 1100],
    hard: true,
    redFlags: [
      { level: 'high', zh: '护照拿回前别买不可退机票', en: 'No non-refundable flights before passport is back' },
      { level: 'med', zh: '签证中心可能不收银行卡', en: 'Card payment may not be accepted' },
      { level: 'low', zh: 'JW202 原件会被收走', en: 'Original JW202 is kept \u2014 scan it first' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-07-19',
        text:
          '"Four working days" meant nine calendar days in August because of the weekend and the backlog. Do not book a non-refundable flight until the passport is physically back.',
        upvotes: 148,
      },
      {
        cohort: 'Spring 2026 · SIGS',
        date: '2026-02-21',
        text:
          'The fee varied a lot by nationality at my centre and card payment was not accepted. I had to leave the queue to find an ATM.',
        upvotes: 83,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-08-01',
        text:
          'They kept my original JW202. Scan and photograph everything before you hand the folder over.',
        upvotes: 91,
      },
    ],
  },
  {
    id: 'visa-x2',
    stage: 'visa',
    titleZh: '申请X2短期学习签证',
    titleEn: 'Apply for the X2 short-stay study visa',
    offsetDays: -50,
    appliesTo: { degree: ['exchange'] },
    officialRequirement:
      'The X2 visa covers study of 180 days or less. It is normally issued as a single-entry visa with a fixed duration of stay and does not convert to a residence permit.',
    officialSourceUrl: 'https://example.org/landed-placeholder/x2-visa',
    realWait: 'Standard processing 4–7 working days after submission',
    costCNY: [350, 900],
    hard: true,
    redFlags: [
      { level: 'high', zh: '单次入境：出境即结束停留', en: 'Single entry \u2014 leaving ends your stay' },
      { level: 'med', zh: '停留期限需与项目结束日核对', en: 'Check stay duration against programme end' },
    ],
    shortStayTip:
      'Check the duration of stay printed on the visa against your programme end date the day you collect it — an X2 cannot simply be extended like a residence permit.',
    notes: [
      {
        cohort: 'Spring 2026 · Beijing',
        date: '2026-02-14',
        text:
          'My X2 was single entry. A weekend trip out of the country during the semester would have ended my stay — worth knowing before you book anything.',
        upvotes: 77,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-04',
        text:
          'Exchange students at my centre did not need the full physical examination form, only the basic health declaration. Ask before you pay for the full panel.',
        upvotes: 54,
      },
    ],
  },
  {
    id: 'dependent-visa',
    stage: 'visa',
    titleZh: '随行家属签证（S1/S2）',
    titleEn: 'Dependent visas (S1 / S2)',
    offsetDays: -45,
    appliesTo: { family: true },
    officialRequirement:
      'Family members accompanying a student apply for S1 (over 180 days) or S2 (180 days or less) visas. Each application needs proof of relationship — a marriage or birth certificate — usually notarised and translated.',
    officialSourceUrl: 'https://example.org/landed-placeholder/dependent-visa',
    realWait: 'Notarisation and translation 1–3 weeks, then visa processing on top',
    costCNY: [900, 3200],
    redFlags: [
      { level: 'high', zh: '公证翻译单独就花了16天', en: 'Notarised translation alone took 16 days' },
      { level: 'low', zh: '家属护照可能晚两天返还', en: 'Family passports may come back days later' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-06-25',
        text:
          'The relationship documents were the long pole, not the visa. Notarised translation of our marriage certificate took 16 days on its own — start it the week your JW202 lands.',
        upvotes: 118,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-07-12',
        text:
          'We applied on the same day at the same centre and my spouse’s visa came back two days after mine. Do not plan for both passports returning together.',
        upvotes: 64,
      },
    ],
  },

  // --------------------------------------------------------- 03 PRE-DEPARTURE
  {
    id: 'book-flight',
    stage: 'predeparture',
    titleZh: '预订机票',
    titleEn: 'Book your flight',
    offsetDays: -35,
    officialRequirement:
      'Arrive within the registration window printed on your admission notice. Arriving before the window opens may mean the dorm cannot check you in.',
    officialSourceUrl: 'https://example.org/landed-placeholder/arrival-window',
    realWait: 'Book once the passport is back — fares rise sharply in the last three weeks',
    costCNY: [3000, 12000],
    redFlags: [
      { level: 'med', zh: '深夜落地宿舍前台已关', en: 'Late-night landing: dorm reception closed' },
      { level: 'med', zh: '最后三周票价大涨', en: 'Fares rise sharply in the last three weeks' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-07-28',
        text:
          'Landing at 23:40 was a mistake. Dorm reception had closed, and one night in an airport hotel cost more than my first week of food.',
        upvotes: 126,
      },
      {
        cohort: 'Spring 2026 · SIGS',
        date: '2026-02-26',
        text:
          'For SIGS I flew into Shenzhen rather than connecting through Beijing. Saved a domestic leg and about six hours with heavy luggage.',
        upvotes: 58,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-08-12',
        text:
          'Arrive two or three days before registration opens, not on the day. Every queue that week is long and nothing can be fixed at the weekend.',
        upvotes: 97,
      },
    ],
  },
  {
    id: 'budget-plan',
    stage: 'predeparture',
    titleZh: '制定第一个月预算',
    titleEn: 'Plan your first-month budget',
    offsetDays: -30,
    officialRequirement:
      'Scholarship stipends are normally paid after registration and bank account setup are complete, so the first payment may not arrive in your first weeks.',
    officialSourceUrl: 'https://example.org/landed-placeholder/scholarship-stipend',
    realWait: 'First stipend commonly lands 3–6 weeks after arrival',
    costCNY: [0, 0],
    redFlags: [
      { level: 'high', zh: '首笔奖学金可能在落地后3–6周才到', en: 'First stipend may land 3\u20136 weeks after arrival' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-08-02',
        text:
          'My scholarship was real, but it paid out five weeks after I landed. Everything in weeks one and two came out of my own pocket.',
        upvotes: 156,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-08-30',
        text:
          'Bedding, a deposit, the health check and a SIM all hit within four days of arrival. That cluster is what catches people out, not the tuition.',
        upvotes: 109,
      },
    ],
  },
  {
    id: 'cash-access',
    stage: 'predeparture',
    titleZh: '准备现金与可用银行卡',
    titleEn: 'Arrange cash and card access',
    offsetDays: -21,
    appliesTo: { funding: ['self'] },
    officialRequirement:
      'There is no official minimum, but several arrival-week payments are made before a local bank account can be opened. Check your home bank’s daily withdrawal limit abroad.',
    officialSourceUrl: 'https://example.org/landed-placeholder/payments-on-arrival',
    realWait: 'A local bank card is typically usable 1–3 weeks after arrival',
    costCNY: [4000, 9000],
    redFlags: [
      { level: 'high', zh: '国内银行可能在境外冻结卡', en: 'Home bank may block your card abroad' },
      { level: 'med', zh: '入住当天押金只收现金', en: 'Dorm deposit was cash only on check-in' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-08-08',
        text:
          'Tell your home bank you are travelling. Mine blocked the card on my second ATM withdrawal and the fix needed a phone call I could not make without a working SIM.',
        upvotes: 142,
      },
      {
        cohort: 'Spring 2026 · SIGS',
        date: '2026-03-01',
        text:
          'The dorm deposit was cash only on my check-in day. Carrying roughly CNY 5,000 in cash for week one was what saved me.',
        upvotes: 121,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-09-01',
        text:
          'Bring two cards from different networks. One of mine simply did not work at any machine near campus.',
        upvotes: 88,
      },
    ],
  },
  {
    id: 'pack-essentials',
    stage: 'predeparture',
    titleZh: '收拾必备行李',
    titleEn: 'Pack the essentials',
    offsetDays: -10,
    officialRequirement:
      'Carry your passport, admission notice, JW202 and physical examination form in hand luggage. Originals are required at registration and at the exit-entry bureau.',
    officialSourceUrl: 'https://example.org/landed-placeholder/what-to-bring',
    realWait: 'Not applicable',
    costCNY: [300, 1500],
    redFlags: [
      { level: 'med', zh: '证件原件须随身携带', en: 'Originals must be in hand luggage' },
      { level: 'low', zh: '宿舍不含床品', en: 'Bedding is not included' },
    ],
    shortStayTip:
      'For one semester, buy bedding locally rather than paying to fly it in — you will not want to carry it home.',
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-08-15',
        text:
          'Bring 8–10 passport photos on white background. I needed them for the campus card, the bank and the exit-entry bureau, and the photo shop queue that week was 40 minutes.',
        upvotes: 167,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-08-24',
        text:
          'Dorm bedding was not included and the campus shop sold out by day three. A basic set ran about CNY 400.',
        upvotes: 94,
      },
      {
        cohort: 'Spring 2026 · Beijing',
        date: '2026-02-12',
        text:
          'Pack any prescription medicine with its original label and a copy of the prescription. Do not assume you can find the same brand here.',
        upvotes: 61,
      },
    ],
  },

  // --------------------------------------------------------- 04 ARRIVAL WEEK
  {
    id: 'campus-registration',
    stage: 'arrival',
    titleZh: '新生报到注册',
    titleEn: 'Campus registration',
    offsetDays: 1,
    officialRequirement:
      'Register in person during the published registration window with your passport, admission notice and JW202. Registration is the gate for almost every other service.',
    officialSourceUrl: 'https://example.org/landed-placeholder/registration',
    realWait: 'Half a day; the international student desk queues are worst on day one',
    costCNY: [0, 200],
    hard: true,
    redFlags: [
      { level: 'med', zh: '报到首日排队约三小时', en: 'Day-one queues ran ~3 hours' },
      { level: 'med', zh: '未报到则其他手续都无法办理', en: 'Nothing else unlocks until you register' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-02',
        text:
          'Go on the second morning, not the first. Friends who went on day one queued three hours; I was done in 40 minutes.',
        upvotes: 133,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-05',
        text:
          'At SIGS registration and dorm check-in are in different buildings a short shuttle apart. Do registration first — check-in asked for the stamped slip.',
        upvotes: 79,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-09-03',
        text:
          'Nothing else unlocks until this is stamped. Campus card, course registration and the residence permit letter all wanted proof of registration.',
        upvotes: 102,
      },
    ],
  },
  {
    id: 'police-registration',
    stage: 'arrival',
    titleZh: '住宿登记（入住24小时内）',
    titleEn: 'Accommodation registration at the local police station',
    offsetDays: 1,
    appliesTo: { housing: ['offcampus'] },
    officialRequirement:
      'Foreign nationals not staying in a hotel or campus dorm must register their address at the local police station within 24 hours of arrival. Bring your passport, tenancy contract and the landlord’s property ownership document. The landlord normally has to attend.',
    officialSourceUrl: 'https://example.org/landed-placeholder/accommodation-registration',
    realWait: 'About 30 minutes at the counter — the hard part is getting the landlord there',
    costCNY: [0, 0],
    hard: true,
    redFlags: [
      { level: 'high', zh: '入住24小时内，严格执行', en: '24 hours is taken literally' },
      { level: 'high', zh: '房东通常需要到场', en: 'Landlord usually has to attend' },
      { level: 'low', zh: '登记回执请妥善保管', en: 'Keep the registration slip' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-04',
        text:
          '24 hours is taken literally. Arrange the landlord meeting before you fly — mine was out of the city and I registered a day late.',
        upvotes: 154,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-08',
        text:
          'You get a registration slip. Guard it — the exit-entry bureau asked for it later and a reprint meant going back to the station.',
        upvotes: 97,
      },
      {
        cohort: 'Spring 2026 · Beijing',
        date: '2026-02-20',
        text:
          'If you stay in a hotel the first nights the hotel registers you, but you must re-register once you move into the flat. Two separate steps.',
        upvotes: 71,
      },
    ],
  },
  {
    id: 'dependent-registration',
    stage: 'arrival',
    titleZh: '家属住宿与信息登记',
    titleEn: 'Dependent accommodation registration',
    offsetDays: 2,
    appliesTo: { family: true },
    officialRequirement:
      'Each accompanying family member registers their accommodation in their own name within 24 hours of arrival, including children. Dependants on S1 visas also apply for their own residence permits.',
    officialSourceUrl: 'https://example.org/landed-placeholder/dependent-registration',
    realWait: 'Same visit as your own registration if everyone attends in person',
    costCNY: [0, 800],
    hard: true,
    redFlags: [
      { level: 'high', zh: '每位家属须本人到场', en: 'Every family member must attend in person' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-06',
        text:
          'Bring every family member in person, children included. They would not register my daughter on her passport copy alone.',
        upvotes: 86,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-11',
        text:
          'Campus dorms would not house my spouse, so the family room search had to be finished before registration. Plan the housing first.',
        upvotes: 73,
      },
    ],
  },
  {
    id: 'sim-card',
    stage: 'arrival',
    titleZh: '办理手机卡',
    titleEn: 'Get a local SIM card',
    offsetDays: 2,
    officialRequirement:
      'SIM cards are sold under real-name registration and require your passport in person. A local number is needed for mobile payment, campus systems and most deliveries.',
    officialSourceUrl: 'https://example.org/landed-placeholder/sim-registration',
    realWait: '30–60 minutes in store; campus pop-up stalls in registration week are fastest',
    costCNY: [100, 350],
    redFlags: [
      { level: 'med', zh: '开银行账户需要本地手机号', en: 'Bank needs a local number \u2014 SIM first' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-03',
        text:
          'Do this before the bank, not after. The account application needed a local mobile number and I had to give up my place in the queue.',
        upvotes: 171,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-09',
        text:
          'The registration-week campus stall took 20 minutes; the city store quoted two hours. Use the stall if it is still there.',
        upvotes: 84,
      },
      {
        cohort: 'Spring 2026 · Beijing',
        date: '2026-02-24',
        text:
          'Keep your home number alive for a few weeks. Bank verification codes for my card abroad still went to the old SIM.',
        upvotes: 66,
      },
    ],
  },
  {
    id: 'mobile-pay',
    deferrable: true,
    stage: 'arrival',
    titleZh: '开通支付宝/微信支付',
    titleEn: 'Set up Alipay / WeChat Pay',
    offsetDays: 3,
    officialRequirement:
      'Mobile payment platforms accept some foreign cards for verified international users, and accept a local bank card once you have one. Identity verification requires your passport.',
    officialSourceUrl: 'https://example.org/landed-placeholder/mobile-payment',
    realWait: 'Verification is usually same day; occasionally 2–3 days',
    costCNY: [0, 0],
    redFlags: [
      { level: 'med', zh: '姓名须与护照完全一致', en: 'Name must match passport exactly' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-05',
        text:
          'Linked a foreign card to Alipay on day two and it covered nearly everything. That bridged the three weeks before my local card worked.',
        upvotes: 188,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-12',
        text:
          'Name must match your passport exactly, including middle names. My verification failed twice over a missing middle name.',
        upvotes: 95,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-09-15',
        text:
          'Small vendors near the east gate were cash-free entirely. Without mobile pay set up I could not buy lunch on campus.',
        upvotes: 78,
      },
    ],
  },
  {
    id: 'campus-card',
    deferrable: true,
    stage: 'arrival',
    titleZh: '领取校园卡',
    titleEn: 'Collect your campus card',
    offsetDays: 4,
    officialRequirement:
      'The campus card is issued after registration and is used for dining halls, library access, buildings and some laundry facilities. A passport photo may be required.',
    officialSourceUrl: 'https://example.org/landed-placeholder/campus-card',
    realWait: 'Same day if you have registered; 2–3 days in peak week',
    costCNY: [20, 150],
    redFlags: [
      { level: 'low', zh: '补办约50元并需等两天', en: 'Replacement ~CNY 50 and a two-day wait' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-07',
        text:
          'Top it up through the campus app rather than the machine — the machine queue in week one was longer than the issuing queue.',
        upvotes: 69,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-14',
        text:
          'Lost mine in week three and the replacement cost about CNY 50 plus a two-day wait without dining hall access.',
        upvotes: 52,
      },
    ],
  },
  {
    id: 'health-check-verification',
    stage: 'arrival',
    titleZh: '体检确认与补检',
    titleEn: 'Health check verification',
    offsetDays: 6,
    appliesTo: { degree: ['bachelor', 'master', 'phd'] },
    officialRequirement:
      'The overseas physical examination is verified after arrival at a designated health centre. If any test is missing or unrecognised it must be repeated locally, and the verification certificate is required for the residence permit.',
    officialSourceUrl: 'https://example.org/landed-placeholder/health-verification',
    realWait: 'Certificate issued in 3–7 working days; a re-test adds a week',
    costCNY: [400, 1300],
    hard: true,
    redFlags: [
      { level: 'high', zh: '关系到30天内的居留许可', en: 'Gates the 30-day residence permit' },
      { level: 'med', zh: '境外胸片可能不被认可', en: 'Home X-ray may be rejected \u2014 budget a re-test' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-10',
        text:
          'My home chest X-ray was not accepted and I repeated it here for about CNY 450. Budget for a re-test even if you did everything right.',
        upvotes: 124,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-18',
        text:
          'This gates the residence permit, and the permit has a 30-day clock. Book the verification in your first week, not your third.',
        upvotes: 111,
      },
    ],
  },

  // ---------------------------------------------------------- 05 FIRST MONTH
  {
    id: 'course-registration',
    deferrable: true,
    stage: 'firstmonth',
    titleZh: '选课与课程注册',
    titleEn: 'Course registration',
    offsetDays: 8,
    officialRequirement:
      'Course selection opens in a published window in the online system. Some courses require departmental approval and add/drop closes within the first weeks of term.',
    officialSourceUrl: 'https://example.org/landed-placeholder/course-registration',
    realWait: 'Selection window is short — often a single week',
    costCNY: [0, 400],
    hard: true,
    redFlags: [
      { level: 'med', zh: '热门课程第一小时就满', en: 'Popular courses fill in the first hour' },
    ],
    shortStayTip:
      'Exchange students often need a signature from both the host department and the home university — start that email before you fly.',
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-12',
        text:
          'Popular courses filled in the first hour of the window. Have a ranked backup list ready before it opens.',
        upvotes: 98,
      },
      {
        cohort: 'Spring 2026 · SIGS',
        date: '2026-03-04',
        text:
          'My advisor had to approve two selections manually and was away for a week. Email them before the window opens, not during.',
        upvotes: 64,
      },
    ],
  },
  {
    id: 'bank-account',
    deferrable: true,
    stage: 'firstmonth',
    titleZh: '开立银行账户',
    titleEn: 'Open a bank account',
    offsetDays: 12,
    appliesTo: { degree: ['bachelor', 'master', 'phd'] },
    officialRequirement:
      'Opening an account requires your passport with a valid visa or residence permit, a local mobile number and usually a student certificate or proof of address. Requirements differ between banks and branches.',
    officialSourceUrl: 'https://example.org/landed-placeholder/bank-account',
    realWait: '1–2 hours at the branch; card sometimes issued same day, sometimes 3–7 days',
    costCNY: [0, 100],
    redFlags: [
      { level: 'med', zh: '有的网点会拒绝，可换网点', en: 'One branch may refuse \u2014 try another' },
      { level: 'low', zh: '网银需单独开通', en: 'Online banking is a separate activation' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-16',
        text:
          'Turned away at one branch for not having my residence permit yet, accepted at another two streets away with just the X1 and a student letter. If you are refused, try a different branch.',
        upvotes: 163,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-09-24',
        text:
          'Online banking and the mobile app were a separate activation from the card. Without it I could not receive my stipend transfer.',
        upvotes: 87,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-10-02',
        text:
          'Go mid-morning on a weekday. Lunchtime and the last hour before closing were both full of students from my cohort.',
        upvotes: 59,
      },
    ],
  },
  {
    id: 'residence-permit',
    stage: 'firstmonth',
    titleZh: '办理居留许可（入境30天内）',
    titleEn: 'Residence permit (within 30 days of entry)',
    offsetDays: 16,
    appliesTo: { degree: ['bachelor', 'master', 'phd'] },
    officialRequirement:
      'Holders of an X1 visa must apply for a residence permit at the exit-entry administration within 30 days of entry. The application needs the health verification certificate, accommodation registration, a university letter and photos. Overstaying carries a fine.',
    officialSourceUrl: 'https://example.org/landed-placeholder/residence-permit',
    realWait: 'Passport held 7–15 working days after submission',
    costCNY: [400, 1000],
    hard: true,
    redFlags: [
      { level: 'high', zh: '30天从入境日算起', en: '30 days counts from entry, not registration' },
      { level: 'high', zh: '逾期会被罚款', en: 'Overstaying carries a fine' },
      { level: 'med', zh: '办理期间护照被收走7–15个工作日', en: 'Passport held 7\u201315 working days' },
    ],
    notes: [
      {
        cohort: 'Fall 2026 · Beijing',
        date: '2026-09-20',
        text:
          'They keep your passport for the whole processing period. No domestic flights, no hotel check-in, no bank appointment in that window — plan around it.',
        upvotes: 192,
      },
      {
        cohort: 'Fall 2025 · SIGS',
        date: '2025-10-06',
        text:
          'The 30 days counts from entry, not from registration. I started on day 21 and the health certificate was not ready, which was uncomfortably close.',
        upvotes: 145,
      },
      {
        cohort: 'Fall 2025 · Beijing',
        date: '2025-10-11',
        text:
          'The international student office submitted ours as a batch and it was far smoother than going alone. Ask whether your office does this before booking your own slot.',
        upvotes: 108,
      },
    ],
  },
]

export default STEPS
