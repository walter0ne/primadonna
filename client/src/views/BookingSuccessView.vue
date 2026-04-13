<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import { useBookingStore } from '../stores/booking.js'
import { formatDate, formatPrice } from '../utils/formatters.js'

const bookingStore = useBookingStore()

const service = bookingStore.selectedService
const date    = bookingStore.selectedDate
const time    = bookingStore.selectedTime

onMounted(() => {
  bookingStore.reset()
})
</script>

<template>
  <div class="flex flex-col min-h-screen min-h-dvh bg-background">
    <AppHeader />

    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="max-w-sm w-full text-center">

        <!-- Icona successo animata -->
        <div class="relative mx-auto mb-8 w-28 h-28 animate-scale-in">
          <!-- Ring esterno pulsante -->
          <div class="absolute inset-0 rounded-full bg-success/10 animate-ping" style="animation-duration: 2s;"></div>
          <!-- Cerchio principale -->
          <div class="relative w-28 h-28 rounded-full bg-gradient-to-br from-success/20 to-success/10 border-2 border-success/30 flex items-center justify-center">
            <svg class="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>

        <!-- Titolo -->
        <h1 class="font-serif text-3xl text-secondary font-bold mb-2 animate-fade-in-up">
          Tutto confermato!
        </h1>
        <p class="text-primary/50 text-sm mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
          Riceverai una email di conferma con tutti i dettagli del tuo appuntamento.
        </p>

        <!-- Card dettagli -->
        <div
          v-if="service && date"
          class="card p-5 text-left mb-8 bg-gradient-to-br from-accent/30 to-beige animate-fade-in-up"
          style="animation-delay: 0.2s"
        >
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-sm">📅</div>
            <h3 class="font-semibold text-secondary text-sm">Il tuo appuntamento</h3>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-primary/50 font-medium">Servizio</span>
              <span class="font-semibold text-secondary text-sm">{{ service?.name }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-primary/50 font-medium">Data</span>
              <span class="font-semibold text-secondary text-sm capitalize">{{ formatDate(date) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-primary/50 font-medium">Orario</span>
              <span class="font-semibold text-secondary text-sm">{{ time }}</span>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-accent/60">
              <span class="font-semibold text-secondary text-sm">Totale</span>
              <span class="font-bold text-primary text-lg">{{ formatPrice(service?.price) }}</span>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex flex-col gap-3 animate-fade-in-up" style="animation-delay: 0.3s">
          <RouterLink to="/" class="btn-secondary w-full justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Torna alla Home
          </RouterLink>
          <RouterLink to="/prenota" class="btn-ghost w-full justify-center text-sm">
            Prenota un altro appuntamento
          </RouterLink>
        </div>

      </div>
    </main>

    <AppFooter />
  </div>
</template>
