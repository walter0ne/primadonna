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
        <div class="relative w-full sm:max-w-md bg-[#FBF7F1] rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92dvh] overflow-y-auto flex flex-col">
          <!-- Handle bar (mobile) -->
          <div class="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
            <div class="w-10 h-1 rounded-full bg-[#D4B896]"></div>
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#E8D5B7] shrink-0">
            <h2 class="font-bold text-[#2D1A0E] text-lg">Modifica prenotazione</h2>
            <button @click="$emit('close')" class="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#F0E2CE] transition-colors text-[#9E7A5A]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 space-y-6 overflow-y-auto">

            <!-- ① Servizio -->
            <section>
              <p class="text-xs font-semibold uppercase tracking-wider text-[#9E7A5A] mb-3">Servizio</p>
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
                  @click="selectService(svc)"
                  class="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 text-left transition-all"
                  :class="form.serviceId === svc.id
                    ? 'bg-[#8B5A2B]/10 border-[#8B5A2B]'
                    : 'bg-white border-[#E8D5B7] hover:border-[#C49A6C]'"
                >
                  <div>
                    <p class="font-semibold text-sm text-[#2D1A0E]">{{ svc.name }}</p>
                    <p class="text-xs text-[#9E7A5A] mt-0.5">{{ svc.duration }} min · €{{ svc.price }}</p>
                  </div>
                  <div
                    class="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                    :class="form.serviceId === svc.id ? 'border-[#8B5A2B] bg-[#8B5A2B]' : 'border-[#D4B896]'"
                  >
                    <svg v-if="form.serviceId === svc.id" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                </button>
              </div>
            </section>

            <!-- ② Data — calendario custom -->
            <section>
              <p class="text-xs font-semibold uppercase tracking-wider text-[#9E7A5A] mb-3">Data</p>
              <div class="bg-white border-2 border-[#E8D5B7] rounded-2xl overflow-hidden">
                <!-- Navigazione mese -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-[#F0E2CE]">
                  <button type="button" @click="prevMonth" class="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#F0E2CE] transition-colors text-[#9E7A5A] hover:text-[#2D1A0E]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <span class="text-sm font-semibold text-[#2D1A0E] capitalize">{{ monthLabel }}</span>
                  <button type="button" @click="nextMonth" class="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[#F0E2CE] transition-colors text-[#9E7A5A] hover:text-[#2D1A0E]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                <!-- Intestazione giorni -->
                <div class="grid grid-cols-7 px-3 pt-2 pb-1">
                  <div v-for="d in ['Lu','Ma','Me','Gi','Ve','Sa','Do']" :key="d"
                    class="text-center text-xs font-medium text-[#9E7A5A] py-1">{{ d }}</div>
                </div>

                <!-- Griglia giorni -->
                <div class="grid grid-cols-7 px-3 pb-3 gap-y-1">
                  <!-- Padding iniziale -->
                  <div v-for="_ in calendarOffset" :key="'e'+_"></div>
                  <!-- Giorni del mese -->
                  <button
                    v-for="day in daysInMonth"
                    :key="day"
                    type="button"
                    :disabled="isDayDisabled(day)"
                    @click="selectDay(day)"
                    class="aspect-square flex items-center justify-center text-sm rounded-xl transition-all font-medium mx-auto w-9 h-9"
                    :class="dayClass(day)"
                  >
                    {{ day }}
                  </button>
                </div>
              </div>
            </section>

            <!-- ③ Orario -->
            <section>
              <p class="text-xs font-semibold uppercase tracking-wider text-[#9E7A5A] mb-3">Orario</p>
              <div v-if="loadingSlots" class="flex items-center gap-2 text-sm text-[#9E7A5A] py-3">
                <svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Caricamento orari…
              </div>
              <div v-else-if="!form.date" class="text-sm text-[#9E7A5A] py-2">Seleziona prima una data</div>
              <div v-else-if="!form.serviceId" class="text-sm text-[#9E7A5A] py-2">Seleziona prima un servizio</div>
              <div v-else-if="slots.length === 0" class="text-sm text-[#9E7A5A] py-2">Nessun orario disponibile per questa data</div>
              <div v-else class="grid grid-cols-4 gap-2">
                <button
                  v-for="slot in slots"
                  :key="slot"
                  type="button"
                  @click="form.startTime = slot"
                  class="py-2 text-sm rounded-xl border-2 font-medium transition-all"
                  :class="form.startTime === slot
                    ? 'bg-[#8B5A2B] border-[#8B5A2B] text-white'
                    : 'bg-white border-[#E8D5B7] text-[#2D1A0E] hover:border-[#8B5A2B] hover:text-[#8B5A2B]'"
                >
                  {{ slot }}
                </button>
              </div>
            </section>

            <!-- ④ Note -->
            <section>
              <p class="text-xs font-semibold uppercase tracking-wider text-[#9E7A5A] mb-3">Note (opzionale)</p>
              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="Allergie, preferenze, richieste particolari…"
                class="w-full bg-white border-2 border-[#E8D5B7] rounded-2xl px-4 py-3 text-sm text-[#2D1A0E] placeholder-[#C4A882] focus:outline-none focus:border-[#8B5A2B] transition-colors resize-none"
              ></textarea>
            </section>

            <!-- Errore globale -->
            <div v-if="globalError" class="p-3 rounded-xl bg-red-50 border border-red-200">
              <p class="text-sm text-red-600">{{ globalError }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 pt-3 flex gap-3 border-t border-[#E8D5B7] shrink-0">
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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useCustomerStore } from '@/stores/customer'

const props = defineProps({
  show:        { type: Boolean, default: false },
  appointment: { type: Object, default: null },
})
const emit = defineEmits(['close', 'saved'])

const customerStore = useCustomerStore()

const form            = ref({ serviceId: '', date: '', startTime: '', notes: '' })
const services        = ref([])
const slots           = ref([])
const loadingServices = ref(false)
const loadingSlots    = ref(false)
const saving          = ref(false)
const globalError     = ref('')

// ── Calendario custom ──────────────────────────────────────────────────────
const calendarYear  = ref(new Date().getFullYear())
const calendarMonth = ref(new Date().getMonth())  // 0-based

const monthLabel = computed(() =>
  new Date(calendarYear.value, calendarMonth.value, 1)
    .toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
)

const daysInMonth = computed(() =>
  new Date(calendarYear.value, calendarMonth.value + 1, 0).getDate()
)

// Offset lunedì-based (0 = lunedì)
const calendarOffset = computed(() => {
  const dow = new Date(calendarYear.value, calendarMonth.value, 1).getDay()
  return dow === 0 ? 6 : dow - 1
})

// Data minima = domani (locale)
const minDateLocal = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() }
})

