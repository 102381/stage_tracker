'use strict';

const TEXTS = {
  en: {
    done: 'Done', toWord: 'to', change: 'change',
    pickTitle: 'Which internship are you in?',
    periodName: n => n === 1 ? '1st internship' : '2nd internship', opensOn: d => `Opens on ${d}`, title: 'Stage hours', addToday: "Add today's hours",
    entries: 'Entries', calendar: 'Calendar', settings: 'Settings',
    addTitle: 'Add hours', date: 'Date', hoursWord: 'hours', noteOpt: 'Note (optional)', notePh: 'What did you work on?', latest: 'Latest',
    save: h => `Save ${h} hours`, update: h => `Update to ${h} hours`,
    finishOn: 'You finish on',
    early: n => n === 1 ? '1 day early' : `${n} days early`,
    late: n => n === 1 ? '1 day late' : `${n} days late`,
    onLastDay: 'On the last day', complete: 'Minimum reached',
    needPerDay: h => `Needs ${h} h a day.`,
    ofMin: m => `of ${m} h`, plan: h => `Plan: ${h} h`,
    left: 'Left to do', waiting: 'Waiting for approval',
    approveAll: 'Approve all', pendingNote: h => h ? `${h} h waiting for approval` : 'Everything approved', noEntries: 'No entries yet.',
    locked: 'Over 14 days old: B3net no longer lets you fill this in.', lockedTag: 'locked', inOpening: 'before you started here',
    start: 'My first day', weekHint: 'Hours per weekday',
    openTitle: 'Hours I already have',
    approved: 'Approved', pending: 'Not approved yet',
    daysOff: 'Days off', from: 'From', to: 'Until (optional)', label: 'Reason', add: 'Add', returnDays: 'School return days',
    nothingAdded: 'Nothing added.', remove: 'Delete', darkMode: 'Dark mode', lightMode: 'Light mode',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    legend: { logged: 'Logged', short: 'Below plan', returnDay: 'Return day', dayOff: 'Day off', noWork: 'No work', lastDay: 'Last day' },
    storedHere: 'Saved on this device only',
    setupTitle: 'Set up your internship',
    startBtn: 'Start tracking', haveBackup: 'I have a backup file', setupError: (a, b) => `Your first day must be between ${a} and ${b}.`,
    resetBtn: 'Erase my data and start over', resetConfirm: 'Erase the hours and settings of this internship on this device?',
    backup: 'Backup', exportBtn: 'Download backup', importBtn: 'Load backup',
    importDone: 'Backup loaded.', importFailed: 'That file could not be read.',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  },
  nl: {
    done: 'Klaar', toWord: 'tot', change: 'wijzig',
    pickTitle: 'In welke stage zit je?',
    periodName: n => `${n}e stage`, opensOn: d => `Opent op ${d}`, title: 'Stage-uren', addToday: 'Uren van vandaag invullen',
    entries: 'Invoer', calendar: 'Kalender', settings: 'Instellingen',
    addTitle: 'Uren invullen', date: 'Datum', hoursWord: 'uur', noteOpt: 'Notitie (optioneel)', notePh: 'Waar werkte je aan?', latest: 'Laatste',
    save: h => `${h} uur opslaan`, update: h => `Wijzigen naar ${h} uur`,
    finishOn: 'Je bent klaar op',
    early: n => n === 1 ? '1 dag eerder' : `${n} dagen eerder`,
    late: n => n === 1 ? '1 dag later' : `${n} dagen later`,
    onLastDay: 'Op de laatste dag', complete: 'Minimum bereikt',
    needPerDay: h => `Heb ${h} uur per dag nodig.`,
    ofMin: m => `van ${m} uur`, plan: h => `Plan: ${h} uur`,
    left: 'Nog te doen', waiting: 'Wacht op goedkeuring',
    approveAll: 'Alles goedkeuren', pendingNote: h => h ? `${h} uur wacht op goedkeuring` : 'Alles goedgekeurd', noEntries: 'Nog geen invoer.',
    locked: 'Ouder dan 14 dagen: in B3net kun je dit niet meer invullen.', lockedTag: 'vergrendeld', inOpening: 'van voor je begon',
    start: 'Mijn eerste dag', weekHint: 'Uren per weekdag',
    openTitle: 'Uren die ik al heb',
    approved: 'Goedgekeurd', pending: 'Nog niet goedgekeurd',
    daysOff: 'Vrije dagen', from: 'Van', to: 'Tot (optioneel)', label: 'Reden', add: 'Toevoegen', returnDays: 'Terugkomdagen',
    nothingAdded: 'Niets toegevoegd.', remove: 'Verwijderen', darkMode: 'Donkere modus', lightMode: 'Lichte modus',
    weekdays: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'],
    legend: { logged: 'Ingevuld', short: 'Onder plan', returnDay: 'Terugkomdag', dayOff: 'Vrije dag', noWork: 'Geen werk', lastDay: 'Laatste dag' },
    storedHere: 'Alleen op dit apparaat opgeslagen',
    setupTitle: 'Stel je stage in',
    startBtn: 'Beginnen', haveBackup: 'Ik heb een back-upbestand', setupError: (a, b) => `Je eerste dag moet tussen ${a} en ${b} liggen.`,
    resetBtn: 'Mijn gegevens wissen en opnieuw beginnen', resetConfirm: 'De uren en instellingen van deze stage op dit apparaat wissen?',
    backup: 'Back-up', exportBtn: 'Back-up downloaden', importBtn: 'Back-up laden',
    importDone: 'Back-up geladen.', importFailed: 'Dat bestand kan niet worden gelezen.',
    months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']
  }
};

