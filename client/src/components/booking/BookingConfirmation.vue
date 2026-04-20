<script setup>
import { useBookingStore } from '../../stores/booking.js'
import { formatDate, formatPrice, formatDuration } from '../../utils/formatters.js'

const bookingStore = useBookingStore()
</script>

<template>
  <div class="card p-5 bg-gradient-to-br from-accent/40 to-beige border border-accent-warm">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <h3 class="font-semibold text-secondary text-sm uppercase tracking-wider">Riepilogo prenotazione</h3>
    </div>

    <!-- Dettagli -->
    <div class="space-y-3">
      <div class="flex items-center justify-between py-2 border-b border-accent/60">
        <span class="text-xs text-primary/50 font-medium">Servizio</span>
        <span class="font-semibold text-secondary text-sm">{{ bookingStore.selectedService?.name }}</span>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-accent/60">
        <span class="text-xs text-primary/50 font-medium">Data</span>
        <span class="font-semibold text-secondary text-sm capitalize">{{ formatDate(bookingStore.selectedDate) }}</span>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-accent/60">
        <span class="text-xs text-primary/50 font-medium">Orario</span>
        <span class="font-semibold text-secondary text-sm">{{ bookingStore.selectedTime }}</span>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-accent/60">
        <span class="text-xs text-primary/50 font-medium">Durata</span>
        <span class="badge">{{ formatDuration(bookingStore.selectedService?.duration) }}</span>
      </div>
    </div>
  </div>
</template>
