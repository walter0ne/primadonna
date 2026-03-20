<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import ServiceSelector from '../components/booking/ServiceSelector.vue'
import DatePicker from '../components/booking/DatePicker.vue'
import TimeSlotGrid from '../components/booking/TimeSlotGrid.vue'
import BookingForm from '../components/booking/BookingForm.vue'
import BookingConfirmation from '../components/booking/BookingConfirmation.vue'
import { useBookingStore } from '../stores/booking.js'
import { useApi } from '../composables/useApi.js'
import { useToast } from '../composables/useToast.js'
import { formatDate } from '../utils/formatters.js'

const bookingStore = useBookingStore()
const { post, loading } = useApi()
const { success, error: showError } = useToast()
const router = useRouter()

const steps = [
  { num: 1, label: 'Servizio' },
  { num: 2, label: 'Data & Ora' },
  { num: 3, label: 'Conferma' },
]

const canProceedStep2 = computed(() => bookingStore.selectedDate && bookingStore.selectedTime)
const canProceedStep3 = computed(() => {
  const { name, phone, email } = bookingStore.customerData
  return name.trim() && phone.trim() && email.trim() && /\S+@\S+\.\S+/.test(email)
})

function onDateSelect(date) {
  bookingStore.selectedDate = date
  bookingStore.selectedTime = null
}

async function submitBooking() {
  try {
    await post('/appointments', {
      customerName: bookingStore.customerData.name,
      customerPhone: bookingStore.customerData.phone,
      customerEmail: bookingStore.customerData.email,
      notes: bookingStore.customerData.notes,
      serviceId: bookingStore.selectedService.id,
      date: bookingStore.selectedDate,
      startTime: bookingStore.selectedTime,
    })
    success('Prenotazione confermata!')
    router.push('/prenotazione-confermata')
  } catch (err) {
    showError(err.message || 'Errore durante la prenotazione')
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <main class="flex-1 py-8 px-4 max-w-3xl mx-auto w-full">
      <h1 class="section-title text-center mb-8">Prenota il tuo appuntamento</h1>

      <!-- Step indicator -->
      <div class="flex items-center justify-center mb-10">
        <template v-for="(step, i) in steps" :key="step.num">
          <div class="flex flex-col items-center">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              :class="bookingStore.currentStep >= step.num
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500'"
            >
              {{ step.num }}
            </div>
            <span class="text-xs mt-1 font-medium" :class="bookingStore.currentStep >= step.num ? 'text-primary' : 'text-gray-400'">
              {{ step.label }}
            </span>
          </div>
          <div v-if="i < steps.length - 1" class="flex-1 h-0.5 mx-3 mb-5" :class="bookingStore.currentStep > step.num ? 'bg-primary' : 'bg-gray-200'" />
        </template>
      </div>

      <!-- Step 1: Scegli servizio -->
      <div v-if="bookingStore.currentStep === 1">
        <ServiceSelector />
      </div>

      <!-- Step 2: Data e ora -->
      <div v-else-if="bookingStore.currentStep === 2">
        <div class="mb-6 p-3 bg-accent/30 rounded-lg text-sm text-secondary">
          Servizio selezionato: <strong>{{ bookingStore.selectedService?.name }}</strong>
          <button class="ml-3 text-primary underline text-xs" @click="bookingStore.goToStep(1)">Cambia</button>
        </div>

        <h2 class="section-title mb-6">Scegli data e orario</h2>

        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex-1">
            <h3 class="font-medium text-secondary mb-3 text-sm">Seleziona la data</h3>
            <DatePicker @select="onDateSelect" />
          </div>

          <div class="flex-1" v-if="bookingStore.selectedDate">
            <h3 class="font-medium text-secondary mb-3 text-sm">
              Orari disponibili — <span class="text-primary capitalize">{{ formatDate(bookingStore.selectedDate) }}</span>
            </h3>
            <TimeSlotGrid
              :service-id="bookingStore.selectedService?.id"
              :date="bookingStore.selectedDate"
              v-model="bookingStore.selectedTime"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button class="btn-secondary" @click="bookingStore.goToStep(1)">← Indietro</button>
          <button
            class="btn-primary flex-1"
            :disabled="!canProceedStep2"
            @click="bookingStore.currentStep = 3"
          >
            Continua →
          </button>
        </div>
      </div>

      <!-- Step 3: Dati personali e conferma -->
      <div v-else-if="bookingStore.currentStep === 3">
        <div class="mb-6">
          <BookingConfirmation />
        </div>

        <h2 class="section-title mb-6">I tuoi dati</h2>
        <BookingForm />

        <div class="flex gap-3 mt-8">
          <button class="btn-secondary" @click="bookingStore.goToStep(2)">← Indietro</button>
          <button
            class="btn-primary flex-1"
            :disabled="!canProceedStep3 || loading"
            @click="submitBooking"
          >
            {{ loading ? 'Invio in corso...' : 'Conferma Prenotazione' }}
          </button>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
