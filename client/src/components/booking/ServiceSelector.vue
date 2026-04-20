<script setup>
import { onMounted, ref, computed } from 'vue'
import { useApi } from '../../composables/useApi.js'
import { useBookingStore } from '../../stores/booking.js'
import { formatDuration } from '../../utils/formatters.js'

const { get, loading, error } = useApi()
const bookingStore = useBookingStore()
const services = ref([])

onMounted(async () => {
  services.value = await get('/services')
})

const categories = [
  { key: 'corti_medi', label: 'Capelli corti / media lunghezza' },
  { key: 'lunghi',     label: 'Capelli lunghi' },
]

const grouped = computed(() =>
  categories.map(cat => ({
    ...cat,
    items: services.value.filter(s => (s.category || 'corti_medi') === cat.key),
  })).filter(g => g.items.length > 0)
)
</script>

<template>
  <div>
    <p class="text-primary/50 text-sm mb-6">Seleziona il servizio che desideri prenotare</p>

    <!-- Loading shimmer -->
    <div v-if="loading" class="space-y-6">
      <div v-for="i in 2" :key="i" class="space-y-3">
        <div class="shimmer h-5 w-48 rounded-xl"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="j in 3" :key="j" class="shimmer h-28 animate-fade-in-up"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12 text-error text-sm">{{ error }}</div>

    <div v-else class="space-y-8">
      <div v-for="group in grouped" :key="group.key">
        <!-- Intestazione categoria -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-5 rounded-full bg-primary"></div>
          <h3 class="text-sm font-bold text-secondary uppercase tracking-wider">{{ group.label }}</h3>
        </div>

        <!-- Servizi della categoria -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger">
          <button
            v-for="service in group.items"
            :key="service.id"
            class="card p-4 text-left transition-all duration-200 hover:shadow-strong focus:outline-none focus:ring-2 focus:ring-primary/30 animate-fade-in-up"
            :class="bookingStore.selectedService?.id === service.id
              ? 'border-2 border-primary bg-accent/40 shadow-card -translate-y-0.5'
              : 'border border-accent-warm hover:-translate-y-0.5'"
            @click="bookingStore.selectService(service)"
          >
            <div class="flex items-start justify-between gap-3 mb-2">
              <h3 class="font-semibold text-secondary text-sm leading-snug">{{ service.name }}</h3>
              <div
                class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                :class="bookingStore.selectedService?.id === service.id
                  ? 'bg-primary text-beige-light scale-110'
                  : 'bg-accent border border-accent-warm text-transparent'"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <p v-if="service.description" class="text-primary/40 text-xs mb-3 leading-relaxed">{{ service.description }}</p>
            <span class="badge">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ formatDuration(service.duration) }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