const ICONS = {
  back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  plus: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  next: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  moon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  sun: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
};

const LIMITS = {
  hoursPerDay: 24, totalHours: 5000, entries: 1000, offRanges: 100, returnDays: 100,
  rangeDays: 366, noteLength: 200, labelLength: 60, lookaheadDays: 900, lockAfterDays: 14
};

const STORAGE_KEYS = { state: 'stage-state', lang: 'stage-lang', theme: 'stage-theme', period: 'stage-period' };

const MS_PER_DAY = 864e5;

function dayNumber(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return Math.round(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}
function dayString(day) {
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}
function weekdayOf(day) {
  return new Date(day * MS_PER_DAY).getUTCDay();   // 0 = Sunday
}
function todayNumber() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return dayNumber(`${now.getFullYear()}-${month}-${date}`);
}
// True only for a real calendar date written as YYYY-MM-DD (so 2026-02-31 is rejected).
function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  return year >= 2000 && year <= 2100 && dayString(dayNumber(value)) === value;
}

// Set by the school. Not editable in the app, change them here if the planning changes.
// 'opens' is the day the period can be picked, null means always.
const PERIODS = {
  1: { hours: 620, first: '2026-09-02', last: '2027-02-05', opens: null },
  2: { hours: 424, first: '2027-02-08', last: '2027-06-04', opens: '2027-02-01' }
};

function buildDefaultConfig() {
  const first = todayNumber();
  return {
    week: [0, 8, 8, 8, 8, 8, 0],            // Sunday first, like Date.getDay()
    open: { approved: 0, pending: 0, asOf: dayString(first - 1) },
    off: [],
    ret: []
  };
}
const DEFAULT_CONFIG = buildDefaultConfig();

function toHours(value, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(max, Math.max(0, number));
}
function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}
function dateOr(value, fallback) {
  return isDate(value) ? value : fallback;
}

function cleanWeek(raw) {
  if (!Array.isArray(raw) || raw.length !== 7) return [...DEFAULT_CONFIG.week];
  return raw.map(hours => toHours(hours, LIMITS.hoursPerDay));
}
function cleanOpening(raw) {
  const open = raw && typeof raw === 'object' ? raw : {};
  const hoursOr = (value, fallback) => value === undefined ? fallback : toHours(value, LIMITS.totalHours);
  return {
    approved: hoursOr(open.approved, DEFAULT_CONFIG.open.approved),
    pending: hoursOr(open.pending, DEFAULT_CONFIG.open.pending),
    asOf: dateOr(open.asOf, DEFAULT_CONFIG.open.asOf)
  };
}
function cleanDaysOff(raw) {
  if (!Array.isArray(raw)) return [];
  const ranges = [];
  for (const item of raw.slice(0, LIMITS.offRanges)) {
    if (!item || !isDate(item.from)) continue;
    const to = isDate(item.to) && item.to >= item.from ? item.to : item.from;
    if (dayNumber(to) - dayNumber(item.from) > LIMITS.rangeDays) continue;
    ranges.push({ from: item.from, to, label: cleanText(item.label, LIMITS.labelLength) });
  }
  return ranges;
}
function cleanReturnDays(raw) {
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter(isDate))].slice(0, LIMITS.returnDays);
}
function cleanConfig(raw, id) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const official = PERIODS[id];
  // Only the first day can differ per person (late starters), never the last day or the hours.
  let start = dateOr(source.start, official.first);
  if (start < official.first || start > official.last) start = official.first;
  return {
    start,
    end: official.last,
    min: official.hours,
    week: cleanWeek(source.week),
    open: cleanOpening(source.open),
    off: source.off === undefined ? structuredClone(DEFAULT_CONFIG.off) : cleanDaysOff(source.off),
    ret: source.ret === undefined ? [...DEFAULT_CONFIG.ret] : cleanReturnDays(source.ret)
  };
}
function cleanLogs(raw) {
  const logs = {};
  if (!raw || typeof raw !== 'object') return logs;
  const days = Object.keys(raw).filter(isDate).sort().slice(-LIMITS.entries);
  for (const day of days) {
    const entry = raw[day];
    if (!entry || typeof entry !== 'object') continue;
    logs[day] = {
      h: toHours(entry.h, LIMITS.hoursPerDay),
      note: cleanText(entry.note, LIMITS.noteLength),
      ok: entry.ok === true
    };
  }
  return logs;
}
function cleanState(raw, id = period) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return { cfg: cleanConfig(source.cfg, id), logs: cleanLogs(source.logs), ready: source.ready === true };
}

