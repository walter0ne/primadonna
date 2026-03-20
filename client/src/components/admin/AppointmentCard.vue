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
  <div class="card p-4 flex flex-col gap-3">
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="font-semibold text-secondary">{{ appointment.customerName }}</p>
        <p class="text-sm text-gray-500">{{ appointment.service?.name }}</p>
      </div>
      <div class="text-right">
        <p class="font-bold text-primary text-sm">{{ appointment.startTime }}</p>
        <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="statusColor(appointment.status)">
          {{ statusLabel(appointment.status) }}
        </span>
      </div>
    </div>

    <div class="text-xs text-gray-400 space-y-0.5">
      <p>📞 {{ appointment.customerPhone }}</p>
      <p>✉️ {{ appointment.customerEmail }}</p>
      <p v-if="appointment.notes">💬 {{ appointment.notes }}</p>
    </div>

    <div v-if="appointment.status === 'CONFIRMED'" class="flex gap-2 flex-wrap">
      <button @click="updateStatus('COMPLETED')" class="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors min-h-[32px]">
        ✓ Completato
      </button>
      <button @click="updateStatus('NO_SHOW')" class="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors min-h-[32px]">
        Non presentato
      </button>
      <button @click="cancel" class="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors min-h-[32px]">
        Cancella
      </button>
    </div>
  </div>
</template>
