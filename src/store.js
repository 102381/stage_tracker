// The shared state of the app. Every component imports what it needs from here.
import { reactive, computed, watch } from 'vue'
import { TEXTS } from './texts.js'
import {
  LIMITS, STORAGE_KEYS, PERIODS, MS_PER_DAY,
  dayNumber, dayString, todayNumber, isDate, isUnlocked,
  cleanState, loadPeriods, getModel
} from './logic.js'

export const app = reactive({
  lang: 'en',
  theme: 'light',
  view: 'home',          // home, log, entries, calendar, settings, setup or period
  period: 1,             // which internship is open
  periodData: {},        // saved data of both periods
  today: todayNumber(),
  logDate: '',           // the add hours screen
  logNote: '',
  hoursToLog: 8,
  shownMonth: null       // months since year 0, set when the calendar opens
})

export const t = computed(() => TEXTS[app.lang])
export const state = computed(() => app.periodData[app.period])
export const model = computed(() => getModel(state.value, app.today))

export const showNumber = value => String(Math.round(value * 100) / 100)

export function shortDate(day) {
  const [, month, date] = dayString(day).split('-').map(Number)
  return `${date} ${t.value.months[month - 1].slice(0, 3)}`
}
export function fullDate(dateString) {
  const [year, month, date] = dateString.split('-').map(Number)
  return `${date} ${t.value.months[month - 1].slice(0, 3)} ${year}`
}

export function isUnlockedNow(id) {
  return isUnlocked(id, app.today)
}


// Saving. Browsers can block storage, so every call is wrapped.

function readSetting(key) {
  try { return localStorage.getItem(key) } catch (e) { return null }
}
function writeSetting(key, value) {
  try { localStorage.setItem(key, value) } catch (e) { /* ignore */ }
}

function saveAll() {
  writeSetting(STORAGE_KEYS.state, JSON.stringify({ v: 2, periods: app.periodData }))
}

// Called after every change: clean the data of the open period, then save.
export function commit() {
  app.periodData[app.period] = cleanState(app.periodData[app.period], app.period)
  saveAll()
}


// Moving around

export function goTo(view) {
  app.view = view
  window.scrollTo(0, 0)
}

export function openLog(date) {
  const day = isDate(date) ? date : dayString(app.today)
  const entry = state.value.logs[day]
  app.logDate = day
  app.logNote = entry ? entry.note : ''
  app.hoursToLog = entry ? entry.h : model.value.rules.hoursOn(dayNumber(day))
  goTo('log')
}

export function saveLog() {
  const date = app.logDate
  if (!isDate(date)) return
  const logs = state.value.logs
  const previous = logs[date]
  logs[date] = { h: app.hoursToLog, note: app.logNote, ok: previous ? previous.ok : false }
  commit()
  goTo('home')
}

export function switchPeriod(id) {
  if (!PERIODS[id] || !isUnlockedNow(id)) return
  app.period = id
  app.shownMonth = null
  writeSetting(STORAGE_KEYS.period, String(id))
  goTo(state.value.ready ? 'home' : 'setup')
}

export function setLang(lang) {
  app.lang = lang === 'nl' ? 'nl' : 'en'
  writeSetting(STORAGE_KEYS.lang, app.lang)
}

export function toggleTheme() {
  app.theme = app.theme === 'dark' ? 'light' : 'dark'
  writeSetting(STORAGE_KEYS.theme, app.theme)
}


// Backup file and reset

export function exportBackup() {
  const file = new Blob([JSON.stringify({ v: 2, periods: app.periodData }, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(file)
  link.download = `stage-hours-${dayString(app.today)}.json`
  link.click()
  URL.revokeObjectURL(link.href)
}

export function importBackup(file) {
  if (!file || file.size > 1000000) { alert(t.value.importFailed); return }
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const imported = loadPeriods(JSON.parse(reader.result))       // checked like any other input
      const usable = [1, 2].filter(id => imported[id].ready && isUnlockedNow(id))
      if (usable.length === 0) { alert(t.value.importFailed); return }
      if (usable.some(id => app.periodData[id].ready) && !window.confirm(t.value.importConfirm)) return
      for (const id of usable) app.periodData[id] = imported[id]
      if (!usable.includes(app.period)) app.period = usable[0]
      writeSetting(STORAGE_KEYS.period, String(app.period))
      commit()
      goTo('home')
      alert(t.value.importDone)
    } catch (e) {
      alert(t.value.importFailed)
    }
  }
  reader.readAsText(file)
}

export function resetPeriod() {
  if (!window.confirm(t.value.resetConfirm)) return
  app.periodData[app.period] = cleanState({}, app.period)
  saveAll()
  goTo('setup')
}


// Start

export function startStore() {
  app.lang = readSetting(STORAGE_KEYS.lang) === 'nl' ? 'nl' : 'en'
  app.theme = readSetting(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light'

  let saved = null
  try { saved = JSON.parse(readSetting(STORAGE_KEYS.state)) } catch (e) { saved = null }
  const firstVisit = readSetting(STORAGE_KEYS.state) === null && readSetting(STORAGE_KEYS.period) === null
  app.periodData = loadPeriods(saved)

  const savedPeriod = Number(readSetting(STORAGE_KEYS.period))
  app.period = PERIODS[savedPeriod] && isUnlockedNow(savedPeriod) ? savedPeriod : 1
  app.view = firstVisit ? 'period' : state.value.ready ? 'home' : 'setup'

  watch(() => app.theme, value => document.documentElement.setAttribute('data-theme', value), { immediate: true })
  watch(() => app.lang, value => { document.documentElement.lang = value }, { immediate: true })
}
