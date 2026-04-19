<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[#2D1A0E]/50 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="translate-y-full sm:translate-y-4 sm:opacity-0 sm:scale-95"
          enter-to-class="translate-y-0 sm:opacity-100 sm:scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="translate-y-0 sm:opacity-100"
          leave-to-class="translate-y-full sm:opacity-0"
        >
          <div v-if="show" class="relative w-full sm:max-w-md bg-[#FBF7F1] rounded-t-3xl sm:rounded-2xl shadow-strong max-h-[90dvh] overflow-y-auto">
            <!-- Handle bar (mobile) -->
            <div class="sm:hidden flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 rounded-full bg-[#D4B896]"></div>
            </div>

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#E8D5B7]">
              <h2 class="font-bold text-[#2D1A0E] text-lg">Modifica prenotazione</h2>
              <button @click="$emit('close')" class="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#F0E2CE] transition-colors text-[#9E7A5A]">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-5 space-y-5">

              <!-- Servizio -->
              <div>
                <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Servizio</label>
                <div v-if="loadingServices" class="flex items-center gap-2 text-sm text-[#9E7A5A] py-2">
                  <svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Caricamento servizi…
                </div>
                <div v-else class="space-y-2">
                  <button
                    v-for="svc in services"
                    :key="svc.id"
                    type="button"
                    @click="onServiceChange(svc)"
                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all"
                    :class="form.serviceId === svc.id
                      ? 'bg-[#8B5A2B]/10 border-[#8B5A2B] text-[#2D1A0E]'
                      : 'bg-white border-[#E8D5B7] text-[#2D1A0E] hover:border-[#C49A6C]'"
                  >
                    <div>
                      <p class="font-medium text-sm">{{ svc.name }}</p>
                      <p class="text-xs text-[#9E7A5A] mt-0.5">{{ svc.duration }} min · €{{ svc.price }}</p>
                    </div>
                    <svg v-if="form.serviceId === svc.id" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#8B5A2B] shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Data -->
              <div>
                <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Data</label>
                <input
                  v-model="form.date"
                  type="date"
                  :min="minDate"
                  class="input-field"
                  :class="{ 'border-red-400': errors.date }"
                  @change="onDateChange"
                />
                <p v-if="errors.date" class="mt-1 text-xs text-red-500">{{ errors.date }}</p>
              </div>

              <!-- Orario -->
              <div>
                <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Orario</label>
                <div v-if="loadingSlots" class="flex items-center gap-2 text-sm text-[#9E7A5A] py-2">
                  <svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Caricamento orari disponibili…
                </div>
                <div v-else-if="!form.date" class="text-sm text-[#9E7A5A] py-2">
                  Seleziona prima una data
                </div>
                <div v-else-if="!form.serviceId" class="text-sm text-[#9E7A5A] py-2">
                  Seleziona prima un servizio
                </div>
                <div v-else-if="slots.length === 0" class="text-sm text-[#9E7A5A] py-2">
                  Nessun orario disponibile per questa data
                </div>
                <div v-else class="grid grid-cols-3 gap-2">
                  <button
                    v-for="slot in slots"
                    :key="slot"
                    type="button"
                    @click="form.startTime = slot"
                    class="py-2 px-3 text-sm rounded-xl border-2 font-medium transition-all"
                    :class="form.startTime === slot
                      ? 'bg-[#8B5A2B] border-[#8B5A2B] text-white'
                      : 'bg-white border-[#E8D5B7] text-[#2D1A0E] hover:border-[#8B5A2B] hover:text-[#8B5A2B]'"
                  >
                    {{ slot }}
                  </button>
                </div>
                <p v-if="errors.startTime" class="mt-1 text-xs text-red-500">{{ errors.startTime }}</p>
              </div>

              <!-- Note -->
              <div>
                <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Note (opzionale)</label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Allergie, preferenze, richieste particolari…"
                  class="input-field resize-none"
                ></textarea>
              </div>

              <!-- Global error -->
              <div v-if="globalError" class="p-3 rounded-xl bg-red-50 border border-red-200">
                <p class="text-sm text-red-600">{{ globalError }}</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 pb-6 flex gap-3">
              <button @click="$emit('close')" class="btn-secondary flex-1">Annulla</button>
              <button
                @click="handleSave"
                :disabled="saving || !form.date || !form.startTime || !form.serviceId"
                class="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <svg v-if="saving" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {{ saving ? 'Salvataggio…' : 'Salva modifiche' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCustomerStore } from '@/stores/customer'

const props = defineProps({
  show:        { type: Boolean, default: false },
  appointment: { type: Object, default: null },
})
const emit = defineEmits(['close', 'saved'])

const customerStore = useCustomerStore()

const form         = ref({ serviceId: '', date: '', startTime: '', notes: '' })
const services     = ref([])
const slots        = ref([])
const loadingServices = ref(false)
const loadingSlots = ref(false)
const saving       = ref(false)
const errors       = ref({})
const globalError  = ref('')

// Data minima = domani (usando date locali, non UTC, per evitare sfasamenti di fuso)
const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
})

