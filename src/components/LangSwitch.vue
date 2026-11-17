<script setup>
import { app, setLang } from '../store.js'
</script>

<template>
  <div class="lang" role="group" aria-label="Language">
    <button type="button" data-lang="en" :aria-pressed="app.lang === 'en'" @click="setLang('en')">EN</button>
    <button type="button" data-lang="nl" :aria-pressed="app.lang === 'nl'" @click="setLang('nl')">NL</button>
  </div>
</template>
