<script setup>
import { ref, computed } from 'vue'
import { toISODate } from '../../utils/formatters.js'

const emit = defineEmits(['select'])

const today = new Date()
today.setHours(0, 0, 0, 0)

const viewDate = ref(new Date(today))
const selectedDate = ref(null)

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

const monthLabel = computed(() => `${MONTHS[viewDate.value.getMonth()]} ${viewDate.value.getFullYear()}`)

const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Offset: lunedì = 0
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const days = []
  // Empty cells before
  for (let i = 0; i < startOffset; i++) days.push(null)
  // Days of month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    days.push(date)
  }
  return days
})

function isDisabled(date) {
  if (!date) return true
  if (date < today) return true
  if (date.getDay() === 0) return true // domenica chiusa
  return false
}

function isSelected(date) {
  return date && selectedDate.value && toISODate(date) === selectedDate.value
}

function isToday(date) {
  return date && toISODate(date) === toISODate(today)
}

function selectDay(date) {
  if (isDisabled(date)) return
  selectedDate.value = toISODate(date)
  emit('select', selectedDate.value)
}

function prevMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}
</script>

<template>
  <div class="card p-4 w-full max-w-sm mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <button @click="prevMonth" class="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Mese precedente">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <span class="font-semibold text-secondary capitalize">{{ monthLabel }}</span>
      <button @click="nextMonth" class="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Mese successivo">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>

    <!-- Day labels -->
    <div class="grid grid-cols-7 mb-2">
      <div v-for="day in DAYS" :key="day" class="text-center text-xs font-medium text-gray-400 py-1">{{ day }}</div>
    </div>

    <!-- Days grid -->
    <div class="grid grid-cols-7 gap-1">
      <div v-for="(date, i) in calendarDays" :key="i">
        <button
          v-if="date"
          :disabled="isDisabled(date)"
          @click="selectDay(date)"
          class="w-full aspect-square rounded-full text-sm font-medium transition-colors flex items-center justify-center"
          :class="[
            isSelected(date) ? 'bg-primary text-white' :
            isToday(date) ? 'border-2 border-primary text-primary' :
            isDisabled(date) ? 'text-gray-300 cursor-not-allowed' :
            'hover:bg-accent text-secondary'
          ]"
        >
          {{ date.getDate() }}
        </button>
        <div v-else />
      </div>
    </div>
  </div>
</template>
