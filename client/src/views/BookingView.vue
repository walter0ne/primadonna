<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ServiceSelector from '../components/booking/ServiceSelector.vue'
import DatePicker from '../components/booking/DatePicker.vue'
import TimeSlotGrid from '../components/booking/TimeSlotGrid.vue'
import BookingForm from '../components/booking/BookingForm.vue'
import BookingConfirmation from '../components/booking/BookingConfirmation.vue'
import { useBookingStore } from '../stores/booking.js'
import { useCustomerStore } from '../stores/customer.js'
import { useApi } from '../composables/useApi.js'
import { useToast } from '../composables/useToast.js'
import { formatDate, formatDuration } from '../utils/formatters.js'

const bookingStore  = useBookingStore()
const customerStore = useCustomerStore()
const { post, loading } = useApi()
const { success, error: showError } = useToast()
const router = useRouter()

// Pre-popola i dati del cliente se è loggato
onMounted(() => {
  if (customerStore.isAuthenticated && customerStore.customer) {
    const c = customerStore.customer
    bookingStore.customerData.name  = c.name  || ''
    bookingStore.customerData.email = c.email || ''
    bookingStore.customerData.phone = c.phone || ''
  }
})

const steps = [
  { num: 1, label: 'Capello'  },
  { num: 2, label: 'Servizio' },
  { num: 3, label: 'Quando'   },
  { num: 4, label: 'Conferma' },
]

const stepIcons = [
  // Step 1 – ciocca di capelli (scissor-like)
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM7.5 15a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12 12l7.5-7.5M12 12l7.5 7.5M12 12 4.5 4.5"/></svg>`,
  // Step 2 – sparkle
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>`,
  // Step 3 – calendario
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>`,
  // Step 4 – clipboard check
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"/></svg>`,
]

const CATEGORIES = [
  {
    key:         'corti_medi',
    label:       'Corti / media lunghezza',
    description: 'Capelli fino alle spalle',
    icon:        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
  },
  {
    key:         'lunghi',
    label:       'Capelli lunghi',
    description: 'Capelli oltre le spalle',
    icon:        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
  },
]

const canProceedStep3 = computed(() => bookingStore.selectedDate && bookingStore.selectedTime)
const canProceedStep4 = computed(() => {
  const { name, phone, email } = bookingStore.customerData
  if (!name.trim() || !email.trim() || !/\S+@\S+\.\S+/.test(email)) return false
  if (!phone.trim()) return false
  return true
})

const servicesLabel = computed(() => {
  const svcs = bookingStore.selectedServices
  if (svcs.length === 0) return ''
  if (svcs.length === 1) return svcs[0].name
  return `${svcs.length} servizi · circa ${formatDuration(bookingStore.totalDuration)}`
})

function onDateSelect(date) {
  bookingStore.selectedDate = date
  bookingStore.selectedTime = null
}

