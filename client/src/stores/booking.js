import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  const selectedService = ref(null)
  const selectedDate = ref(null)    // "YYYY-MM-DD"
  const selectedTime = ref(null)    // "HH:MM"
  const customerData = ref({ name: '', phone: '', email: '', notes: '' })
  const currentStep = ref(1)

  function selectService(service) {
    selectedService.value = service
    selectedDate.value = null
    selectedTime.value = null
    currentStep.value = 2
  }

  function selectDateTime(date, time) {
    selectedDate.value = date
    selectedTime.value = time
    currentStep.value = 3
  }

  function reset() {
    selectedService.value = null
    selectedDate.value = null
    selectedTime.value = null
    customerData.value = { name: '', phone: '', email: '', notes: '' }
    currentStep.value = 1
  }

  function goToStep(step) {
    currentStep.value = step
  }

  return {
    selectedService,
    selectedDate,
    selectedTime,
    customerData,
    currentStep,
    selectService,
    selectDateTime,
    reset,
    goToStep,
  }
})