function esc(value) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, ch => map[ch]);
}

let period = 1;                  // which internship is open
let periodData = {};             // saved state of both periods, state below is the open one
let state = cleanState({});
let lang = 'en';
let theme = 'light';
let currentView = 'home';
let shownMonth = null;           // months since year 0, set when the calendar opens
let today = todayNumber();
let hoursToLog = 8;

const $ = selector => document.querySelector(selector);
const text = () => TEXTS[lang];
const showNumber = value => String(Math.round(value * 100) / 100);

function shortDate(day) {
  const [, month, date] = dayString(day).split('-').map(Number);
  return `${date} ${text().months[month - 1].slice(0, 3)}`;
}
function fullDate(dateString) {
  const [year, month, date] = dateString.split('-').map(Number);
  return `${date} ${text().months[month - 1].slice(0, 3)} ${year}`;
}

function buildRules(config) {
  const daysOff = new Set();
  for (const range of config.off) {
    for (let day = dayNumber(range.from); day <= dayNumber(range.to); day++) daysOff.add(day);
  }
  const returnDays = new Set(config.ret.map(dayNumber));
  const hoursOn = day => (daysOff.has(day) || returnDays.has(day)) ? 0 : config.week[weekdayOf(day)];
  return { daysOff, returnDays, hoursOn };
}

// Logs on or before the 'asOf' day are already inside the opening hours, so they are not added twice.
function totalHours(config, logs) {
  const openUntil = dayNumber(config.open.asOf);
  let approved = config.open.approved;
  let pending = config.open.pending;
  for (const [date, entry] of Object.entries(logs)) {
    if (dayNumber(date) <= openUntil) continue;
    if (entry.ok) approved += entry.h; else pending += entry.h;
  }
  return { approved, pending };
}

function plannedHours(rules, fromDay, toDay) {
  let total = 0;
  for (let day = fromDay; day <= toDay; day++) total += rules.hoursOn(day);
  return total;
}
function countWorkdays(rules, fromDay, toDay) {
  let count = 0;
  for (let day = fromDay; day <= toDay; day++) if (rules.hoursOn(day) > 0) count++;
  return count;
}
function findFinishDay(rules, fromDay, hoursLeft) {
  for (let day = fromDay; day < fromDay + LIMITS.lookaheadDays; day++) {
    hoursLeft -= rules.hoursOn(day);
    if (hoursLeft <= 0) return day;
  }
  return null;
}

function getModel() {
  const config = state.cfg;
  const rules = buildRules(config);
  const startDay = dayNumber(config.start);
  const endDay = dayNumber(config.end);

  const { approved, pending } = totalHours(config, state.logs);
  const done = approved + pending;
  const left = Math.max(0, config.min - done);

  const lastCountedDay = state.logs[dayString(today)] ? today : today - 1;
  const nextDay = Math.max(lastCountedDay + 1, startDay);
  const shouldHave = plannedHours(rules, startDay, Math.min(lastCountedDay, endDay));
  const finishDay = left > 0 ? findFinishDay(rules, nextDay, left) : null;
  const workdaysLeft = countWorkdays(rules, nextDay, endDay);

  return {
    config, rules, endDay, approved, pending, done, left, shouldHave, finishDay,
    openUntil: dayNumber(config.open.asOf),
    neededPerDay: workdaysLeft > 0 ? left / workdaysLeft : null
  };
}

