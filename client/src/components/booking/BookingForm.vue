<script setup>
import { useBookingStore } from '../../stores/booking.js'

const bookingStore = useBookingStore()
</script>

<template>
  <div class="space-y-4">

    <!-- Nome -->
    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">
        Nome e cognome <span class="text-primary">*</span>
      </label>
      <div class="relative">
        <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <input
          v-model="bookingStore.customerData.name"
          type="text"
          class="input-field pl-10"
          placeholder="Mario Rossi"
          autocomplete="name"
        />
      </div>
    </div>

    <!-- Telefono -->
    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">
        Telefono <span class="text-primary">*</span>
      </label>
      <div class="relative">
        <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
        </div>
        <input
          v-model="bookingStore.customerData.phone"
          type="tel"
          class="input-field pl-10"
          placeholder="+39 333 1234567"
          autocomplete="tel"
        />
      </div>
    </div>

    <!-- Email -->
    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">
        Email <span class="text-primary">*</span>
      </label>
      <div class="relative">
        <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <input
          v-model="bookingStore.customerData.email"
          type="email"
          class="input-field pl-10"
          placeholder="mario.rossi@email.it"
          autocomplete="email"
        />
      </div>
    </div>

    <!-- Note -->
    <div class="space-y-1.5">
      <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">
        Note <span class="text-primary/30">(opzionale)</span>
      </label>
      <textarea
        v-model="bookingStore.customerData.notes"
        class="input-field resize-none"
        rows="3"
        placeholder="Eventuali richieste particolari..."
        maxlength="500"
        style="min-height: auto"
      />
    </div>

  </div>
</template>
