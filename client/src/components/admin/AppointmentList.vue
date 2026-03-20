<script setup>
import AppointmentCard from './AppointmentCard.vue'
import { statusLabel, statusColor } from '../../utils/formatters.js'

defineProps({
  appointments: { type: Array, default: () => [] },
  loading: Boolean,
})
defineEmits(['updated'])
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-10 text-gray-400">Caricamento...</div>
    <div v-else-if="!appointments.length" class="text-center py-10 text-gray-400">
      Nessun appuntamento trovato.
    </div>
    <div v-else class="space-y-3">
      <AppointmentCard
        v-for="appt in appointments"
        :key="appt.id"
        :appointment="appt"
        @updated="$emit('updated')"
      />
    </div>
  </div>
</template>
