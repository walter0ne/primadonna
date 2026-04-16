<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F5ECD8] via-[#FBF7F1] to-[#F0E2CE]">
    <!-- Top bar -->
    <header class="sticky top-0 z-30 glass border-b border-[#E8D5B7]/60 px-4 py-3">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5A2B] to-[#A8703E] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#FBF7F1]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-[#9E7A5A] leading-none">Benvenuta</p>
            <p class="text-sm font-semibold text-[#2D1A0E] leading-tight">{{ customerStore.customer?.name || 'Cliente' }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="flex items-center gap-1.5 text-sm text-[#9E7A5A] hover:text-red-500 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Esci
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-6 pb-10">
      <!-- Page title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-[#2D1A0E] font-serif">Le mie prenotazioni</h1>
        <p class="text-sm text-[#9E7A5A] mt-0.5">Storico e prenotazioni future</p>
      </div>

      <!-- New booking CTA -->
      <RouterLink to="/prenota" class="btn-primary w-full flex items-center justify-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Prenota un servizio
      </RouterLink>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="card p-5 animate-pulse">
          <div class="flex justify-between items-start mb-3">
            <div class="h-4 bg-[#E8D5B7] rounded w-1/3"></div>
            <div class="h-6 bg-[#E8D5B7] rounded-full w-20"></div>
          </div>
          <div class="h-3 bg-[#E8D5B7] rounded w-1/2 mb-2"></div>
          <div class="h-3 bg-[#E8D5B7] rounded w-1/4"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="card p-6 text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p class="text-sm text-[#6B4226] mb-3">{{ error }}</p>
        <button @click="loadAppointments" class="btn-secondary text-sm px-5 py-2">Riprova</button>
      </div>

      <!-- Empty -->
      <div v-else-if="appointments.length === 0" class="card p-8 text-center">
        <div class="w-16 h-16 rounded-2xl bg-[#F0E2CE] flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#A8703E]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
          </svg>
        </div>
        <p class="font-semibold text-[#2D1A0E] mb-1">Nessuna prenotazione</p>
        <p class="text-sm text-[#9E7A5A] mb-5">Non hai ancora prenotato nessun servizio.<br>Inizia ora!</p>
        <RouterLink to="/prenota" class="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5">
          Prenota ora
        </RouterLink>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <!-- Upcoming -->
        <div v-if="upcomingAppointments.length > 0">
          <h2 class="text-xs font-bold text-[#8B5A2B] uppercase tracking-widest mb-3 px-1">
            Prossimi appuntamenti
          </h2>
          <div class="space-y-3 mb-6">
            <AppointmentItem
              v-for="apt in upcomingAppointments"
              :key="apt.id"
              :appointment="apt"
              :can-edit="canEdit(apt)"
              upcoming
              @edit="openEdit(apt)"
            />
          </div>
        </div>

        <!-- Past -->
        <div v-if="pastAppointments.length > 0">
          <h2 class="text-xs font-bold text-[#9E7A5A] uppercase tracking-widest mb-3 px-1">
            Storico
          </h2>
          <div class="space-y-3">
            <AppointmentItem
              v-for="apt in pastAppointments"
              :key="apt.id"
              :appointment="apt"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Edit modal -->
    <EditAppointmentModal
      :show="!!editingAppointment"
      :appointment="editingAppointment"
      @close="editingAppointment = null"
      @saved="onAppointmentSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import AppointmentItem from '@/components/customer/AppointmentItem.vue'
import EditAppointmentModal from '@/components/customer/EditAppointmentModal.vue'

const router = useRouter()
const customerStore = useCustomerStore()

const appointments      = ref([])
const loading           = ref(true)
const error             = ref('')
const editingAppointment = ref(null)

const today = new Date().toISOString().split('T')[0]

const upcomingAppointments = computed(() =>
  appointments.value.filter(a => {
    const d = new Date(a.date).toISOString().split('T')[0]
    return d >= today
  }).sort((a, b) => a.date > b.date ? 1 : -1)
)
const pastAppointments = computed(() =>
  appointments.value.filter(a => {
    const d = new Date(a.date).toISOString().split('T')[0]
    return d < today
  })
)

// Modificabile solo se confermato e data > oggi (almeno domani)
function canEdit(apt) {
  if (apt.status !== 'CONFIRMED') return false
  const d = new Date(apt.date).toISOString().split('T')[0]
  return d > today
}

function openEdit(apt) {
  editingAppointment.value = apt
}

function onAppointmentSaved(updated) {
  const idx = appointments.value.findIndex(a => a.id === updated.id)
  if (idx !== -1) appointments.value[idx] = updated
}

async function loadAppointments() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/customer/appointments', {
      headers: { Authorization: `Bearer ${customerStore.token}` },
    })
    if (res.status === 401) {
      customerStore.forceLogout()
      router.push('/area-cliente/login?session=expired')
      return
    }
    if (!res.ok) throw new Error()
    appointments.value = await res.json()
  } catch {
    error.value = 'Impossibile caricare le prenotazioni. Riprova.'
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  customerStore.logout()
  router.push('/')
}

onMounted(loadAppointments)
</script>
