import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  const selectedCategory = ref(null)   // 'corti_medi' | 'lunghi'
  const selectedService  = ref(null)
  const selectedDate     = ref(null)   // "YYYY-MM-DD"
  const selectedTime     = ref(null)   // "HH:MM"
  const customerData     = ref({ name: '', phone: '', email: '', notes: '' })
  const currentStep      = ref(1)

  function selectCategory(category) {
    selectedCategory.value = category
    // Se si cambia categoria, resetta il servizio scelto
    if (selectedService.value?.category !== category) {
      selectedService.value = null
      selectedDate.value    = null
      selectedTime.value    = null
    }
    currentStep.value = 2
  }

  function selectService(service) {
    selectedService.value = service
    selectedDate.value    = null
    selectedTime.value    = null
  }

  function selectDateTime(date, time) {
    selectedDate.value = date
    selectedTime.value = time
    currentStep.value  = 3
  }

  function reset() {
    selectedCategory.value = null
    selectedService.value  = null
    selectedDate.value     = null
    selectedTime.value     = null
    customerData.value     = { name: '', phone: '', email: '', notes: '' }
    currentStep.value      = 1
  }

  function goToStep(step) {
    currentStep.value = step
  }

  return {
    selectedCategory,
    selectedService,
    selectedDate,
    selectedTime,
    customerData,
    currentStep,
    selectCategory,
    selectService,
    selectDateTime,
    reset,
    goToStep,
  }
})
