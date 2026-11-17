import { createApp } from 'vue'
import App from './App.vue'
import { app, startStore } from './store.js'
import { todayNumber } from './logic.js'
import './style.css'

startStore()
createApp(App).mount('#app')

// Move to the next day at midnight without reloading.
setInterval(() => { app.today = todayNumber() }, 60000)

// The offline copy only runs on the real site, not in the dev server.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {})
}
