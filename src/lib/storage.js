// localStorage wrappers. Everything degrades to in-memory defaults if storage
// is unavailable (private browsing, blocked cookies) rather than throwing.

const KEYS = {
  answers: 'landed.answers.v1',
  checked: 'landed.checked.v1',
  upvotes: 'landed.upvotes.v1',
  flags: 'landed.flags.v1',
}

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — state stays in memory for this session */
  }
}

export const loadAnswers = () => read(KEYS.answers, null)
export const saveAnswers = (a) => write(KEYS.answers, a)
export const loadChecked = () => read(KEYS.checked, {})
export const saveChecked = (c) => write(KEYS.checked, c)
export const loadUpvotes = () => read(KEYS.upvotes, {})
export const saveUpvotes = (u) => write(KEYS.upvotes, u)
export const loadFlags = () => read(KEYS.flags, {})
export const saveFlags = (f) => write(KEYS.flags, f)

export function clearAll() {
  Object.values(KEYS).forEach((k) => {
    try {
      window.localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  })
}
