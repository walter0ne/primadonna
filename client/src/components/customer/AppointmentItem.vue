<template>
  <div class="card p-5" :class="upcoming ? 'border-l-4 border-l-[#8B5A2B]' : 'opacity-80'">
    <div class="flex items-start justify-between gap-3 mb-3">
      <!-- Service name -->
      <div>
        <p class="font-semibold text-[#2D1A0E] text-sm leading-tight">{{ appointment.service?.name || '—' }}</p>
        <p class="text-xs text-[#9E7A5A] mt-0.5">{{ appointment.service?.duration }} min</p>
      </div>

      <!-- Status badge -->
      <span
        class="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
        :class="statusStyle"
      >
        {{ statusLabel }}
      </span>
    </div>

    <!-- Date & time -->
    <div class="flex items-center gap-4 text-xs text-[#6B4226]">
      <span class="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#A8703E]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
        </svg>
        {{ formattedDate }}
      </span>
      <span class="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#A8703E]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        {{ appointment.startTime }}
      </span>
    </div>

    <!-- Notes -->
    <p v-if="appointment.notes" class="text-xs text-[#9E7A5A] mt-2 italic line-clamp-2">
      "{{ appointment.notes }}"
    </p>

    <!-- Edit button -->
    <div v-if="canEdit" class="mt-3 pt-3 border-t border-[#E8D5B7]">
      <button
        @click="emit('edit', appointment)"
        class="flex items-center gap-1.5 text-xs font-semibold text-[#8B5A2B] hover:text-[#6B3F18] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
        </svg>
        Modifica prenotazione
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  appointment: { type: Object, required: true },
  upcoming:    { type: Boolean, default: false },
  canEdit:     { type: Boolean, default: false },
})
const emit = defineEmits(['edit'])

const formattedDate = computed(() => {
  const d = new Date(props.appointment.date)
  return d.toLocaleDateString('it-IT', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Europe/Rome',
  })
})

const statusLabel = computed(() => {
  const map = {
    CONFIRMED: 'Confermato',
    COMPLETED: 'Completato',
    CANCELLED: 'Cancellato',
    NO_SHOW:   'Non presentato',
  }
  return map[props.appointment.status] || props.appointment.status
})

const statusStyle = computed(() => {
  const map = {
    CONFIRMED: 'bg-emerald-100 text-emerald-700',
    COMPLETED: 'bg-[#F0E2CE] text-[#8B5A2B]',
    CANCELLED: 'bg-red-100 text-red-600',
    NO_SHOW:   'bg-gray-100 text-gray-500',
  }
  return map[props.appointment.status] || 'bg-gray-100 text-gray-500'
})
</script>