// Quando si apre, carica servizi e precompila con i valori attuali
watch(() => props.show, async (val) => {
  if (val && props.appointment) {
    // Precompila il form con i valori attuali
    const d = new Date(props.appointment.date)
    const y  = d.getUTCFullYear()
    const m  = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    form.value.date      = `${y}-${m}-${dd}`
    form.value.startTime = props.appointment.startTime
    form.value.notes     = props.appointment.notes || ''
    form.value.serviceId = props.appointment.serviceId || ''
    errors.value    = {}
    globalError.value = ''
    slots.value = []

    // Carica lista servizi
    await loadServices()

    // Carica gli slot per la data corrente
    if (form.value.date && form.value.serviceId) {
      await loadSlots(form.value.date, form.value.serviceId)
    }
  }
})

async function loadServices() {
  loadingServices.value = true
  try {
    const res = await fetch('/api/services')
    if (!res.ok) throw new Error()
    services.value = await res.json()
  } catch {
    services.value = []
  } finally {
    loadingServices.value = false
  }
}

async function onServiceChange(svc) {
  form.value.serviceId = svc.id
  form.value.startTime = ''   // reset orario: la durata può essere diversa
  errors.value.startTime = ''
  if (form.value.date) await loadSlots(form.value.date, svc.id)
}

async function onDateChange() {
  form.value.startTime = ''
  errors.value.date    = ''
  if (form.value.date && form.value.serviceId) {
    await loadSlots(form.value.date, form.value.serviceId)
  }
}

async function loadSlots(date, serviceId) {
  loadingSlots.value = true
  slots.value = []
  try {
    const res = await fetch(`/api/availability?date=${date}&serviceId=${serviceId}`)
    if (!res.ok) throw new Error()
    const data = await res.json()

    // Se la data e il servizio non cambiano, includi lo slot corrente anche se "occupato"
    const originalDate = (() => {
      const d = new Date(props.appointment.date)
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`
    })()
    let available = data.slots || []
    if (date === originalDate && serviceId === props.appointment.serviceId && !available.includes(props.appointment.startTime)) {
      available = [props.appointment.startTime, ...available].sort()
    }
    slots.value = available
  } catch {
    slots.value = []
  } finally {
    loadingSlots.value = false
  }
}

async function handleSave() {
  errors.value  = {}
  globalError.value = ''

  if (!form.value.serviceId) { globalError.value = 'Seleziona un servizio'; return }
  if (!form.value.date)      { errors.value.date = 'Seleziona una data'; return }
  if (!form.value.startTime) { errors.value.startTime = 'Seleziona un orario'; return }

  saving.value = true
  try {
    const res = await fetch(`/api/customer/appointments/${props.appointment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${customerStore.token}`,
      },
      body: JSON.stringify({
        serviceId: form.value.serviceId,
        date:      form.value.date,
        startTime: form.value.startTime,
        notes:     form.value.notes,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      globalError.value = data.error || 'Errore durante il salvataggio'
      return
    }
    emit('saved', data)
    emit('close')
  } catch {
    globalError.value = 'Errore di connessione. Riprova.'
  } finally {
    saving.value = false
  }
}
</script>
