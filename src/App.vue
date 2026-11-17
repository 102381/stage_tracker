<script setup>
import { app, importBackup } from './store.js'
import PeriodView from './views/PeriodView.vue'
import SetupView from './views/SetupView.vue'
import HomeView from './views/HomeView.vue'
import LogView from './views/LogView.vue'
import EntriesView from './views/EntriesView.vue'
import CalendarView from './views/CalendarView.vue'
import SettingsView from './views/SettingsView.vue'

function onFileChosen(event) {
  importBackup(event.target.files[0])
  event.target.value = ''
}
</script>

<template>
  <div class="app">
    <PeriodView v-if="app.view === 'period'" />
    <SetupView v-else-if="app.view === 'setup'" :key="app.period" />
    <HomeView v-else-if="app.view === 'home'" />
    <LogView v-else-if="app.view === 'log'" />
    <EntriesView v-else-if="app.view === 'entries'" />
    <CalendarView v-else-if="app.view === 'calendar'" />
    <SettingsView v-else-if="app.view === 'settings'" />

    <input id="import-file" class="visually-hidden" type="file" accept="application/json,.json" aria-label="Backup file" @change="onFileChosen">
  </div>
</template>