function drawFinishCard(model) {
  const t = text();
  let bigText = '?';
  let tagClass = '', tagText = '';

  if (model.left <= 0) {
    bigText = t.done; tagClass = 'good'; tagText = t.complete;
  } else if (model.finishDay !== null) {
    bigText = shortDate(model.finishDay);
    const daysLate = model.finishDay - model.endDay;
    if (daysLate > 0) { tagClass = 'bad'; tagText = t.late(daysLate); }
    else if (daysLate < 0) { tagClass = 'good'; tagText = t.early(-daysLate); }
    else { tagClass = 'good'; tagText = t.onLastDay; }
  }

  let needNote = '';
  const finishesLate = model.finishDay !== null && model.finishDay > model.endDay;
  if (finishesLate && model.neededPerDay !== null) {
    const hours = showNumber(Math.ceil(model.neededPerDay * 10) / 10);
    needNote = `<div class="need-note">${esc(t.needPerDay(hours))}</div>`;
  }

  $('#finish-card').innerHTML =
    `<span class="muted">${esc(t.finishOn)}</span>
     <span class="finish-date">${esc(bigText)}</span>
     <div class="finish-meta">
       ${tagText ? `<span class="tag ${tagClass}">${esc(tagText)}</span>` : ''}
     </div>${needNote}`;
}

function drawProgress(model) {
  const t = text();
  const total = Math.max(1, model.config.min);
  const percent = hours => Math.min(100, Math.max(0, hours / total * 100));
  $('#progress').innerHTML =
    `<div class="progress-total"><b>${showNumber(model.done)} h</b><span class="muted small">${esc(t.ofMin(showNumber(total)))}</span></div>
     <div class="bar" role="img" aria-label="${esc(showNumber(model.done))} / ${esc(showNumber(total))} h">
       <i class="pending" style="width:${percent(model.done)}%"></i>
       <i class="approved" style="width:${percent(model.approved)}%"></i>
       <span class="plan-mark" style="left:calc(${percent(model.shouldHave)}% - 1px)"></span>
     </div>
     <div class="bar-caption"><span>${esc(t.plan(showNumber(model.shouldHave)))}</span></div>
     <ul class="facts">
       <li><span>${esc(t.left)}</span><b>${showNumber(model.left)} h</b></li>
       ${model.pending > 0 ? `<li><span>${esc(t.waiting)}</span><b>${showNumber(model.pending)} h</b></li>` : ''}
     </ul>`;
}

function drawWeek(model) {
  const t = text();
  const monday = today - ((weekdayOf(today) + 6) % 7);
  let html = '';
  for (let i = 0; i < 5; i++) {
    const day = monday + i;
    const date = dayString(day);
    const entry = state.logs[date];
    const planned = model.rules.hoursOn(day);
    let squareClass = '', label = '';

    if (entry) { squareClass = 'worked'; label = showNumber(entry.h); }
    else if (day <= model.openUntil && planned > 0) { squareClass = 'worked'; label = showNumber(planned); }
    else if (planned === 0) { squareClass = 'free'; label = '-'; }
    else if (day === today) { squareClass = 'today'; label = '?'; }

    html += `<button type="button" data-action="pick-day" data-date="${date}" aria-label="${esc(shortDate(day))}">
               <small>${t.weekdays[i]}</small><span class="square ${squareClass}">${esc(label)}</span></button>`;
  }
  $('#week').innerHTML = html;
}

function drawHome() {
  const chip = $('#period-btn');
  chip.hidden = !(isUnlocked(2) || period === 2);
  chip.textContent = `${text().periodName(period)} (${text().change})`;
  const model = getModel();
  drawFinishCard(model);
  drawProgress(model);
  drawWeek(model);
}

function drawLogScreen() {
  const t = text();
  const date = $('#log-date').value;
  const hasEntry = Boolean(state.logs[date]);

  $('#hours-value').textContent = showNumber(hoursToLog);
  $('#save-btn').textContent = hasEntry ? t.update(showNumber(hoursToLog)) : t.save(showNumber(hoursToLog));
  $('#chips').innerHTML = [4, 6, 8, 0]
    .map(hours => `<button type="button" data-chip="${hours}" aria-pressed="${hours === hoursToLog}">${hours}</button>`)
    .join('');

  const lockNote = $('#lock-note');
  const tooOld = today - dayNumber(date) > LIMITS.lockAfterDays;
  lockNote.hidden = !tooOld;
  lockNote.textContent = tooOld ? t.locked : '';

  const latestDates = Object.keys(state.logs).sort().reverse().slice(0, 2);
  $('#latest').innerHTML = latestDates.length
    ? `<div class="small muted" style="margin-bottom:6px">${esc(t.latest)}</div>
       <ul class="list">${latestDates.map(d =>
         `<li><span class="date">${esc(fullDate(d))}</span><span class="note"></span><span class="hours">${showNumber(state.logs[d].h)} h</span></li>`).join('')}</ul>`
    : '';
}

