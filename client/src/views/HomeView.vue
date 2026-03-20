<script setup>
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useApi } from '../composables/useApi.js'
import { formatPrice, formatDuration } from '../utils/formatters.js'

const { get } = useApi()
const services = ref([])

onMounted(async () => {
  services.value = await get('/services').catch(() => [])
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <!-- Hero -->
    <section class="bg-secondary text-white py-20 px-4 text-center">
      <h1 class="font-serif text-4xl md:text-6xl text-primary font-bold mb-4 tracking-wide">PRIMADONNA</h1>
      <p class="text-accent text-lg md:text-xl mb-2 font-light">Il tuo salone di bellezza</p>
      <p class="text-gray-400 mb-8 max-w-md mx-auto text-sm">Prenota il tuo appuntamento online in pochi click. Nessuna attesa al telefono.</p>
      <RouterLink to="/prenota" class="btn-primary text-base px-8 py-4 inline-block">
        Prenota il tuo appuntamento
      </RouterLink>
    </section>

    <!-- Servizi -->
    <section class="py-16 px-4 max-w-6xl mx-auto w-full">
      <h2 class="section-title text-center mb-2">I nostri servizi</h2>
      <p class="text-center text-gray-500 mb-10 text-sm">Scegli tra i nostri servizi professionali</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="service in services" :key="service.id" class="card p-5">
          <h3 class="font-semibold text-secondary mb-1">{{ service.name }}</h3>
          <p v-if="service.description" class="text-gray-500 text-sm mb-3">{{ service.description }}</p>
          <div class="flex items-center justify-between mt-auto">
            <span class="text-xs text-gray-400">⏱ {{ formatDuration(service.duration) }}</span>
            <span class="font-bold text-primary">{{ formatPrice(service.price) }}</span>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <RouterLink to="/prenota" class="btn-primary inline-block">Prenota Ora</RouterLink>
      </div>
    </section>

    <!-- Perché sceglierci -->
    <section class="bg-secondary py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="font-serif text-primary text-3xl font-bold mb-10 tracking-wide">Perché sceglierci</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-accent">
            <div class="text-4xl mb-3">✂️</div>
            <h3 class="font-semibold text-primary mb-2">Professionalità</h3>
            <p class="text-sm opacity-70">Stilisti esperti e appassionati al tuo servizio</p>
          </div>
          <div class="text-accent">
            <div class="text-4xl mb-3">📱</div>
            <h3 class="font-semibold text-primary mb-2">Prenotazione Online</h3>
            <p class="text-sm opacity-70">Prenota 24/7 dal tuo smartphone, senza telefonate</p>
          </div>
          <div class="text-accent">
            <div class="text-4xl mb-3">⭐</div>
            <h3 class="font-semibold text-primary mb-2">Qualità Garantita</h3>
            <p class="text-sm opacity-70">Prodotti di alta qualità per risultati eccellenti</p>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>