function isDayDisabled(day) {
  const min = minDateLocal.value
  if (calendarYear.value < min.y) return true
  if (calendarYear.value === min.y && calendarMonth.value < min.m) return true
  if (calendarYear.value === min.y && calendarMonth.value === min.m && day < min.d) return true
  return false
}

function dayClass(day) {
  const pad  = (n) => String(n).padStart(2, '0')
  const iso  = `${calendarYear.value}-${pad(calendarMonth.value + 1)}-${pad(day)}`
  const sel  = form.value.date === iso
  const dis  = isDayDisabled(day)
  if (dis) return 'text-[#C4A882] cursor-not-allowed opacity-40'
  if (sel) return 'bg-[#8B5A2B] text-white'
  return 'text-[#2D1A0E] hover:bg-[#F0E2CE]'
}

function selectDay(day) {
  if (isDayDisabled(day)) return
  const pad = (n) => String(n).padStart(2, '0')
  const iso = `${calendarYear.value}-${pad(calendarMonth.value + 1)}-${pad(day)}`
  if (form.value.date !== iso) {
    form.value.date      = iso
    form.value.startTime = ''
    if (form.value.serviceId) loadSlots(iso, form.value.serviceId)
  }
}

function prevMonth() {
  if (calendarMonth.value === 0) { calendarMonth.value = 11; calendarYear.value-- }
  else calendarMonth.value--
}

function nextMonth() {
  if (calendarMonth.value === 11) { calendarMonth.value = 0; calendarYear.value++ }
  else calendarMonth.value++
}

// ── Servizi ────────────────────────────────────────────────────────────────
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

function selectService(svc) {
  if (form.value.serviceId === svc.id) return
  form.value.serviceId = svc.id
  form.value.startTime = ''
  if (form.value.date) loadSlots(form.value.date, svc.id)
}

// ── Slot ───────────────────────────────────────────────────────────────────
async function loadSlots(date, serviceId) {
  loadingSlots.value = true
  slots.value = []
  try {
    // URL corretto: /api/availability/:date?serviceId=xxx
    const res  = await fetch(`/api/availability/${date}?serviceId=${serviceId}`)
    if (!res.ok) throw new Error()
    const data = await res.json()
    let available = data.slots || []

    // Mantieni lo slot originale selezionabile se data e servizio non cambiano
    const appt = props.appointment
    if (appt) {
      const d   = new Date(appt.date)
      const pad = (n) => String(n).padStart(2, '0')
      const origDate = `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`
      if (date === origDate && serviceId === appt.serviceId && !available.includes(appt.startTime)) {
        available = [appt.startTime, ...available].sort()
      }
    }
    slots.value = available
  } catch {
    slots.value = []
  } finally {
    loadingSlots.value = false
  }
}

// ── Apertura modal ─────────────────────────────────────────────────────────
watch(() => props.show, async (val) => {
  if (!val || !props.appointment) return

  const appt = props.appointment
  const d    = new Date(appt.date)
  const pad  = (n) => String(n).padStart(2, '0')
  const iso  = `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`

  // Resetta stato
  slots.value       = []
  globalError.value = ''

  // Precompila
  form.value = {
    serviceId: appt.serviceId || '',
    date:      iso,
    startTime: appt.startTime || '',
    notes:     appt.notes     || '',
  }

  // Posiziona il calendario sul mese dell'appuntamento
  calendarYear.value  = d.getUTCFullYear()
  calendarMonth.value = d.getUTCMonth()

  // Carica servizi e slot in parallelo
  await Promise.all([
    loadServices(),
    loadSlots(iso, appt.serviceId),
  ])
})

// ── Salvataggio ────────────────────────────────────────────────────────────
async function handleSave() {
  globalError.value = ''

  if (!form.value.serviceId) { globalError.value = 'Seleziona un servizio'; return }
  if (!form.value.date)      { globalError.value = 'Seleziona una data'; return }
  if (!form.value.startTime) { globalError.value = 'Seleziona un orario'; return }

  saving.value = true
  try {
    const res = await fetch(`/api/customer/appointments/${props.appointment.id}`, {
      method:  'PUT',
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
