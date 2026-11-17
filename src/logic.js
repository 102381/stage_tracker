// Plain JavaScript, no Vue in here: dates, cleaning saved data and the hour calculations.

export const LIMITS = {
  hoursPerDay: 24, totalHours: 5000, entries: 1000, offRanges: 100, returnDays: 100,
  rangeDays: 366, noteLength: 200, labelLength: 60, lookaheadDays: 900, lockAfterDays: 14
}

export const STORAGE_KEYS = { state: 'stage-state', lang: 'stage-lang', theme: 'stage-theme', period: 'stage-period' }

// Set by the school. Not editable in the app, change them here if the planning changes.
// 'opens' is the day the period can be picked, null means always.
export const PERIODS = {
  1: { hours: 620, first: '2026-09-02', last: '2027-02-05', opens: null },
  2: { hours: 424, first: '2027-02-08', last: '2027-06-04', opens: '2027-02-01' }
}

export const MS_PER_DAY = 864e5

// A day is a whole number counted from 1970-01-01, which keeps the date maths simple.
export function dayNumber(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return Math.round(Date.UTC(year, month - 1, day) / MS_PER_DAY)
}
export function dayString(day) {
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10)
}
export function weekdayOf(day) {
  return new Date(day * MS_PER_DAY).getUTCDay()   // 0 = Sunday
}
export function todayNumber() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  return dayNumber(`${now.getFullYear()}-${month}-${date}`)
}
// True only for a real calendar date written as YYYY-MM-DD (so 2026-02-31 is rejected).
export function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const year = Number(value.slice(0, 4))
  return year >= 2000 && year <= 2100 && dayString(dayNumber(value)) === value
}

export function isUnlocked(id, today) {
  const opens = PERIODS[id].opens
  return opens === null || today >= dayNumber(opens)
}

// Everything that comes from storage, a backup file or an input field goes through these functions first.

export function toHours(value, max) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(max, Math.max(0, number))
}
function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.slice(0, maxLength) : ''
}
function dateOr(value, fallback) {
  return isDate(value) ? value : fallback
}

function defaultConfig() {
  return {
    week: [0, 8, 8, 8, 8, 8, 0],            // Sunday first, like Date.getDay()
    open: { approved: 0, pending: 0, asOf: dayString(todayNumber() - 1) },
    off: [],
    ret: []
  }
}

function cleanWeek(raw) {
  if (!Array.isArray(raw) || raw.length !== 7) return defaultConfig().week
  return raw.map(hours => toHours(hours, LIMITS.hoursPerDay))
}
function cleanOpening(raw) {
  const defaults = defaultConfig().open
  const open = raw && typeof raw === 'object' ? raw : {}
  const hoursOr = (value, fallback) => value === undefined ? fallback : toHours(value, LIMITS.totalHours)
  return {
    approved: hoursOr(open.approved, defaults.approved),
    pending: hoursOr(open.pending, defaults.pending),
    asOf: dateOr(open.asOf, defaults.asOf)
  }
}
function cleanDaysOff(raw) {
  if (!Array.isArray(raw)) return []
  const ranges = []
  for (const item of raw.slice(0, LIMITS.offRanges)) {
    if (!item || !isDate(item.from)) continue
    const to = isDate(item.to) && item.to >= item.from ? item.to : item.from
    if (dayNumber(to) - dayNumber(item.from) > LIMITS.rangeDays) continue
    ranges.push({ from: item.from, to, label: cleanText(item.label, LIMITS.labelLength) })
  }
  return ranges
}
function cleanReturnDays(raw) {
  if (!Array.isArray(raw)) return []
  return [...new Set(raw.filter(isDate))].slice(0, LIMITS.returnDays)
}
function cleanConfig(raw, id) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const official = PERIODS[id]
  // Only the first day can differ per person (late starters), never the last day or the hours.
  let start = dateOr(source.start, official.first)
  if (start < official.first || start > official.last) start = official.first
  return {
    start,
    end: official.last,
    min: official.hours,
    week: cleanWeek(source.week),
    open: cleanOpening(source.open),
    off: cleanDaysOff(source.off),
    ret: cleanReturnDays(source.ret)
  }
}
function cleanLogs(raw) {
  const logs = {}
  if (!raw || typeof raw !== 'object') return logs
  const days = Object.keys(raw).filter(isDate).sort().slice(-LIMITS.entries)
  for (const day of days) {
    const entry = raw[day]
    if (!entry || typeof entry !== 'object') continue
    logs[day] = {
      h: toHours(entry.h, LIMITS.hoursPerDay),
      note: cleanText(entry.note, LIMITS.noteLength),
      ok: entry.ok === true
    }
  }
  return logs
}

