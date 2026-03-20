<script setup>
import { useBookingStore } from '../../stores/booking.js'
import { formatDate, formatPrice, formatDuration } from '../../utils/formatters.js'

const bookingStore = useBookingStore()
</script>

<template>
  <div class="card p-5 bg-accent/20 border border-accent">
    <h3 class="font-semibold text-secondary mb-4 text-sm uppercase tracking-wide">Riepilogo prenotazione</h3>
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-500">Servizio</span>
        <span class="font-medium">{{ bookingStore.selectedService?.name }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Data</span>
        <span class="font-medium capitalize">{{ formatDate(bookingStore.selectedDate) }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Orario</span>
        <span class="font-medium">{{ bookingStore.selectedTime }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Durata</span>
        <span class="font-medium">{{ formatDuration(bookingStore.selectedService?.duration) }}</span>
      </div>
      <div class="border-t border-accent pt-2 flex justify-between">
        <span class="font-semibold text-secondary">Totale</span>
        <span class="font-bold text-primary text-base">{{ formatPrice(bookingStore.selectedService?.price) }}</span>
      </div>
    </div>
  </div>
</template>