function entryRow(date, entry, openUntil) {
  const t = text();
  const isLocked = today - dayNumber(date) > LIMITS.lockAfterDays;
  const isOpening = dayNumber(date) <= openUntil;
  const tags = (isLocked ? ` <span class="tag warn small">${esc(t.lockedTag)}</span>` : '')
             + (isOpening ? ` <span class="tag warn small">${esc(t.inOpening)}</span>` : '');
  return `<li>
    <span class="date">${esc(fullDate(date))}</span>
    <span class="hours">${showNumber(entry.h)} h</span>
    <span class="note">${esc(entry.note)}${tags}</span>
    <button class="icon-btn ${entry.ok ? 'on' : ''}" type="button" data-action="toggle-approved" data-date="${date}" aria-pressed="${entry.ok}" aria-label="Approved">${ICONS.check}</button>
    <button class="icon-btn" type="button" data-action="delete-entry" data-date="${date}" aria-label="${esc(t.remove)}">${ICONS.close}</button>
  </li>`;
}

function drawEntries() {
  const model = getModel();
  const dates = Object.keys(state.logs).sort().reverse().slice(0, 60);
  $('#pending-note').textContent = text().pendingNote(model.pending > 0 ? showNumber(model.pending) : 0);
  $('#entries-list').innerHTML = dates.length
    ? dates.map(date => entryRow(date, state.logs[date], model.openUntil)).join('')
    : `<li class="empty">${esc(text().noEntries)}</li>`;
}

function calendarCellClass(day, model) {
  const planned = model.rules.hoursOn(day);
  const entry = state.logs[dayString(day)];
  let cellClass = '';
  if (model.rules.returnDays.has(day)) cellClass = 'return-day';
  else if (model.rules.daysOff.has(day)) cellClass = 'day-off';
  else if (planned === 0) cellClass = 'no-work';
  if (entry && day > model.openUntil) cellClass = (planned > 0 && entry.h < planned - 0.01) ? 'short' : 'logged';
  if (day === today) cellClass += ' today';
  if (day === model.endDay) cellClass += ' last-day';
  return cellClass;
}

function drawCalendar() {
  const t = text();
  const model = getModel();
  if (shownMonth === null) {
    const now = new Date(today * MS_PER_DAY);
    shownMonth = now.getUTCFullYear() * 12 + now.getUTCMonth();
  }
  const year = Math.floor(shownMonth / 12);
  const month = shownMonth % 12;
  $('#month-name').textContent = `${t.months[month]} ${year}`;

  const firstDay = Math.round(Date.UTC(year, month, 1) / MS_PER_DAY);
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const emptyCells = (weekdayOf(firstDay) + 6) % 7;      // week starts on Monday

  let html = t.weekdays.map(name => `<div class="weekday">${name}</div>`).join('');
  html += '<button class="blank" tabindex="-1" aria-hidden="true"></button>'.repeat(emptyCells);
  for (let i = 0; i < daysInMonth; i++) {
    const day = firstDay + i;
    const entry = state.logs[dayString(day)];
    const hoursNote = entry && day > model.openUntil ? `<small>${showNumber(entry.h)}</small>` : '';
    html += `<button type="button" class="${calendarCellClass(day, model)}" data-action="pick-day" data-date="${dayString(day)}" aria-label="${esc(shortDate(day))}">${i + 1}${hoursNote}</button>`;
  }
  $('#calendar').innerHTML = html;

  const key = (color, border, extra = '') => `<b style="background:${color};border:1px solid ${border};${extra}"></b>`;
  const items = [
    [key('var(--good-bg)', 'var(--accent-bar)'), t.legend.logged],
    [key('var(--bad-bg)', 'var(--bad)'), t.legend.short],
    [key('var(--warn-bg)', 'var(--warn)'), t.legend.returnDay],
    [key('var(--track)', 'var(--line)'), t.legend.dayOff],
    [key('var(--bg)', 'var(--line)'), t.legend.noWork],
    [key('var(--surface)', 'var(--line)', 'box-shadow:inset 0 -3px 0 var(--accent-bar)'), t.legend.lastDay]
  ];
  $('#legend').innerHTML = items.map(([swatch, name]) => `<span>${swatch}${esc(name)}</span>`).join('');
}

function removableRow(label, note, action, value) {
  return `<li><span class="date">${label}</span><span class="note">${note}</span>
    <button class="icon-btn" type="button" data-action="${action}" data-value="${esc(value)}" aria-label="${esc(text().remove)}">${ICONS.close}</button></li>`;
}

