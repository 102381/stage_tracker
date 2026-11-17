<script setup>
import { computed } from 'vue'
import { app, t, state, model, shortDate, showNumber, isUnlockedNow, goTo, openLog, toggleTheme } from '../store.js'
import { dayString, weekdayOf } from '../logic.js'
import { ICONS } from '../icons.js'
import LangSwitch from '../components/LangSwitch.vue'

// The period link only shows when there is another period to switch to.
const showPeriodLink = computed(() => isUnlockedNow(2) || app.period === 2)

// The big date, the tag under it and the red note when you are running late.
const finish = computed(() => {
  const m = model.value
  let big = '?'
  let tagClass = ''
  let tag = ''
  if (m.left <= 0) {
    big = t.value.done
    tagClass = 'good'
    tag = t.value.complete
  } else if (m.finishDay !== null) {
    big = shortDate(m.finishDay)
    const daysLate = m.finishDay - m.endDay
    if (daysLate > 0) { tagClass = 'bad'; tag = t.value.late(daysLate) }
    else if (daysLate < 0) { tagClass = 'good'; tag = t.value.early(-daysLate) }
    else { tagClass = 'good'; tag = t.value.onLastDay }
  }
  const late = m.finishDay !== null && m.finishDay > m.endDay && m.neededPerDay !== null
  const note = late ? t.value.needPerDay(showNumber(Math.ceil(m.neededPerDay * 10) / 10)) : ''
  return { big, tagClass, tag, note }
})

// Share of the bar for a number of hours, kept between 0 and 100.
function percent(hours) {
  const total = Math.max(1, model.value.config.min)
  return Math.min(100, Math.max(0, hours / total * 100))
}

// One square for each weekday of this week.
const week = computed(() => {
  const m = model.value
  const monday = app.today - ((weekdayOf(app.today) + 6) % 7)
  const squares = []
  for (let i = 0; i < 5; i++) {
    const day = monday + i
    const date = dayString(day)
    const entry = state.value.logs[date]
    const planned = m.rules.hoursOn(day)
    let squareClass = ''
    let label = ''
    if (entry) { squareClass = 'worked'; label = showNumber(entry.h) }
    else if (day <= m.openUntil && planned > 0) { squareClass = 'worked'; label = showNumber(planned) }
    else if (planned === 0) { squareClass = 'free'; label = '-' }
    else if (day === app.today) { squareClass = 'today'; label = '?' }
    squares.push({ date, day, squareClass, label, name: t.value.weekdays[i] })
  }
  return squares
})
</script>

<template>
  <section class="view" id="view-home">
    <div class="top">
      <span class="brand">{{ t.title }}</span>
      <div class="tools">
        <button class="icon-btn" type="button" id="theme-btn" :aria-label="app.theme === 'dark' ? t.lightMode : t.darkMode" @click="toggleTheme" v-html="app.theme === 'dark' ? ICONS.sun : ICONS.moon"></button>
        <LangSwitch />
      </div>
    </div>

    <button v-if="showPeriodLink" class="period-chip" type="button" id="period-btn" @click="goTo('period')">
      {{ t.periodName(app.period) }} ({{ t.change }})
    </button>

    <div class="hero" id="finish-card">
      <span class="muted">{{ t.finishOn }}</span>
      <span class="finish-date">{{ finish.big }}</span>
      <div class="finish-meta">
        <span v-if="finish.tag" class="tag" :class="finish.tagClass">{{ finish.tag }}</span>
      </div>
      <div v-if="finish.note" class="need-note">{{ finish.note }}</div>
    </div>

    <div id="progress">
      <div class="progress-total">
        <b>{{ showNumber(model.done) }} h</b>
        <span class="muted small">{{ t.ofMin(showNumber(model.config.min)) }}</span>
      </div>
      <div class="bar" role="img" :aria-label="showNumber(model.done) + ' / ' + showNumber(model.config.min) + ' h'">
        <i class="pending" :style="{ width: percent(model.done) + '%' }"></i>
        <i class="approved" :style="{ width: percent(model.approved) + '%' }"></i>
        <span class="plan-mark" :style="{ left: 'calc(' + percent(model.shouldHave) + '% - 1px)' }"></span>
      </div>
      <div class="bar-caption"><span>{{ t.plan(showNumber(model.shouldHave)) }}</span></div>
      <ul class="facts">
        <li><span>{{ t.left }}</span><b>{{ showNumber(model.left) }} h</b></li>
        <li v-if="model.pending > 0"><span>{{ t.waiting }}</span><b>{{ showNumber(model.pending) }} h</b></li>
      </ul>
    </div>

    <div class="week" id="week" role="group" aria-label="This week">
      <button v-for="square in week" :key="square.date" type="button" :aria-label="shortDate(square.day)" @click="openLog(square.date)">
        <small>{{ square.name }}</small>
        <span class="square" :class="square.squareClass">{{ square.label }}</span>
      </button>
    </div>

    <div class="spacer"></div>
    <button class="big-btn" type="button" id="add-today-btn" @click="openLog()">
      <span v-html="ICONS.plus"></span><span>{{ t.addToday }}</span>
    </button>
    <div class="nav-links">
      <button class="nav-link" type="button" data-go="entries" @click="goTo('entries')">{{ t.entries }}</button>
      <button class="nav-link" type="button" data-go="calendar" @click="goTo('calendar')">{{ t.calendar }}</button>
      <button class="nav-link" type="button" data-go="settings" @click="goTo('settings')">{{ t.settings }}</button>
    </div>
  </section>
</template>
