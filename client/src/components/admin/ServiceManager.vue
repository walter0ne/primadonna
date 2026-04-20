<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi.js'
import { formatPrice, formatDuration } from '../../utils/formatters.js'

const props = defineProps({
  services: { type: Array, default: () => [] },
})
const emit = defineEmits(['updated'])

const { post, put, del } = useApi()

const showModal      = ref(false)
const editingService = ref(null)
const form = ref({ name: '', description: '', duration: 30, price: '', sortOrder: 0 })

// Conferma eliminazione
const confirmDeleteId  = ref(null)
const deleteError      = ref('')
const deleting         = ref(false)

function openCreate() {
  editingService.value = null
  form.value = { name: '', description: '', duration: 30, price: '', sortOrder: props.services.length + 1 }
  showModal.value = true
}

function openEdit(service) {
  editingService.value = service
  form.value = {
    name:        service.name,
    description: service.description || '',
    duration:    service.duration,
    price:       Number(service.price),
    sortOrder:   service.sortOrder,
  }
  showModal.value = true
}

async function save() {
  if (editingService.value) {
    await put(`/services/${editingService.value.id}`, form.value)
  } else {
    await post('/services', form.value)
  }
  showModal.value = false
  emit('updated')
}

async function toggleActive(service) {
  await put(`/services/${service.id}`, { ...service, isActive: !service.isActive })
  emit('updated')
}

function askDelete(id) {
  confirmDeleteId.value = id
  deleteError.value = ''
}

function cancelDelete() {
  confirmDeleteId.value = null
  deleteError.value = ''
}