function drawSettingsLists() {
  const t = text();
  const config = state.cfg;
  $('#off-list').innerHTML = config.off.length
    ? config.off.map((range, index) => {
        const span = range.to !== range.from ? ` ${esc(text().toWord)} ${esc(fullDate(range.to))}` : '';
        return removableRow(esc(fullDate(range.from)) + span, esc(range.label), 'delete-off', index);
      }).join('')
    : `<li class="empty">${esc(t.nothingAdded)}</li>`;
  $('#return-list').innerHTML = config.ret.length
    ? [...config.ret].sort().map(date => removableRow(esc(fullDate(date)), '', 'delete-return', date)).join('')
    : `<li class="empty">${esc(t.nothingAdded)}</li>`;
}

function weekHoursInputs(idPrefix, week) {
  return [1, 2, 3, 4, 5, 6, 0].map((weekday, i) =>
    `<label for="${idPrefix}-${weekday}"><span>${text().weekdays[i]}</span>
       <input id="${idPrefix}-${weekday}" data-weekday="${weekday}" type="number" inputmode="decimal" step="0.25" min="0" max="24" value="${week[weekday]}"></label>`).join('');
}

// Skipped while someone is typing in the settings, so a sync does not overwrite their input.
function fillSettingsFields() {
  if (document.activeElement && $('#view-settings').contains(document.activeElement)) return;
  const config = state.cfg;
  $('#set-start').value = config.start;
  $('#set-approved').value = config.open.approved;
  $('#set-pending').value = config.open.pending;
  $('#week-hours').innerHTML = weekHoursInputs('hours', config.week);
}

function fillSetupFields() {
  const config = state.cfg;
  $('#setup-start').value = config.start;
  $('#setup-start').min = PERIODS[period].first;
  $('#setup-start').max = PERIODS[period].last;
  $('#setup-approved').value = config.open.approved;
  $('#setup-pending').value = config.open.pending;
  $('#setup-week').innerHTML = weekHoursInputs('setup-hours', config.week);
  $('#setup-error').hidden = true;
  fillSetupText();
}

function fillSetupText() {
  const official = PERIODS[period];
  const t = text();
  $('#setup-period').textContent = `${t.periodName(period)}: ${fullDate(official.first)} ${t.toWord} ${fullDate(official.last)}, ${official.hours} h`;
  $('#setup-error').textContent = t.setupError(fullDate(official.first), fullDate(official.last));
}

function isUnlocked(id) {
  const opens = PERIODS[id].opens;
  return opens === null || today >= dayNumber(opens);
}

function drawPeriodPicker() {
  const t = text();
  $('#period-list').innerHTML = [1, 2].map(id => {
    const official = PERIODS[id];
    const locked = !isUnlocked(id);
    const note = locked ? `<span class="small">${esc(t.opensOn(fullDate(official.opens)))}</span>` : '';
    return `<button class="period-btn" type="button" data-period="${id}" aria-pressed="${id === period}" ${locked ? 'disabled' : ''}>
      <b>${esc(t.periodName(id))}</b>
      <span class="small">${esc(fullDate(official.first))} ${esc(t.toWord)} ${esc(fullDate(official.last))}, ${official.hours} h</span>${note}</button>`;
  }).join('');
}

function switchPeriod(id) {
  if (!PERIODS[id] || !isUnlocked(id)) return;
  periodData[period] = state;
  period = id;
  state = periodData[id];
  writeSetting(STORAGE_KEYS.period, String(id));
  shownMonth = null;
  fillSettingsFields();
  fillSetupFields();
  showView(state.ready ? 'home' : 'setup');
}

function draw() {
  if (currentView === 'home') drawHome();
  else if (currentView === 'log') drawLogScreen();
  else if (currentView === 'entries') drawEntries();
  else if (currentView === 'calendar') drawCalendar();
  else if (currentView === 'settings') drawSettingsLists();
  else if (currentView === 'period') drawPeriodPicker();
}

function showView(name) {
  currentView = name;
  for (const view of document.querySelectorAll('.view')) view.hidden = (view.id !== `view-${name}`);
  draw();
  window.scrollTo(0, 0);
}

function openLogScreen(date) {
  const day = isDate(date) ? date : dayString(today);
  const entry = state.logs[day];
  $('#log-date').value = day;
  $('#log-note').value = entry ? entry.note : '';
  hoursToLog = entry ? entry.h : getModel().rules.hoursOn(dayNumber(day));
  showView('log');
}