// The saved data of one internship period: { cfg, logs, ready }.
export function cleanState(raw, id) {
  const source = raw && typeof raw === 'object' ? raw : {}
  return { cfg: cleanConfig(source.cfg, id), logs: cleanLogs(source.logs), ready: source.ready === true }
}

// Reads saved data for both periods. The first version saved one period as { cfg, logs }, that is period 1.
export function loadPeriods(raw) {
  const loaded = {}
  if (raw && typeof raw === 'object' && raw.periods && typeof raw.periods === 'object') {
    for (const id of [1, 2]) if (raw.periods[id]) loaded[id] = cleanState(raw.periods[id], id)
  } else if (raw && typeof raw === 'object' && raw.cfg) {
    loaded[1] = { ...cleanState(raw, 1), ready: true }
  }
  for (const id of [1, 2]) if (!loaded[id]) loaded[id] = cleanState({}, id)
  return loaded
}


// Calculations

function buildRules(config) {
  const daysOff = new Set()
  for (const range of config.off) {
    for (let day = dayNumber(range.from); day <= dayNumber(range.to); day++) daysOff.add(day)
  }
  const returnDays = new Set(config.ret.map(dayNumber))
  const hoursOn = day => (daysOff.has(day) || returnDays.has(day)) ? 0 : config.week[weekdayOf(day)]
  return { daysOff, returnDays, hoursOn }
}

// Logs on or before the 'asOf' day are already inside the opening hours, so they are not added twice.
function totalHours(config, logs) {
  const openUntil = dayNumber(config.open.asOf)
  let approved = config.open.approved
  let pending = config.open.pending
  for (const [date, entry] of Object.entries(logs)) {
    if (dayNumber(date) <= openUntil) continue
    if (entry.ok) approved += entry.h
    else pending += entry.h
  }
  return { approved, pending }
}

function plannedHours(rules, fromDay, toDay) {
  let total = 0
  for (let day = fromDay; day <= toDay; day++) total += rules.hoursOn(day)
  return total
}
function countWorkdays(rules, fromDay, toDay) {
  let count = 0
  for (let day = fromDay; day <= toDay; day++) if (rules.hoursOn(day) > 0) count++
  return count
}
function findFinishDay(rules, fromDay, hoursLeft) {
  for (let day = fromDay; day < fromDay + LIMITS.lookaheadDays; day++) {
    hoursLeft -= rules.hoursOn(day)
    if (hoursLeft <= 0) return day
  }
  return null
}

// All the numbers the screens show, for one period and one "today".
export function getModel(state, today) {
  const config = state.cfg
  const rules = buildRules(config)
  const startDay = dayNumber(config.start)
  const endDay = dayNumber(config.end)

  const { approved, pending } = totalHours(config, state.logs)
  const done = approved + pending
  const left = Math.max(0, config.min - done)

  const lastCountedDay = state.logs[dayString(today)] ? today : today - 1
  const nextDay = Math.max(lastCountedDay + 1, startDay)
  const shouldHave = plannedHours(rules, startDay, Math.min(lastCountedDay, endDay))
  const finishDay = left > 0 ? findFinishDay(rules, nextDay, left) : null
  const workdaysLeft = countWorkdays(rules, nextDay, endDay)

  return {
    config, rules, endDay, approved, pending, done, left, shouldHave, finishDay,
    openUntil: dayNumber(config.open.asOf),
    neededPerDay: workdaysLeft > 0 ? left / workdaysLeft : null
  }
}
