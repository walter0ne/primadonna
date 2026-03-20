<script setup>
import { onMounted, ref } from 'vue'
import { useApi } from '../../composables/useApi.js'
import { useBookingStore } from '../../stores/booking.js'
import { formatPrice, formatDuration } from '../../utils/formatters.js'

const { get, loading, error } = useApi()
const bookingStore = useBookingStore()
const services = ref([])

onMounted(async () => {
  services.value = await get('/services')
})
</script>

<template>
  <div>
    <h2 class="section-title mb-2">Scegli il servizio</h2>
    <p class="text-gray-500 mb-6 text-sm">Seleziona il servizio che desideri prenotare</p>

    <div v-if="loading" class="text-center py-12 text-gray-400">Caricamento...</div>
    <div v-else-if="error" class="text-center py-12 text-red-500">{{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        v-for="service in services"
        :key="service.id"
        class="card p-5 text-left transition-all hover:shadow-md hover:border-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
        :class="bookingStore.selectedService?.id === service.id ? 'border-2 border-primary bg-accent/30' : 'border border-gray-100'"
        @click="bookingStore.selectService(service)"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-secondary text-base">{{ service.name }}</h3>
          <span class="text-primary font-bold text-sm">{{ formatPrice(service.price) }}</span>
        </div>
        <p v-if="service.description" class="text-gray-500 text-sm mb-3">{{ service.description }}</p>
        <span class="inline-block text-xs bg-accent text-secondary px-2 py-1 rounded-full">
          ⏱ {{ formatDuration(service.duration) }}
        </span>
      </button>
    </div>
  </div>
</template>