function applyLanguage() {
  const t = text();
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll('[data-text]')) {
    if (typeof t[el.dataset.text] === 'string') el.textContent = t[el.dataset.text];
  }
  for (const el of document.querySelectorAll('[data-placeholder]')) el.placeholder = t[el.dataset.placeholder] || '';
  for (const el of document.querySelectorAll('[data-lang]')) el.setAttribute('aria-pressed', String(el.dataset.lang === lang));
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme);
  const button = $('#theme-btn');
  button.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  button.setAttribute('aria-label', theme === 'dark' ? text().lightMode : text().darkMode);
}
function fillIcons() {
  for (const el of document.querySelectorAll('[data-icon]')) el.innerHTML = ICONS[el.dataset.icon] || '';
}

function saveState() {
  periodData[period] = state;
  writeSetting(STORAGE_KEYS.state, JSON.stringify({ v: 2, periods: periodData }));
}

function commit() {
  state = cleanState(state);
  draw();
  saveState();
}

function readSetting(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function writeSetting(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}

const clickActions = {
  'toggle-approved': el => {
    const entry = state.logs[el.dataset.date];
    if (entry) { entry.ok = !entry.ok; commit(); }
  },
  'delete-entry': el => { delete state.logs[el.dataset.date]; commit(); },
  'delete-off': el => { state.cfg.off.splice(Number(el.dataset.value), 1); commit(); },
  'delete-return': el => { state.cfg.ret = state.cfg.ret.filter(date => date !== el.dataset.value); commit(); },
  'pick-day': el => openLogScreen(el.dataset.date)
};

document.addEventListener('click', event => {
  const langButton = event.target.closest('[data-lang]');
  if (langButton) {
    lang = langButton.dataset.lang === 'nl' ? 'nl' : 'en';
    writeSetting(STORAGE_KEYS.lang, lang);
    applyLanguage(); applyTheme(); fillSettingsFields(); draw();
    fillSetupText();
    document.querySelectorAll('#setup-week label span').forEach((label, i) => { label.textContent = text().weekdays[i]; });
    return;
  }
  if (event.target.closest('#theme-btn')) {
    theme = theme === 'dark' ? 'light' : 'dark';
    writeSetting(STORAGE_KEYS.theme, theme);
    applyTheme();
    return;
  }
  const periodButton = event.target.closest('[data-period]');
  if (periodButton) { switchPeriod(Number(periodButton.dataset.period)); return; }

  const goButton = event.target.closest('[data-go]');
  if (goButton) { showView(goButton.dataset.go); return; }

  const chip = event.target.closest('[data-chip]');
  if (chip) { hoursToLog = toHours(chip.dataset.chip, LIMITS.hoursPerDay); drawLogScreen(); return; }

  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const action = clickActions[actionButton.dataset.action];
  const date = actionButton.dataset.date;
  if (action && (date === undefined || isDate(date))) action(actionButton);
});

$('#add-today-btn').addEventListener('click', () => openLogScreen());
$('#period-btn').addEventListener('click', () => showView('period'));
$('#less-btn').addEventListener('click', () => { hoursToLog = Math.max(0, hoursToLog - 0.5); drawLogScreen(); });
$('#more-btn').addEventListener('click', () => { hoursToLog = Math.min(LIMITS.hoursPerDay, hoursToLog + 0.5); drawLogScreen(); });
$('#prev-month').addEventListener('click', () => { shownMonth--; drawCalendar(); });
$('#next-month').addEventListener('click', () => { shownMonth++; drawCalendar(); });
$('#approve-all-btn').addEventListener('click', () => {
  for (const entry of Object.values(state.logs)) entry.ok = true;
  commit();
});

$('#log-date').addEventListener('change', () => {
  const date = $('#log-date').value;
  if (isDate(date)) openLogScreen(date);
});
$('#save-btn').addEventListener('click', () => {
  const date = $('#log-date').value;
  if (!isDate(date)) return;
  const previous = state.logs[date];
  state.logs[date] = { h: hoursToLog, note: $('#log-note').value, ok: previous ? previous.ok : false };
  state = cleanState(state);
  saveState();
  showView('home');
});

$('#off-form').addEventListener('submit', event => {
  event.preventDefault();
  const from = $('#off-from').value;
  const to = $('#off-to').value || from;
  if (!isDate(from)) return;
  state.cfg.off.push({ from, to, label: $('#off-label').value });
  state.cfg.off.sort((a, b) => a.from.localeCompare(b.from));
  event.target.reset();
  commit();
});
$('#return-form').addEventListener('submit', event => {
  event.preventDefault();
  const date = $('#return-date').value;
  if (!isDate(date)) return;
  state.cfg.ret.push(date);
  event.target.reset();
  commit();
});

$('#export-btn').addEventListener('click', exportBackup);
$('#import-btn').addEventListener('click', () => $('#import-file').click());
$('#import-file').addEventListener('change', event => {
  importBackup(event.target.files[0]);
  event.target.value = '';
});

$('#setup-import-btn').addEventListener('click', () => $('#import-file').click());
$('#reset-btn').addEventListener('click', () => {
  if (!window.confirm(text().resetConfirm)) return;
  state = cleanState({});
  saveState();
  fillSetupFields();
  showView('setup');
});
$('#setup-form').addEventListener('submit', event => {
  event.preventDefault();
  const start = $('#setup-start').value;
  if (!isDate(start) || start < PERIODS[period].first || start > PERIODS[period].last) { $('#setup-error').hidden = false; return; }
  const week = [0, 0, 0, 0, 0, 0, 0];
  for (const input of document.querySelectorAll('#setup-week input')) {
    week[Number(input.dataset.weekday)] = toHours(input.value, LIMITS.hoursPerDay);
  }
  state = cleanState({
    cfg: {
      start, week,
      open: { approved: $('#setup-approved').value, pending: $('#setup-pending').value, asOf: dayString(today - 1) },
      off: [], ret: []
    },
    logs: {},
    ready: true
  });
  commit();
  fillSettingsFields();
  showView('home');
});

const settingFields = {
  'set-start':    (config, value) => { if (isDate(value)) config.start = value; },
  'set-approved': (config, value) => { config.open.approved = toHours(value, LIMITS.totalHours); },
  'set-pending':  (config, value) => { config.open.pending = toHours(value, LIMITS.totalHours); }
};
$('#view-settings').addEventListener('change', event => {
  const field = event.target;
  if (settingFields[field.id]) settingFields[field.id](state.cfg, field.value);
  else if (field.dataset.weekday !== undefined) state.cfg.week[Number(field.dataset.weekday)] = toHours(field.value, LIMITS.hoursPerDay);
  else return;
  commit();
});

// Reads the saved data. The first version saved one period as { cfg, logs }, that is treated as period 1.
function loadPeriods(raw) {
  const loaded = {};
  if (raw && typeof raw === 'object' && raw.periods && typeof raw.periods === 'object') {
    for (const id of [1, 2]) if (raw.periods[id]) loaded[id] = cleanState(raw.periods[id], id);
  } else if (raw && typeof raw === 'object' && raw.cfg) {
    loaded[1] = { ...cleanState(raw, 1), ready: true };
  }
  for (const id of [1, 2]) if (!loaded[id]) loaded[id] = cleanState({}, id);
  return loaded;
}

function loadSavedState() {
  let saved = null;
  try { saved = JSON.parse(readSetting(STORAGE_KEYS.state)); } catch (e) { saved = null; }
  periodData = loadPeriods(saved);
  const savedPeriod = Number(readSetting(STORAGE_KEYS.period));
  period = PERIODS[savedPeriod] && isUnlocked(savedPeriod) ? savedPeriod : 1;
  state = periodData[period];
}

function exportBackup() {
  periodData[period] = state;
  const file = new Blob([JSON.stringify({ v: 2, periods: periodData }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = `stage-hours-${dayString(today)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}
function importBackup(file) {
  if (!file || file.size > 1000000) { alert(text().importFailed); return; }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = loadPeriods(JSON.parse(reader.result));      // checked like any other input
      for (const id of [1, 2]) {
        if (imported[id].ready) periodData[id] = imported[id];
      }
      if (!periodData[period].ready) period = periodData[1].ready ? 1 : 2;
      state = periodData[period];
      writeSetting(STORAGE_KEYS.period, String(period));
      commit();
      fillSettingsFields();
      fillSetupFields();
      showView('home');
      alert(text().importDone);
    } catch (e) {
      alert(text().importFailed);
    }
  };
  reader.readAsText(file);
}

function registerOfflineWorker() {
  const secure = location.protocol === 'https:' || location.hostname === 'localhost';
  if ('serviceWorker' in navigator && secure) navigator.serviceWorker.register('sw.js').catch(() => {});
}

function start() {
  lang = readSetting(STORAGE_KEYS.lang) === 'nl' ? 'nl' : 'en';
  theme = readSetting(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light';
  const firstVisit = readSetting(STORAGE_KEYS.state) === null && readSetting(STORAGE_KEYS.period) === null;
  loadSavedState();
  fillIcons();
  applyLanguage();
  applyTheme();
  fillSettingsFields();
  fillSetupFields();
  showView(firstVisit ? 'period' : state.ready ? 'home' : 'setup');
  registerOfflineWorker();
  setInterval(() => {                                        // roll over at midnight
    const now = todayNumber();
    if (now !== today) { today = now; if (currentView !== 'log') draw(); }
  }, 60000);
}

start();
