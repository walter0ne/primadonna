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
  { label: 'Oggi',             value: todayAppts.value.length,    icon: '📅', sub: 'appuntamenti', highlight: false },
  { label: 'Questa settimana', value: weekAppts.value.length,     icon: '📆', sub: 'appuntamenti', highlight: false },
  { label: 'Questo mese',      value: monthAppts.value.length,    icon: '🗓', sub: 'appuntamenti', highlight: false },
  { label: 'Ricavo stimato',   value: formatPrice(revenue.value), icon: '💰', sub: 'questo mese',  highlight: true  },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="card p-4 flex flex-col gap-1 transition-all hover:shadow-strong hover:-translate-y-0.5"
      :class="stat.highlight ? 'bg-gradient-to-br from-accent/40 to-beige border-accent-warm' : ''"
    >
      <span class="text-2xl">{{ stat.icon }}</span>
      <span
        class="text-2xl font-bold leading-none"
        :class="stat.highlight ? 'text-primary' : 'text-secondary'"
      >
        {{ stat.value }}
      </span>
      <span class="text-xs text-primary/40">{{ stat.sub }}</span>
      <span class="text-xs font-semibold text-secondary/60 mt-0.5">{{ stat.label }}</span>
    </div>
  </div>
</template>
