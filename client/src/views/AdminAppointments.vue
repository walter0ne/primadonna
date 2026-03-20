<script setup>
import { onMounted, ref, computed } from 'vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppointmentList from '../components/admin/AppointmentList.vue'
import CalendarView from '../components/admin/CalendarView.vue'
import { useApi } from '../composables/useApi.js'
import { toISODate } from '../utils/formatters.js'

const { get, loading } = useApi()
const appointments = ref([])
const viewMode = ref('list') // 'list' | 'calendar'

// Filters
const filterDate = ref('')
const filterStatus = ref('')

// Calendar week
const weekStart = ref(getMonday(new Date()))

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return toISODate(d)
}

async function load() {
  const params = {}
  if (filterDate.value) params.date = filterDate.value
  if (filterStatus.value) params.status = filterStatus.value
  appointments.value = await get('/appointments', params).catch(() => [])
}

onMounted(load)

const filteredAppointments = computed(() => appointments.value)

function prevWeek() {
  const d = new Date(weekStart.value + 'T00:00:00')
  d.setDate(d.getDate() - 7)
  weekStart.value = toISODate(d)
  filterDate.value = ''
  load()
}

function nextWeek() {
  const d = new Date(weekStart.value + 'T00:00:00')
  d.setDate(d.getDate() + 7)
  weekStart.value = toISODate(d)
  filterDate.value = ''
  load()
}
</script>

<template>
  <div class="flex min-h-screen">
    <AppSidebar />

    <main class="flex-1 p-6 bg-background overflow-auto">
      <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 class="section-title">Appuntamenti</h1>
        <div class="flex gap-2">
          <button @click="viewMode = 'list'" class="text-sm px-3 py-2 rounded-lg border transition-colors" :class="viewMode === 'list' ? 'bg-secondary text-white border-secondary' : 'border-gray-200 text-gray-600'">Lista</button>
          <button @click="viewMode = 'calendar'" class="text-sm px-3 py-2 rounded-lg border transition-colors" :class="viewMode === 'calendar' ? 'bg-secondary text-white border-secondary' : 'border-gray-200 text-gray-600'">Calendario</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card p-4 mb-6 flex flex-wrap gap-3">
        <input type="date" v-model="filterDate" @change="load" class="input-field w-auto text-sm" />
        <select v-model="filterStatus" @change="load" class="input-field w-auto text-sm">
          <option value="">Tutti gli stati</option>
          <option value="CONFIRMED">Confermato</option>
          <option value="COMPLETED">Completato</option>
          <option value="CANCELLED">Cancellato</option>
          <option value="NO_SHOW">Non presentato</option>
        </select>
        <button @click="filterDate = ''; filterStatus = ''; load()" class="btn-ghost text-sm">Reset filtri</button>
      </div>

      <!-- Calendar view -->
      <div v-if="viewMode === 'calendar'" class="card p-4 mb-6">
        <CalendarView
          :appointments="filteredAppointments"
          :week-start="weekStart"
          @prev="prevWeek"
          @next="nextWeek"
        />
      </div>

      <!-- List view -->
      <AppointmentList
        v-else
        :appointments="filteredAppointments"
        :loading="loading"
        @updated="load"
      />
    </main>
  </div>
</template>
