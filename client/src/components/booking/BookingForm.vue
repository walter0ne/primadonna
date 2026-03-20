<script setup>
import { useBookingStore } from '../../stores/booking.js'

const bookingStore = useBookingStore()
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Nome e cognome *</label>
      <input
        v-model="bookingStore.customerData.name"
        type="text"
        class="input-field"
        placeholder="Mario Rossi"
        autocomplete="name"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
      <input
        v-model="bookingStore.customerData.phone"
        type="tel"
        class="input-field"
        placeholder="+39 333 1234567"
        autocomplete="tel"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
      <input
        v-model="bookingStore.customerData.email"
        type="email"
        class="input-field"
        placeholder="mario.rossi@email.it"
        autocomplete="email"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Note (opzionale)</label>
      <textarea
        v-model="bookingStore.customerData.notes"
        class="input-field resize-none"
        rows="3"
        placeholder="Eventuali richieste particolari..."
        maxlength="500"
      />
    </div>
  </div>
</template>
