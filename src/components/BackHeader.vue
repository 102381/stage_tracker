<script setup>
import { goTo } from '../store.js'
import { ICONS } from '../icons.js'

defineProps({ title: String })
</script>

<template>
  <div class="top">
    <div class="top-left">
      <button class="icon-btn back" type="button" data-go="home" aria-label="Back" @click="goTo('home')" v-html="ICONS.back"></button>
      <h2>{{ title }}</h2>
    </div>
    <slot />
  </div>
</template>
