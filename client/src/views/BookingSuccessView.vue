<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import { useBookingStore } from '../stores/booking.js'
import { formatDate, formatPrice } from '../utils/formatters.js'

const bookingStore = useBookingStore()

const service = bookingStore.selectedService
const date = bookingStore.selectedDate
const time = bookingStore.selectedTime

onMounted(() => {
  bookingStore.reset()
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <main class="flex-1 flex items-center justify-center px-4 py-16">
      <div class="max-w-md w-full text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <h1 class="font-serif text-3xl text-secondary font-bold mb-3">Prenotazione Confermata!</h1>
        <p class="text-gray-500 mb-8">Riceverai una email di conferma con tutti i dettagli.</p>

        <div v-if="service && date" class="card p-5 text-left mb-8">
          <h3 class="font-semibold text-sm uppercase tracking-wide text-gray-400 mb-3">Il tuo appuntamento</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Servizio</span>
              <span class="font-medium">{{ service?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Data</span>
              <span class="font-medium capitalize">{{ formatDate(date) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Orario</span>
              <span class="font-medium">{{ time }}</span>
            </div>
            <div class="flex justify-between border-t pt-2">
              <span class="font-semibold">Totale</span>
              <span class="font-bold text-primary">{{ formatPrice(service?.price) }}</span>
            </div>
          </div>
        </div>

        <RouterLink to="/" class="btn-secondary inline-block">Torna alla Home</RouterLink>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
