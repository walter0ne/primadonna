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
  <!-- flex row su desktop, colonna su mobile -->
  <div class="flex min-h-screen min-h-dvh bg-background">
    <AppSidebar />

    <!-- Su mobile: padding-top per top bar, padding-bottom per bottom nav -->
    <main class="flex-1 overflow-auto pt-14 pb-24 md:pt-0 md:pb-0 px-4 md:px-6 py-4 md:py-6">

      <!-- Header pagina -->
      <div class="mb-6 mt-2 md:mt-0">
        <h1 class="section-title text-xl md:text-2xl">Dashboard</h1>
        <p class="text-primary/50 text-sm mt-1">
          Bentornata, <span class="font-semibold text-primary">{{ authStore.admin?.name }}</span>
        </p>
      </div>

      <StatsOverview :appointments="appointments" class="mb-8" />

      <!-- Appuntamenti di oggi -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-secondary text-sm">
            Appuntamenti di oggi
          </h2>
          <span class="badge capitalize">{{ formatDate(todayStr) }}</span>
        </div>

        <!-- Loading shimmer -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 stagger">
          <div v-for="i in 3" :key="i" class="shimmer h-32 animate-fade-in-up"></div>
        </div>

        <div v-else-if="!todayAppointments.length" class="card p-8 text-center">
          <div class="w-14 h-14 rounded-2xl bg-accent mx-auto mb-3 flex items-center justify-center">
            <svg class="w-7 h-7 text-primary/40" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
            </svg>
          </div>
          <p class="font-medium text-secondary">Nessun appuntamento oggi</p>
          <p class="text-xs text-primary/40 mt-1">Goditi la giornata!</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