async function submitBooking() {
  try {
    const payload = {
      customerName:  bookingStore.customerData.name,
      customerPhone: bookingStore.customerData.phone,
      customerEmail: bookingStore.customerData.email,
      notes:         bookingStore.customerData.notes,
      serviceIds:    bookingStore.selectedServices.map(s => s.id),
      date:          bookingStore.selectedDate,
      startTime:     bookingStore.selectedTime,
    }

    // Se il cliente è autenticato, usa il suo token per collegare la prenotazione all'account
    if (customerStore.isAuthenticated && customerStore.token) {
      const res = await fetch('/api/appointments', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${customerStore.token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Errore durante la prenotazione')
    } else {
      await post('/appointments', payload)
    }

    success('Prenotazione confermata!')
    router.push('/prenotazione-confermata')
  } catch (err) {
    showError(err.message || 'Errore durante la prenotazione')
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen min-h-dvh bg-background">
    <AppHeader />

    <main class="flex-1 w-full max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">

      <!-- Titolo pagina -->
      <div class="text-center mb-8">
        <h1 class="section-title">Prenota il tuo appuntamento</h1>
        <div class="divider mt-3"></div>
      </div>

      <!-- ── STEP INDICATOR ─────────────────────────────── -->
      <div class="flex items-center mb-10 px-2">
        <template v-for="(step, i) in steps" :key="step.num">

          <!-- Step circle -->
          <div class="flex flex-col items-center gap-1 relative">
            <div
              class="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-soft"
              :class="bookingStore.currentStep > step.num
                ? 'bg-primary text-beige-light scale-90'
                : bookingStore.currentStep === step.num
                  ? 'bg-primary text-beige-light shadow-btn scale-105 ring-4 ring-primary/20'
                  : 'bg-beige text-primary/40 border-2 border-accent-warm'"
            >
              <!-- Completato: checkmark -->
              <svg v-if="bookingStore.currentStep > step.num" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
              <!-- Attivo / futuro: icona SVG -->
              <span v-else class="w-5 h-5" v-html="stepIcons[step.num - 1]"></span>
            </div>
            <span
              class="text-xs font-semibold whitespace-nowrap transition-colors"
              :class="bookingStore.currentStep >= step.num ? 'text-primary' : 'text-primary/30'"
            >
              {{ step.label }}
            </span>
          </div>

          <!-- Connettore -->
          <div
            v-if="i < steps.length - 1"
            class="flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500"
            :class="bookingStore.currentStep > step.num ? 'bg-primary' : 'bg-accent-warm'"
          />
        </template>
      </div>

      <!-- ── STEP INDICATOR ─────────────────────────────── -->

      <!-- ── STEP 1: Categoria capello ────────────────────── -->
      <Transition name="slide-fade" mode="out-in">
        <div v-if="bookingStore.currentStep === 1" key="step1" class="animate-fade-in-up">
          <p class="text-primary/50 text-sm mb-6">Come sono i tuoi capelli?</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              v-for="cat in CATEGORIES"
              :key="cat.key"
              type="button"
              @click="bookingStore.selectCategory(cat.key)"
              class="card p-6 text-left flex flex-col items-center gap-4 transition-all duration-200 hover:shadow-strong hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
              :class="bookingStore.selectedCategory === cat.key
                ? 'border-2 border-primary bg-accent/40 shadow-card'
                : 'border border-accent-warm'"
            >
              <!-- Illustrazione -->
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors"
                :class="bookingStore.selectedCategory === cat.key ? 'bg-primary/15 text-primary' : 'bg-accent text-primary/50'"
              >
                <span v-html="cat.icon" class="w-8 h-8"></span>
              </div>
              <div class="text-center">
                <p class="font-bold text-secondary text-base">{{ cat.label }}</p>
                <p class="text-xs text-primary/50 mt-1">{{ cat.description }}</p>
              </div>
              <!-- Check -->
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                :class="bookingStore.selectedCategory === cat.key
                  ? 'border-primary bg-primary'
                  : 'border-accent-warm bg-transparent'"
              >
                <svg v-if="bookingStore.selectedCategory === cat.key" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- ── STEP 2: Servizio ──────────────────────────── -->
        <div v-else-if="bookingStore.currentStep === 2" key="step2" class="animate-fade-in-up">

          <!-- Mini-card categoria scelta -->
          <div class="card p-3 flex items-center justify-between mb-6 bg-accent/30">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary/70">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0"/></svg>
              </div>
              <span class="text-sm font-semibold text-secondary">
                {{ bookingStore.selectedCategory === 'lunghi' ? 'Capelli lunghi' : 'Corti / media lunghezza' }}
              </span>
            </div>
            <button class="text-xs text-primary underline font-medium hover:no-underline" @click="bookingStore.goToStep(1)">
              Cambia
            </button>
          </div>

          <ServiceSelector :category="bookingStore.selectedCategory" />

          <div class="mt-8 flex gap-3">
            <button class="btn-secondary flex-none px-5" @click="bookingStore.goToStep(1)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
              </svg>
              Indietro
            </button>
            <button
              class="btn-primary flex-1"
              :disabled="!bookingStore.selectedServices.length"
              @click="bookingStore.currentStep = 3"
            >
              Continua
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- ── STEP 3: Data e ora ─────────────────────────── -->
        <div v-else-if="bookingStore.currentStep === 3" key="step3" class="animate-fade-in-up">

          <!-- Servizi scelti mini-card -->
          <div class="card p-4 flex items-center justify-between mb-6 bg-accent/30">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary/70">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
              </div>
              <div>
                <p class="text-xs text-primary/50 font-medium">
                  {{ bookingStore.selectedServices.length === 1 ? 'Servizio selezionato' : 'Servizi selezionati' }}
                </p>
                <p class="font-semibold text-secondary text-sm">{{ servicesLabel }}</p>
              </div>
            </div>
            <button class="text-xs text-primary underline font-medium hover:no-underline" @click="bookingStore.goToStep(2)">
              Cambia
            </button>
          </div>

          <h2 class="section-title mb-6 text-xl">Scegli data e orario</h2>

          <div class="flex flex-col lg:flex-row gap-6">
            <div class="flex-1">
              <p class="text-sm font-semibold text-secondary/70 mb-3 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Seleziona la data
              </p>
              <DatePicker @select="onDateSelect" />
            </div>

            <div v-if="bookingStore.selectedDate" class="flex-1">
              <p class="text-sm font-semibold text-secondary/70 mb-3 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Orari disponibili
                <span class="text-primary font-semibold capitalize ml-1">{{ formatDate(bookingStore.selectedDate) }}</span>
              </p>
              <TimeSlotGrid
                :service-id="bookingStore.primaryService?.id"
                :date="bookingStore.selectedDate"
                :total-duration="bookingStore.totalDuration"
                v-model="bookingStore.selectedTime"
              />
            </div>
          </div>

          <div class="flex gap-3 mt-8">
            <button class="btn-secondary flex-none px-5" @click="bookingStore.goToStep(2)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
              </svg>
              Indietro
            </button>
            <button
              class="btn-primary flex-1"
              :disabled="!canProceedStep3"
              @click="bookingStore.currentStep = 4"
            >
              Continua
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- ── STEP 4: Conferma ───────────────────────────── -->
        <div v-else-if="bookingStore.currentStep === 4" key="step4" class="animate-fade-in-up">

          <BookingConfirmation class="mb-6" />

          <h2 class="section-title text-xl mb-6">I tuoi dati</h2>
          <BookingForm />

          <div class="flex gap-3 mt-8">
            <button class="btn-secondary flex-none px-5" @click="bookingStore.goToStep(3)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
              </svg>
              Indietro
            </button>
            <button
              class="btn-primary flex-1"
              :disabled="!canProceedStep4 || loading"
              @click="submitBooking"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loading ? 'Invio in corso...' : 'Conferma Prenotazione' }}
            </button>
          </div>
        </div>
      </Transition>

    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
