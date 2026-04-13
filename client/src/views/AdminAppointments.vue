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

const filterDate   = ref('')
const filterStatus = ref('')
const weekStart    = ref(getMonday(new Date()))

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return toISODate(d)
}

async function load() {
  const params = {}
  if (filterDate.value)   params.date   = filterDate.value
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
  <div class="flex min-h-screen min-h-dvh bg-background">
    <AppSidebar />

    <main class="flex-1 overflow-auto pt-14 pb-24 md:pt-0 md:pb-0 px-4 md:px-6 py-4 md:py-6">

      <!-- Header + toggle vista -->
      <div class="flex items-center justify-between mb-5 mt-2 md:mt-0 gap-3">
        <h1 class="section-title text-xl md:text-2xl">Appuntamenti</h1>

        <!-- Toggle lista/calendario — pill switcher -->
        <div class="flex bg-beige rounded-2xl p-1 border border-accent-warm">
          <button
            @click="viewMode = 'list'"
            class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
            :class="viewMode === 'list' ? 'bg-primary text-beige-light shadow-soft' : 'text-primary/50 hover:text-primary'"
          >
            Lista
          </button>
          <button
            @click="viewMode = 'calendar'"
            class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
            :class="viewMode === 'calendar' ? 'bg-primary text-beige-light shadow-soft' : 'text-primary/50 hover:text-primary'"
          >
            Calendario
          </button>
        </div>
      </div>

      <!-- Filtri — scrollabili orizzontalmente su mobile -->
      <div class="card p-3 mb-5 flex flex-wrap gap-2">
        <input
          type="date"
          v-model="filterDate"
          @change="load"
          class="input-field flex-1 min-w-[140px] text-sm"
          style="min-height:44px"
        />
        <select
          v-model="filterStatus"
          @change="load"
          class="input-field flex-1 min-w-[140px] text-sm"
          style="min-height:44px"
        >
          <option value="">Tutti gli stati</option>
          <option value="CONFIRMED">Confermato</option>
          <option value="COMPLETED">Completato</option>
          <option value="CANCELLED">Cancellato</option>
          <option value="NO_SHOW">Non presentato</option>
        </select>
        <button
          @click="filterDate = ''; filterStatus = ''; load()"
          class="btn-ghost text-xs px-3 whitespace-nowrap"
        >
          Reset
        </button>
      </div>

      <!-- Calendario -->
      <div v-if="viewMode === 'calendar'" class="card p-3 mb-5 overflow-x-auto">
        <CalendarView
          :appointments="filteredAppointments"
          :week-start="weekStart"
          @prev="prevWeek"
          @next="nextWeek"
        />
      </div>

      <!-- Lista -->
      <AppointmentList
        v-else
        :appointments="filteredAppointments"
        :loading="loading"
        @updated="load"
      />
    </main>
  </div>
</template>
