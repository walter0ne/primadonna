import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookingStore = defineStore('booking', () => {
  const selectedCategory  = ref(null)   // 'corti_medi' | 'lunghi'
  const selectedServices  = ref([])     // array of service objects (multi-select)
  const selectedDate      = ref(null)   // "YYYY-MM-DD"
  const selectedTime      = ref(null)   // "HH:MM"
  const customerData      = ref({ name: '', phone: '', email: '', notes: '' })
  const currentStep       = ref(1)

  // Durata totale di tutti i servizi selezionati
  const totalDuration = computed(() =>
    selectedServices.value.reduce((sum, s) => sum + s.duration, 0)
  )

  // Servizio primario (primo selezionato) — usato per API che richiedono un singolo serviceId
  const primaryService = computed(() => selectedServices.value[0] || null)

  function selectCategory(category) {
    selectedCategory.value = category
    // Se si cambia categoria, resetta i servizi che non appartengono a questa categoria
    if (selectedServices.value.some(s => (s.category || 'corti_medi') !== category)) {
      selectedServices.value = []
      selectedDate.value     = null
      selectedTime.value     = null
    }
    currentStep.value = 2
  }

  function toggleService(service) {
    const idx = selectedServices.value.findIndex(s => s.id === service.id)
    if (idx >= 0) {
      selectedServices.value.splice(idx, 1)
    } else {
      selectedServices.value.push(service)
    }
    // Resetta data/orario quando cambiano i servizi (durata cambia)
    selectedDate.value = null
    selectedTime.value = null
  }

  function isServiceSelected(serviceId) {
    return selectedServices.value.some(s => s.id === serviceId)
  }

  function selectDateTime(date, time) {
    selectedDate.value = date
    selectedTime.value = time
    currentStep.value  = 3
  }

  function reset() {
    selectedCategory.value = null
    selectedServices.value  = []
    selectedDate.value      = null
    selectedTime.value      = null
    customerData.value      = { name: '', phone: '', email: '', notes: '' }
    currentStep.value       = 1
  }

  function goToStep(step) {
    currentStep.value = step
  }

  return {
    selectedCategory,
    selectedServices,
    selectedDate,
    selectedTime,
    customerData,
    currentStep,
    totalDuration,
    primaryService,
    selectCategory,
    toggleService,
    isServiceSelected,
    selectDateTime,
    reset,
    goToStep,
  }
})
