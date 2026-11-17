<script setup>
import { ref } from 'vue'
import { app, t, state, fullDate, commit, exportBackup, resetPeriod } from '../store.js'
import { PERIODS, LIMITS, isDate, toHours } from '../logic.js'
import { ICONS } from '../icons.js'
import BackHeader from '../components/BackHeader.vue'

const weekdayOrder = [1, 2, 3, 4, 5, 6, 0]    // Monday first, Sunday last

// The forms for adding a day off and a return day.
const offFrom = ref('')
const offTo = ref('')
const offLabel = ref('')
const returnDate = ref('')

function setStart(event) {
  if (!isDate(event.target.value)) return
  state.value.cfg.start = event.target.value
  commit()
}
function setOpeningHours(field, event) {
  state.value.cfg.open[field] = toHours(event.target.value, LIMITS.totalHours)
  commit()
}
function setWeekHours(weekday, event) {
  state.value.cfg.week[weekday] = toHours(event.target.value, LIMITS.hoursPerDay)
  commit()
}

function addDayOff() {
  if (!isDate(offFrom.value)) return
  state.value.cfg.off.push({ from: offFrom.value, to: offTo.value || offFrom.value, label: offLabel.value })
  state.value.cfg.off.sort((a, b) => a.from.localeCompare(b.from))
  offFrom.value = offTo.value = offLabel.value = ''
  commit()
}
function removeDayOff(index) {
  state.value.cfg.off.splice(index, 1)
  commit()
}
function addReturnDay() {
  if (!isDate(returnDate.value)) return
  state.value.cfg.ret.push(returnDate.value)
  returnDate.value = ''
  commit()
}
function removeReturnDay(date) {
  state.value.cfg.ret = state.value.cfg.ret.filter(day => day !== date)
  commit()
}

function chooseBackup() {
  document.getElementById('import-file').click()
}
</script>

<template>
  <section class="view" id="view-settings">
    <BackHeader :title="t.settings" />

    <div class="field-grid">
      <label for="set-start"><span>{{ t.start }}</span>
        <input id="set-start" type="date" :value="state.cfg.start" :min="PERIODS[app.period].first" :max="PERIODS[app.period].last" @change="setStart">
      </label>
    </div>

    <h3>{{ t.weekHint }}</h3>
    <div class="week-hours" id="week-hours">
      <label v-for="(weekday, i) in weekdayOrder" :key="weekday" :for="'hours-' + weekday">
        <span>{{ t.weekdays[i] }}</span>
        <input :id="'hours-' + weekday" type="number" inputmode="decimal" step="0.25" min="0" max="24" :value="state.cfg.week[weekday]" @change="setWeekHours(weekday, $event)">
      </label>
    </div>

    <h3>{{ t.openTitle }}</h3>
    <div class="field-grid">
      <label for="set-approved"><span>{{ t.approved }}</span>
        <input id="set-approved" type="number" step="0.25" min="0" max="5000" :value="state.cfg.open.approved" @change="setOpeningHours('approved', $event)">
      </label>
      <label for="set-pending"><span>{{ t.pending }}</span>
        <input id="set-pending" type="number" step="0.25" min="0" max="5000" :value="state.cfg.open.pending" @change="setOpeningHours('pending', $event)">
      </label>
    </div>

    <h3>{{ t.daysOff }}</h3>
    <form class="inline-form" id="off-form" @submit.prevent="addDayOff">
      <label for="off-from"><span>{{ t.from }}</span><input id="off-from" type="date" required v-model="offFrom"></label>
      <label for="off-to"><span>{{ t.to }}</span><input id="off-to" type="date" v-model="offTo"></label>
      <label for="off-label"><span>{{ t.label }}</span><input id="off-label" type="text" maxlength="60" v-model="offLabel"></label>
      <button class="small-btn" type="submit">{{ t.add }}</button>
    </form>
    <ul class="list" id="off-list">
      <li v-for="(range, index) in state.cfg.off" :key="range.from + index">
        <span class="date">{{ fullDate(range.from) }}<template v-if="range.to !== range.from"> {{ t.toWord }} {{ fullDate(range.to) }}</template></span>
        <span class="note">{{ range.label }}</span>
        <button class="icon-btn" type="button" :aria-label="t.remove" @click="removeDayOff(index)" v-html="ICONS.close"></button>
      </li>
      <li v-if="state.cfg.off.length === 0" class="empty">{{ t.nothingAdded }}</li>
    </ul>

    <h3>{{ t.returnDays }}</h3>
    <form class="inline-form" id="return-form" @submit.prevent="addReturnDay">
      <label for="return-date"><span>{{ t.date }}</span><input id="return-date" type="date" required v-model="returnDate"></label>
      <button class="small-btn" type="submit">{{ t.add }}</button>
    </form>
    <ul class="list" id="return-list">
      <li v-for="date in [...state.cfg.ret].sort()" :key="date">
        <span class="date">{{ fullDate(date) }}</span><span class="note"></span>
        <button class="icon-btn" type="button" :aria-label="t.remove" @click="removeReturnDay(date)" v-html="ICONS.close"></button>
      </li>
      <li v-if="state.cfg.ret.length === 0" class="empty">{{ t.nothingAdded }}</li>
    </ul>

    <h3>{{ t.backup }}</h3>
    <div class="inline-form">
      <button class="small-btn" type="button" id="export-btn" @click="exportBackup">{{ t.exportBtn }}</button>
      <button class="small-btn" type="button" id="import-btn" @click="chooseBackup">{{ t.importBtn }}</button>
    </div>
    <button class="small-btn" type="button" id="reset-btn" @click="resetPeriod">{{ t.resetBtn }}</button>
    <div class="sync-note">{{ t.storedHere }}</div>
  </section>
</template>
