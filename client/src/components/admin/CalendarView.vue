<script setup>
import { computed } from 'vue'
import { formatDateShort, statusColor } from '../../utils/formatters.js'

const props = defineProps({
  appointments: { type: Array, default: () => [] },
  weekStart: { type: String, required: true }, // "YYYY-MM-DD"
})
defineEmits(['prev', 'next'])

const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

const weekDays = computed(() => {
  return DAYS_IT.map((label, i) => {
    const d = new Date(props.weekStart + 'T00:00:00')
    d.setDate(d.getDate() + i)
    return {
      label,
      date: d.toISOString().slice(0, 10),
      day: d.getDate(),
    }
  })
})

function appointmentsForDay(date) {
  return props.appointments
    .filter(a => a.date.slice(0, 10) === date && a.status !== 'CANCELLED')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <button @click="$emit('prev')" class="btn-ghost text-sm">← Sett. prec.</button>
      <span class="font-semibold text-secondary text-sm">
        {{ formatDateShort(weekDays[0]?.date) }} – {{ formatDateShort(weekDays[5]?.date) }}
      </span>
      <button @click="$emit('next')" class="btn-ghost text-sm">Sett. succ. →</button>
    </div>

    <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
      <div v-for="day in weekDays" :key="day.date" class="min-h-[120px]">
        <div class="text-center mb-2">
          <span class="text-xs text-gray-400">{{ day.label }}</span>
          <p class="font-bold text-secondary text-sm">{{ day.day }}</p>
        </div>
        <div class="space-y-1">
          <div
            v-for="appt in appointmentsForDay(day.date)"
            :key="appt.id"
            class="text-xs p-1.5 rounded bg-primary/10 text-secondary border-l-2 border-primary truncate"
          >
            <p class="font-medium">{{ appt.startTime }}</p>
            <p class="truncate">{{ appt.customerName }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
