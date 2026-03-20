<script setup>
import { onMounted, ref, computed } from 'vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import StatsOverview from '../components/admin/StatsOverview.vue'
import AppointmentCard from '../components/admin/AppointmentCard.vue'
import { useApi } from '../composables/useApi.js'
import { useAuthStore } from '../stores/auth.js'
import { formatDate } from '../utils/formatters.js'

const { get, loading } = useApi()
const authStore = useAuthStore()
const appointments = ref([])
const todayStr = new Date().toISOString().slice(0, 10)

async function load() {
  appointments.value = await get('/appointments').catch(() => [])
}

onMounted(load)

const todayAppointments = computed(() =>
  appointments.value
    .filter(a => a.date.slice(0, 10) === todayStr && a.status !== 'CANCELLED')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
)
</script>

<template>
  <div class="flex min-h-screen">
    <AppSidebar />

    <main class="flex-1 p-6 bg-background overflow-auto">
      <div class="mb-6">
        <h1 class="section-title">Dashboard</h1>
        <p class="text-gray-500 text-sm mt-1">Benvenuto, {{ authStore.admin?.name }}</p>
      </div>

      <StatsOverview :appointments="appointments" class="mb-8" />

      <div>
        <h2 class="font-semibold text-secondary mb-4">
          Appuntamenti di oggi — <span class="text-primary capitalize">{{ formatDate(todayStr) }}</span>
        </h2>

        <div v-if="loading" class="text-gray-400 text-sm">Caricamento...</div>
        <div v-else-if="!todayAppointments.length" class="card p-8 text-center text-gray-400">
          Nessun appuntamento oggi.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AppointmentCard
            v-for="appt in todayAppointments"
            :key="appt.id"
            :appointment="appt"
            @updated="load"
          />
        </div>
      </div>
    </main>
  </div>
</template>
