<script setup>
import { ref } from 'vue'
import { app, t, state, fullDate, commit, goTo } from '../store.js'
import { PERIODS, LIMITS, isDate, toHours, cleanState, dayString } from '../logic.js'
import LangSwitch from '../components/LangSwitch.vue'

const official = PERIODS[app.period]
const config = state.value.cfg

// The form starts with the current values and only changes the saved data on submit.
const start = ref(config.start)
const approved = ref(config.open.approved)
const pending = ref(config.open.pending)
const week = ref([...config.week])
const showError = ref(false)

const weekdayOrder = [1, 2, 3, 4, 5, 6, 0]    // Monday first, Sunday last

function submit() {
  if (!isDate(start.value) || start.value < official.first || start.value > official.last) {
    showError.value = true
    return
  }
  app.periodData[app.period] = cleanState({
    cfg: {
      start: start.value,
      week: week.value.map(hours => toHours(hours, LIMITS.hoursPerDay)),
      open: { approved: approved.value, pending: pending.value, asOf: dayString(app.today - 1) }
    },
    logs: {},
    ready: true
  }, app.period)
  commit()
  goTo('home')
}

function chooseBackup() {
  document.getElementById('import-file').click()
}
</script>

<template>
  <section class="view" id="view-setup">
    <div class="top">
      <span class="brand">{{ t.title }}</span>
      <LangSwitch />
    </div>
    <h2>{{ t.setupTitle }}</h2>
    <div class="small muted" id="setup-period">{{ t.periodName(app.period) }}: {{ fullDate(official.first) }} {{ t.toWord }} {{ fullDate(official.last) }}, {{ official.hours }} h</div>

    <form class="stack" id="setup-form" novalidate @submit.prevent="submit">
      <div class="field-grid">
        <label for="setup-start"><span>{{ t.start }}</span>
          <input id="setup-start" type="date" required v-model="start" :min="official.first" :max="official.last">
        </label>
      </div>

      <h3>{{ t.weekHint }}</h3>
      <div class="week-hours" id="setup-week">
        <label v-for="(weekday, i) in weekdayOrder" :key="weekday" :for="'setup-hours-' + weekday">
          <span>{{ t.weekdays[i] }}</span>
          <input :id="'setup-hours-' + weekday" type="number" inputmode="decimal" step="0.25" min="0" max="24" v-model="week[weekday]">
        </label>
      </div>

      <h3>{{ t.openTitle }}</h3>
      <div class="field-grid">
        <label for="setup-approved"><span>{{ t.approved }}</span>
          <input id="setup-approved" type="number" step="0.25" min="0" max="5000" v-model="approved">
        </label>
        <label for="setup-pending"><span>{{ t.pending }}</span>
          <input id="setup-pending" type="number" step="0.25" min="0" max="5000" v-model="pending">
        </label>
      </div>

      <div class="lock-note" id="setup-error" v-if="showError">{{ t.setupError(fullDate(official.first), fullDate(official.last)) }}</div>
      <button class="big-btn" type="submit">{{ t.startBtn }}</button>
      <button class="small-btn" type="button" id="setup-import-btn" @click="chooseBackup">{{ t.haveBackup }}</button>
    </form>
  </section>
</template>
