<script setup>
import { computed } from 'vue'
import { app, t, state, showNumber, fullDate, openLog, saveLog } from '../store.js'
import { LIMITS, dayNumber, isDate } from '../logic.js'
import { ICONS } from '../icons.js'
import BackHeader from '../components/BackHeader.vue'
import DateInput from '../components/DateInput.vue'

const quickHours = [4, 6, 8, 0]

// B3net stops accepting hours after 14 days, so older days get a warning.
const tooOld = computed(() => isDate(app.logDate) && app.today - dayNumber(app.logDate) > LIMITS.lockAfterDays)

const saveText = computed(() => {
  const hours = showNumber(app.hoursToLog)
  return state.value.logs[app.logDate] ? t.value.update(hours) : t.value.save(hours)
})

const latestDates = computed(() => Object.keys(state.value.logs).sort().reverse().slice(0, 2))

function onDateChange(value) {
  if (isDate(value)) openLog(value)
}
function less() {
  app.hoursToLog = Math.max(0, app.hoursToLog - 0.5)
}
function more() {
  app.hoursToLog = Math.min(LIMITS.hoursPerDay, app.hoursToLog + 0.5)
}
</script>

<template>
  <section class="view" id="view-log">
    <BackHeader :title="t.addTitle" />

    <div class="date-row"><DateInput id="log-date" :model-value="app.logDate" @update:model-value="onDateChange" /></div>
    <div class="lock-note" id="lock-note" v-if="tooOld">{{ t.locked }}</div>

    <div class="stepper">
      <button class="round-btn" type="button" id="less-btn" aria-label="Less" @click="less" v-html="ICONS.minus"></button>
      <div class="hours-value"><b id="hours-value">{{ showNumber(app.hoursToLog) }}</b><span>{{ t.hoursWord }}</span></div>
      <button class="round-btn" type="button" id="more-btn" aria-label="More" @click="more" v-html="ICONS.plus"></button>
    </div>

    <div class="chips" id="chips">
      <button v-for="hours in quickHours" :key="hours" type="button" :data-chip="hours" :aria-pressed="hours === app.hoursToLog" @click="app.hoursToLog = hours">{{ hours }}</button>
    </div>

    <label for="log-note"><span>{{ t.noteOpt }}</span>
      <input id="log-note" type="text" maxlength="200" :placeholder="t.notePh" v-model="app.logNote">
    </label>

    <div id="latest" v-if="latestDates.length">
      <div class="small muted" style="margin-bottom:6px">{{ t.latest }}</div>
      <ul class="list">
        <li v-for="date in latestDates" :key="date">
          <span class="date">{{ fullDate(date) }}</span><span class="note"></span><span class="hours">{{ showNumber(state.logs[date].h) }} h</span>
        </li>
      </ul>
    </div>

    <div class="spacer"></div>
    <button class="big-btn" type="button" id="save-btn" @click="saveLog">{{ saveText }}</button>
  </section>
</template>
