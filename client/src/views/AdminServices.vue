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
  <div class="flex min-h-screen">
    <AppSidebar />

    <main class="flex-1 p-6 bg-background overflow-auto">
      <div class="mb-6">
        <h1 class="section-title">Gestione Servizi</h1>
        <p class="text-gray-500 text-sm mt-1">Aggiungi, modifica o disattiva i servizi del salone</p>
      </div>

      <div class="card p-6">
        <div v-if="loading" class="text-center text-gray-400">Caricamento...</div>
        <ServiceManager v-else :services="services" @updated="load" />
      </div>
    </main>
  </div>
</template>