async function confirmDelete(id) {
  deleting.value = true
  deleteError.value = ''
  try {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('pd_admin_token')}` },
    })
    const data = await res.json()
    if (!res.ok) {
      deleteError.value = data.error || 'Errore durante l\'eliminazione'
      return
    }
    confirmDeleteId.value = null
    emit('updated')
  } catch {
    deleteError.value = 'Errore di connessione'
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>

    <!-- Header lista -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm font-semibold text-secondary/60">{{ services.length }} servizi</p>
      <button @click="openCreate" class="btn-primary text-xs py-2 px-4 min-h-[40px]">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
        </svg>
        Nuovo Servizio
      </button>
    </div>

    <!-- ── MOBILE: cards ── DESKTOP: tabella ────────────── -->

    <!-- Cards (mobile) -->
    <div class="md:hidden space-y-3">
      <div
        v-for="service in services"
        :key="service.id"
        class="card p-4 flex flex-col gap-3 animate-fade-in-up"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="font-semibold text-secondary text-sm">{{ service.name }}</p>
            <p v-if="service.description" class="text-xs text-primary/40 mt-0.5 line-clamp-1">{{ service.description }}</p>
          </div>
          <span class="font-bold text-primary text-sm shrink-0">{{ formatPrice(service.price) }}</span>
        </div>

        <div class="flex items-center justify-between">
          <span class="badge">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ formatDuration(service.duration) }}
          </span>

          <div class="flex items-center gap-2">
            <button
              @click="toggleActive(service)"
              class="text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors"
              :class="service.isActive ? 'bg-success/10 text-success' : 'bg-beige text-primary/40 border border-accent-warm'"
            >
              {{ service.isActive ? 'Attivo' : 'Inattivo' }}
            </button>
            <button @click="openEdit(service)" class="btn-ghost text-xs px-3 py-1.5">
              Modifica
            </button>
            <button
              @click="askDelete(service.id)"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Elimina"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Conferma eliminazione (mobile) -->
        <div v-if="confirmDeleteId === service.id" class="rounded-xl bg-red-50 border border-red-200 p-3 space-y-2">
          <p class="text-xs font-semibold text-red-700">Eliminare «{{ service.name }}»?</p>
          <p v-if="deleteError" class="text-xs text-red-600">{{ deleteError }}</p>
          <div class="flex gap-2">
            <button @click="cancelDelete" class="flex-1 text-xs py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-100 transition-colors">
              Annulla
            </button>
            <button
              @click="confirmDelete(service.id)"
              :disabled="deleting"
              class="flex-1 text-xs py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {{ deleting ? 'Eliminazione…' : 'Sì, elimina' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="!services.length" class="text-center py-12 text-primary/40 text-sm">
        Nessun servizio. Aggiungine uno!
      </div>
    </div>

    <!-- Tabella (desktop) -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-accent-warm text-left text-xs text-primary/40 uppercase tracking-wider">
            <th class="pb-3 pr-4 font-semibold">Servizio</th>
            <th class="pb-3 pr-4 font-semibold">Durata</th>
            <th class="pb-3 pr-4 font-semibold">Prezzo</th>
            <th class="pb-3 pr-4 font-semibold">Stato</th>
            <th class="pb-3 font-semibold">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-accent/40">
          <tr v-for="service in services" :key="service.id" class="hover:bg-beige/50 transition-colors">
            <td class="py-3.5 pr-4">
              <p class="font-semibold text-secondary">{{ service.name }}</p>
              <p v-if="service.description" class="text-primary/40 text-xs truncate max-w-[200px]">{{ service.description }}</p>
            </td>
            <td class="py-3.5 pr-4 text-primary/60">{{ formatDuration(service.duration) }}</td>
            <td class="py-3.5 pr-4 font-bold text-primary">{{ formatPrice(service.price) }}</td>
            <td class="py-3.5 pr-4">
              <button
                @click="toggleActive(service)"
                class="text-xs px-2.5 py-1 rounded-xl font-semibold transition-colors"
                :class="service.isActive ? 'bg-success/10 text-success' : 'bg-beige text-primary/40 border border-accent-warm'"
              >
                {{ service.isActive ? 'Attivo' : 'Inattivo' }}
              </button>
            </td>
            <td class="py-3.5 space-y-2">
              <div class="flex items-center gap-3">
                <button @click="openEdit(service)" class="text-primary text-xs hover:underline font-medium">
                  Modifica
                </button>
                <button
                  @click="askDelete(service.id)"
                  class="text-red-400 hover:text-red-600 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                  </svg>
                  Elimina
                </button>
              </div>
              <!-- Conferma eliminazione (desktop) -->
              <div v-if="confirmDeleteId === service.id" class="rounded-xl bg-red-50 border border-red-200 p-3 space-y-2 max-w-xs">
                <p class="text-xs font-semibold text-red-700">Confermare l'eliminazione?</p>
                <p v-if="deleteError" class="text-xs text-red-600">{{ deleteError }}</p>
                <div class="flex gap-2">
                  <button @click="cancelDelete" class="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-100 transition-colors">
                    Annulla
                  </button>
                  <button
                    @click="confirmDelete(service.id)"
                    :disabled="deleting"
                    class="text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {{ deleting ? 'Eliminazione…' : 'Sì, elimina' }}
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal creazione/modifica -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 bg-secondary/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4"
        @click.self="showModal = false"
      >
        <!-- Sheet su mobile (sale dal basso), dialog centrato su desktop -->
        <div class="card p-6 w-full max-w-md animate-scale-in" style="max-height: 90dvh; overflow-y: auto;">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-semibold text-secondary">
              {{ editingService ? 'Modifica servizio' : 'Nuovo servizio' }}
            </h3>
            <button
              @click="showModal = false"
              class="w-8 h-8 rounded-xl hover:bg-accent flex items-center justify-center text-primary/50 hover:text-primary transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="save" class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">Nome *</label>
              <input v-model="form.name" type="text" class="input-field" required placeholder="es. Taglio donna" />
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">Descrizione</label>
              <input v-model="form.description" type="text" class="input-field" placeholder="Breve descrizione (opzionale)" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">Durata (min) *</label>
                <input v-model.number="form.duration" type="number" min="5" max="480" class="input-field" required />
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">Prezzo (€) *</label>
                <input v-model="form.price" type="number" step="0.01" min="0" class="input-field" required placeholder="0.00" />
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="showModal = false" class="btn-secondary flex-1">Annulla</button>
              <button type="submit" class="btn-primary flex-1">Salva</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>
