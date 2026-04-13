<script setup>
import { ref, computed } from 'vue'
import { toISODate } from '../../utils/formatters.js'

const emit = defineEmits(['select'])

const today = new Date()
today.setHours(0, 0, 0, 0)

const viewDate    = ref(new Date(today))
const selectedDate = ref(null)

const DAYS   = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']

const monthLabel = computed(() => `${MONTHS[viewDate.value.getMonth()]} ${viewDate.value.getFullYear()}`)

const calendarDays = computed(() => {
  const year  = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)

  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
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
  <div class="card p-4 w-full">
    <!-- Header mese -->
    <div class="flex items-center justify-between mb-5">
      <button
        @click="prevMonth"
        class="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors active:scale-90 text-secondary/60 hover:text-primary"
        aria-label="Mese precedente"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <span class="font-semibold text-secondary text-sm capitalize">{{ monthLabel }}</span>

      <button
        @click="nextMonth"
        class="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors active:scale-90 text-secondary/60 hover:text-primary"
        aria-label="Mese successivo"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- Intestazioni giorni -->
    <div class="grid grid-cols-7 mb-2">
      <div
        v-for="day in DAYS"
        :key="day"
        class="text-center text-xs font-semibold text-primary/30 py-1"
      >
        {{ day }}
      </div>
    </div>

    <!-- Griglia giorni -->
    <div class="grid grid-cols-7 gap-1">
      <div v-for="(date, i) in calendarDays" :key="i">
        <button
          v-if="date"
          :disabled="isDisabled(date)"
          @click="selectDay(date)"
          class="w-full aspect-square rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-center active:scale-90"
          :class="[
            isSelected(date)
              ? 'bg-primary text-beige-light shadow-btn scale-105'
              : isToday(date)
                ? 'border-2 border-primary text-primary bg-accent/40'
                : isDisabled(date)
                  ? 'text-primary/20 cursor-not-allowed'
                  : 'hover:bg-accent text-secondary hover:text-primary'
          ]"
        >
          {{ date.getDate() }}
        </button>
        <div v-else />
      </div>
    </div>

    <!-- Legenda -->
    <div class="flex items-center gap-4 mt-4 pt-4 border-t border-accent/50 text-xs text-primary/40">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm bg-primary inline-block"></span> Selezionato
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-sm border-2 border-primary inline-block"></span> Oggi
      </span>
    </div>
  </div>
</template>
