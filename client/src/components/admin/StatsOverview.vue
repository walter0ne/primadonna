<script setup>
import { computed } from 'vue'
import { formatPrice } from '../../utils/formatters.js'

const props = defineProps({
  appointments: { type: Array, default: () => [] },
})

const today = new Date().toISOString().slice(0, 10)

const todayAppts = computed(() =>
  props.appointments.filter(a => a.date.slice(0, 10) === today && a.status !== 'CANCELLED')
)

const weekStart = new Date()
weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
const weekStartStr = weekStart.toISOString().slice(0, 10)

const weekAppts = computed(() =>
  props.appointments.filter(a => a.date.slice(0, 10) >= weekStartStr && a.status !== 'CANCELLED')
)

const monthAppts = computed(() => {
  const month = today.slice(0, 7)
  return props.appointments.filter(a => a.date.slice(0, 7) === month && a.status !== 'CANCELLED')
})

const revenue = computed(() =>
  monthAppts.value.reduce((sum, a) => sum + Number(a.service?.price || 0), 0)
)

const stats = computed(() => [
  { label: 'Oggi', value: todayAppts.value.length, icon: '📅', sub: 'appuntamenti' },
  { label: 'Questa settimana', value: weekAppts.value.length, icon: '📆', sub: 'appuntamenti' },
  { label: 'Questo mese', value: monthAppts.value.length, icon: '🗓', sub: 'appuntamenti' },
  { label: 'Ricavo stimato', value: formatPrice(revenue.value), icon: '💰', sub: 'questo mese' },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="stat in stats" :key="stat.label" class="card p-5">
      <div class="text-2xl mb-2">{{ stat.icon }}</div>
      <div class="text-2xl font-bold text-secondary">{{ stat.value }}</div>
      <div class="text-xs text-gray-500 mt-1">{{ stat.sub }}</div>
      <div class="text-sm font-medium text-gray-700 mt-1">{{ stat.label }}</div>
    </div>
  </div>
</template>
