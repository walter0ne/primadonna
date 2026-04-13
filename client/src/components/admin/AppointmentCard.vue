<script setup>
import { useApi } from '../../composables/useApi.js'
import { statusLabel, statusColor } from '../../utils/formatters.js'

const props = defineProps({
  appointment: Object,
})
const emit = defineEmits(['updated'])

const { put, del } = useApi()

async function updateStatus(status) {
  await put(`/appointments/${props.appointment.id}/status`, { status })
  emit('updated')
}

async function cancel() {
  if (!confirm('Cancellare questo appuntamento?')) return
  await del(`/appointments/${props.appointment.id}`)
  emit('updated')
}
</script>

<template>
  <div class="card p-4 flex flex-col gap-3 animate-fade-in-up">

    <!-- Riga superiore: nome + orario -->
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="font-semibold text-secondary text-sm truncate">{{ appointment.customerName }}</p>
        <p class="text-xs text-primary/50 mt-0.5">{{ appointment.service?.name }}</p>
      </div>
      <div class="text-right shrink-0">
        <p class="font-bold text-primary text-base">{{ appointment.startTime }}</p>
        <span
          class="text-xs px-2 py-0.5 rounded-full font-semibold inline-block mt-0.5"
          :class="statusColor(appointment.status)"
        >
          {{ statusLabel(appointment.status) }}
        </span>
      </div>
    </div>

    <!-- Contatti -->
    <div class="flex flex-col gap-1 text-xs text-primary/50">
      <a :href="`tel:${appointment.customerPhone}`" class="flex items-center gap-1.5 hover:text-primary transition-colors">
        <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
        {{ appointment.customerPhone }}
      </a>
      <a :href="`mailto:${appointment.customerEmail}`" class="flex items-center gap-1.5 hover:text-primary transition-colors truncate">
        <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <span class="truncate">{{ appointment.customerEmail }}</span>
      </a>
      <p v-if="appointment.notes" class="flex items-start gap-1.5 mt-0.5">
        <svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
        </svg>
        <span class="italic">{{ appointment.notes }}</span>
      </p>
    </div>

    <!-- Azioni — solo se CONFIRMED -->
    <div v-if="appointment.status === 'CONFIRMED'" class="flex flex-wrap gap-2 pt-1 border-t border-accent/50">
      <button
        @click="updateStatus('COMPLETED')"
        class="flex-1 text-xs font-semibold bg-success/10 text-success px-3 py-2 rounded-xl hover:bg-success/20 transition-colors min-h-[40px]"
      >
        ✓ Completato
      </button>
      <button
        @click="updateStatus('NO_SHOW')"
        class="flex-1 text-xs font-semibold bg-beige text-primary/60 px-3 py-2 rounded-xl hover:bg-accent transition-colors min-h-[40px] border border-accent-warm"
      >
        Non venuto
      </button>
      <button
        @click="cancel"
        class="flex-1 text-xs font-semibold bg-error/10 text-error px-3 py-2 rounded-xl hover:bg-error/20 transition-colors min-h-[40px]"
      >
        Cancella
      </button>
    </div>
  </div>
</template>
