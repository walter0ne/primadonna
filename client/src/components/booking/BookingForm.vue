<script setup>
import { useBookingStore } from '../../stores/booking.js'
import { useCustomerStore } from '../../stores/customer.js'

const bookingStore  = useBookingStore()
const customerStore = useCustomerStore()
</script>

<template>
  <div class="space-y-4">

    <!-- Cliente loggato: mostra riepilogo dati, non i campi -->
    <div v-if="customerStore.isAuthenticated" class="card p-4 bg-[#F0E2CE]/50 border border-[#D4B896]">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5A2B] to-[#A8703E] flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <div>
          <p class="text-xs text-[#9E7A5A] font-medium">Stai prenotando come</p>
          <p class="font-semibold text-[#2D1A0E] text-sm">{{ customerStore.customer?.name }}</p>
        </div>
      </div>
      <div class="space-y-1.5 text-sm text-[#6B4226]">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#A8703E] shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          <span>{{ customerStore.customer?.email }}</span>
        </div>
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#A8703E] shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
          <span>{{ customerStore.customer?.phone }}</span>
        </div>
      </div>
    </div>

    <!-- Guest: campi normali -->
    <template v-else>
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
    </template>

    <!-- Note (sempre visibili) -->
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
