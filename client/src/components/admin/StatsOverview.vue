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

// SVG icons come stringhe (iniettate con v-html)
const icons = {
  today: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008z"/></svg>`,
  week: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"/></svg>`,
  month: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>`,
  revenue: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
}

const stats = computed(() => [
  { label: 'Oggi',             value: todayAppts.value.length,    icon: icons.today,   sub: 'appuntamenti', highlight: false },
  { label: 'Questa settimana', value: weekAppts.value.length,     icon: icons.week,    sub: 'appuntamenti', highlight: false },
  { label: 'Questo mese',      value: monthAppts.value.length,    icon: icons.month,   sub: 'appuntamenti', highlight: false },
  { label: 'Ricavo stimato',   value: formatPrice(revenue.value), icon: icons.revenue, sub: 'questo mese',  highlight: true  },
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="card p-4 flex flex-col gap-1.5 transition-all hover:shadow-strong hover:-translate-y-0.5"
      :class="stat.highlight ? 'bg-gradient-to-br from-accent/40 to-beige border-accent-warm' : ''"
    >
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center mb-0.5"
        :class="stat.highlight ? 'bg-primary/15 text-primary' : 'bg-beige text-primary/60'"
        v-html="stat.icon"
      ></div>
      <span
        class="text-2xl font-bold leading-none"
        :class="stat.highlight ? 'text-primary' : 'text-secondary'"
      >
        {{ stat.value }}
      </span>
      <span class="text-xs text-primary/40">{{ stat.sub }}</span>
      <span class="text-xs font-semibold text-secondary/60">{{ stat.label }}</span>
    </div>
  </div>
</template>
