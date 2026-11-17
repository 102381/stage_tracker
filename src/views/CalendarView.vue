<script setup>
import { computed } from 'vue'
import { app, t, state, model, showNumber, shortDate, openLog } from '../store.js'
import { MS_PER_DAY, dayString, weekdayOf } from '../logic.js'
import { ICONS } from '../icons.js'
import BackHeader from '../components/BackHeader.vue'

// The calendar opens on the current month.
if (app.shownMonth === null) {
  const now = new Date(app.today * MS_PER_DAY)
  app.shownMonth = now.getUTCFullYear() * 12 + now.getUTCMonth()
}

const monthTitle = computed(() => `${t.value.months[app.shownMonth % 12]} ${Math.floor(app.shownMonth / 12)}`)

// Which colour a day gets.
function cellClass(day) {
  const m = model.value
  const planned = m.rules.hoursOn(day)
  const entry = state.value.logs[dayString(day)]
  let cls = ''
  if (m.rules.returnDays.has(day)) cls = 'return-day'
  else if (m.rules.daysOff.has(day)) cls = 'day-off'
  else if (planned === 0) cls = 'no-work'
  if (entry && day > m.openUntil) cls = (planned > 0 && entry.h < planned - 0.01) ? 'short' : 'logged'
  if (day === app.today) cls += ' today'
  if (day === m.endDay) cls += ' last-day'
  return cls
}

const emptyCells = computed(() => {
  const year = Math.floor(app.shownMonth / 12)
  const month = app.shownMonth % 12
  const firstDay = Math.round(Date.UTC(year, month, 1) / MS_PER_DAY)
  return (weekdayOf(firstDay) + 6) % 7        // the week starts on Monday
})

const days = computed(() => {
  const year = Math.floor(app.shownMonth / 12)
  const month = app.shownMonth % 12
  const firstDay = Math.round(Date.UTC(year, month, 1) / MS_PER_DAY)
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const list = []
  for (let i = 0; i < count; i++) {
    const day = firstDay + i
    const entry = state.value.logs[dayString(day)]
    list.push({
      day,
      number: i + 1,
      date: dayString(day),
      cls: cellClass(day),
      hours: entry && day > model.value.openUntil ? showNumber(entry.h) : ''
    })
  }
  return list
})

const legend = computed(() => [
  { name: t.value.legend.logged, style: 'background:var(--good-bg);border:1px solid var(--accent-bar)' },
  { name: t.value.legend.short, style: 'background:var(--bad-bg);border:1px solid var(--bad)' },
  { name: t.value.legend.returnDay, style: 'background:var(--warn-bg);border:1px solid var(--warn)' },
  { name: t.value.legend.dayOff, style: 'background:var(--track);border:1px solid var(--line)' },
  { name: t.value.legend.noWork, style: 'background:var(--bg);border:1px solid var(--line)' },
  { name: t.value.legend.lastDay, style: 'background:var(--surface);border:1px solid var(--line);box-shadow:inset 0 -3px 0 var(--accent-bar)' }
])
</script>

<template>
  <section class="view" id="view-calendar">
    <BackHeader :title="t.calendar" />

    <div class="month-head">
      <button class="icon-btn" type="button" id="prev-month" aria-label="Previous month" @click="app.shownMonth--" v-html="ICONS.back"></button>
      <strong class="month-name" id="month-name">{{ monthTitle }}</strong>
      <button class="icon-btn" type="button" id="next-month" aria-label="Next month" @click="app.shownMonth++" v-html="ICONS.next"></button>
    </div>

    <div class="calendar" id="calendar">
      <div v-for="name in t.weekdays" :key="name" class="weekday">{{ name }}</div>
      <button v-for="n in emptyCells" :key="'blank' + n" class="blank" tabindex="-1" aria-hidden="true"></button>
      <button v-for="d in days" :key="d.date" type="button" :class="d.cls" :aria-label="shortDate(d.day)" @click="openLog(d.date)">
        {{ d.number }}<small v-if="d.hours">{{ d.hours }}</small>
      </button>
    </div>

    <div class="legend" id="legend">
      <span v-for="item in legend" :key="item.name"><b :style="item.style"></b>{{ item.name }}</span>
    </div>
  </section>
</template>
