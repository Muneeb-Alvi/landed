// localStorage wrappers. Everything degrades to in-memory defaults if storage
// is unavailable (private browsing, blocked cookies) rather than throwing.
//
// Each key carries its shape version. Adding a new key is not a shape change;
// changing what an existing key holds means bumping its version and adding a
// migration to MIGRATIONS below so saved data from older builds still loads.

import { useEffect, useState } from 'react'

export const KEYS = {
  answers: 'landed.answers.v1', // { region, degree, campus, arrivalDate, funding, housing, family }
  checked: 'landed.checked.v1', // { [stepId]: true }
  upvotes: 'landed.upvotes.v1', // { [noteKey]: true }
  flags: 'landed.flags.v1', // { [noteKey]: true }
  hidden: 'landed.hidden.v1', // { [stepId]: true }
  due: 'landed.due.v1', // { [stepId]: 'YYYY-MM-DD' }
  custom: 'landed.custom.v1', // [{ id, title, date, stage, cost }]
  myNotes: 'landed.mynotes.v1', // { [stepId]: string }
  followUps: 'landed.followups.v1', // { [questionKey]: boolean }
  tips: 'landed.tips.v1', // { [stepId]: [{ id, cohort, campus, wait, cost, text, date }] }
  docs: 'landed.docs.v1', // { [docId]: true }
  lang: 'landed.lang.v1', // 'both' | 'zh' | 'en'
}

const DEFAULTS = {
  answers: null,
  checked: {},
  upvotes: {},
  flags: {},
  hidden: {},
  due: {},
  custom: [],
  myNotes: {},
  followUps: {},
  tips: {},
  docs: {},
  lang: 'both',
}

// { [newKey]: { from: oldKey, migrate: (oldValue) => newValue } }
// Empty for now: every key is still on its first shape.
const MIGRATIONS = {}

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

function remove(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export function load(name) {
  const key = KEYS[name]
  const fallback = DEFAULTS[name]
  const m = MIGRATIONS[key]
  if (m) {
    const old = read(m.from, undefined)
    if (old !== undefined && read(key, undefined) === undefined) {
      write(key, m.migrate(old))
      remove(m.from)
    }
  }
  const value = read(key, fallback)
  // A value of the wrong type (hand-edited, or from a broken build) is ignored.
  if (fallback !== null && typeof value !== typeof fallback) return fallback
  if (Array.isArray(fallback) !== Array.isArray(value)) return fallback
  return value
}

export const save = (name, value) => write(KEYS[name], value)

/** useState that persists to one of the KEYS above. */
export function useStored(name) {
  const [value, setValue] = useState(() => load(name))
  useEffect(() => {
    if (value === null) remove(KEYS[name])
    else save(name, value)
  }, [name, value])
  return [value, setValue]
}

// Kept for existing callers.
export const loadAnswers = () => load('answers')
export const saveAnswers = (a) => save('answers', a)

/** "Start over": wipes everything except the language preference. */
export function clearAll() {
  Object.entries(KEYS).forEach(([name, key]) => {
    if (name !== 'lang') remove(key)
  })
}
