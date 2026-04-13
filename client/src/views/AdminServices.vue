<script setup>
import { onMounted, ref } from 'vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import ServiceManager from '../components/admin/ServiceManager.vue'
import { useApi } from '../composables/useApi.js'

const { get, loading } = useApi()
const services = ref([])

async function load() {
  services.value = await get('/services/all').catch(() => [])
}

onMounted(load)
</script>

<template>
  <div class="flex min-h-screen min-h-dvh bg-background">
    <AppSidebar />

    <main class="flex-1 overflow-auto pt-14 pb-24 md:pt-0 md:pb-0 px-4 md:px-6 py-4 md:py-6">

      <div class="mb-5 mt-2 md:mt-0">
        <h1 class="section-title text-xl md:text-2xl">Gestione Servizi</h1>
        <p class="text-primary/50 text-sm mt-1">Aggiungi, modifica o disattiva i servizi del salone</p>
      </div>

      <div class="card p-4 md:p-6">
        <div v-if="loading" class="space-y-3 stagger">
          <div v-for="i in 4" :key="i" class="shimmer h-16 animate-fade-in-up"></div>
        </div>
        <ServiceManager v-else :services="services" @updated="load" />
      </div>

    </main>
  </div>
</template>
