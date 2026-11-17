<script setup>
import { ref, watch } from 'vue'
import { t } from '../store.js'
import { PERIODS, isDate } from '../logic.js'

// A date picker that always shows day, month, year. The value is 'YYYY-MM-DD', or '' while it is incomplete.
const props = defineProps({ modelValue: { type: String, default: '' }, id: String })
const emit = defineEmits(['update:modelValue'])

const days = Array.from({ length: 31 }, (_, i) => i + 1)
const firstYear = Number(PERIODS[1].first.slice(0, 4))
const lastYear = Number(PERIODS[2].last.slice(0, 4))
const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i)

const day = ref('')
const month = ref('')
const year = ref('')

function joined() {
  if (!day.value || !month.value || !year.value) return ''
  const value = `${year.value}-${String(month.value).padStart(2, '0')}-${String(day.value).padStart(2, '0')}`
  return isDate(value) ? value : ''
}

// Follow the value from outside, but keep a half finished choice while the person is still picking.
watch(() => props.modelValue, value => {
  if (value === joined()) return
  const [y, m, d] = (value || '').split('-')
  year.value = y || ''
  month.value = m ? String(Number(m)) : ''
  day.value = d ? String(Number(d)) : ''
}, { immediate: true })

function changed() {
  // 31 Feb becomes the last day of February.
  if (day.value && month.value && year.value && !joined()) {
    day.value = String(new Date(Date.UTC(Number(year.value), Number(month.value), 0)).getUTCDate())
  }
  emit('update:modelValue', joined())
}
</script>

<template>
  <div class="date-input" :id="id" role="group">
    <select :id="id + '-day'" :aria-label="t.day" v-model="day" @change="changed">
      <option value="">{{ t.day }}</option>
      <option v-for="n in days" :key="n" :value="String(n)">{{ n }}</option>
    </select>
    <select :id="id + '-month'" :aria-label="t.month" v-model="month" @change="changed">
      <option value="">{{ t.month }}</option>
      <option v-for="(name, i) in t.months" :key="name" :value="String(i + 1)">{{ name }}</option>
    </select>
    <select :id="id + '-year'" :aria-label="t.year" v-model="year" @change="changed">
      <option value="">{{ t.year }}</option>
      <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
    </select>
  </div>
</template>
