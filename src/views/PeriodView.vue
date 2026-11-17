<script setup>
import { app, t, fullDate, isUnlockedNow, switchPeriod } from '../store.js'
import { PERIODS } from '../logic.js'
import LangSwitch from '../components/LangSwitch.vue'

const ids = [1, 2]
</script>

<template>
  <section class="view" id="view-period">
    <div class="top">
      <span class="brand">{{ t.title }}</span>
      <LangSwitch />
    </div>
    <h2>{{ t.pickTitle }}</h2>
    <div class="period-list" id="period-list">
      <button
        v-for="id in ids"
        :key="id"
        class="period-btn"
        type="button"
        :data-period="id"
        :aria-pressed="id === app.period"
        :disabled="!isUnlockedNow(id)"
        @click="switchPeriod(id)"
      >
        <b>{{ t.periodName(id) }}</b>
        <span class="small">{{ fullDate(PERIODS[id].first) }} {{ t.toWord }} {{ fullDate(PERIODS[id].last) }}, {{ PERIODS[id].hours }} h</span>
        <span v-if="!isUnlockedNow(id)" class="small">{{ t.opensOn(fullDate(PERIODS[id].opens)) }}</span>
      </button>
    </div>
  </section>
</template>
