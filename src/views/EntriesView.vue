<script setup>
import { computed } from 'vue'
import { app, t, state, model, showNumber, fullDate, commit } from '../store.js'
import { LIMITS, dayNumber } from '../logic.js'
import { ICONS } from '../icons.js'
import BackHeader from '../components/BackHeader.vue'

const dates = computed(() => Object.keys(state.value.logs).sort().reverse().slice(0, 60))

function isLocked(date) {
  return app.today - dayNumber(date) > LIMITS.lockAfterDays
}
function isInOpening(date) {
  return dayNumber(date) <= model.value.openUntil
}

function toggleApproved(date) {
  state.value.logs[date].ok = !state.value.logs[date].ok
  commit()
}
function deleteEntry(date) {
  delete state.value.logs[date]
  commit()
}
function approveAll() {
  for (const entry of Object.values(state.value.logs)) entry.ok = true
  commit()
}
</script>

<template>
  <section class="view" id="view-entries">
    <BackHeader :title="t.entries">
      <button class="small-btn" type="button" id="approve-all-btn" @click="approveAll">{{ t.approveAll }}</button>
    </BackHeader>

    <div class="small muted" id="pending-note">{{ t.pendingNote(model.pending > 0 ? showNumber(model.pending) : 0) }}</div>

    <ul class="list" id="entries-list">
      <li v-for="date in dates" :key="date">
        <span class="date">{{ fullDate(date) }}</span>
        <span class="hours">{{ showNumber(state.logs[date].h) }} h</span>
        <span class="note">
          {{ state.logs[date].note }}
          <span v-if="isLocked(date)" class="tag warn small">{{ t.lockedTag }}</span>
          <span v-if="isInOpening(date)" class="tag warn small">{{ t.inOpening }}</span>
        </span>
        <button class="icon-btn" :class="{ on: state.logs[date].ok }" type="button" :aria-pressed="state.logs[date].ok" aria-label="Approved" @click="toggleApproved(date)" v-html="ICONS.check"></button>
        <button class="icon-btn" type="button" :aria-label="t.remove" @click="deleteEntry(date)" v-html="ICONS.close"></button>
      </li>
      <li v-if="dates.length === 0" class="empty">{{ t.noEntries }}</li>
    </ul>
  </section>
</template>
