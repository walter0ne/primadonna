<script setup>
import { ref } from 'vue'
import { useApi } from '../../composables/useApi.js'
import { formatPrice, formatDuration } from '../../utils/formatters.js'

const props = defineProps({
  services: { type: Array, default: () => [] },
})
const emit = defineEmits(['updated'])

const { post, put, del } = useApi()

const showModal = ref(false)
const editingService = ref(null)
const form = ref({ name: '', description: '', duration: 30, price: '', sortOrder: 0 })

function openCreate() {
  editingService.value = null
  form.value = { name: '', description: '', duration: 30, price: '', sortOrder: props.services.length + 1 }
  showModal.value = true
}

function openEdit(service) {
  editingService.value = service
  form.value = {
    name: service.name,
    description: service.description || '',
    duration: service.duration,
    price: Number(service.price),
    sortOrder: service.sortOrder,
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
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-semibold text-secondary">{{ services.length }} servizi</h3>
      <button @click="openCreate" class="btn-primary text-sm py-2 px-4">+ Nuovo Servizio</button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500 text-xs uppercase tracking-wide">
            <th class="pb-3 pr-4">Servizio</th>
            <th class="pb-3 pr-4">Durata</th>
            <th class="pb-3 pr-4">Prezzo</th>
            <th class="pb-3 pr-4">Stato</th>
            <th class="pb-3">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="service in services" :key="service.id" class="py-3">
            <td class="py-3 pr-4">
              <p class="font-medium text-secondary">{{ service.name }}</p>
              <p v-if="service.description" class="text-gray-400 text-xs truncate max-w-[200px]">{{ service.description }}</p>
            </td>
            <td class="py-3 pr-4 text-gray-600">{{ formatDuration(service.duration) }}</td>
            <td class="py-3 pr-4 font-semibold text-primary">{{ formatPrice(service.price) }}</td>
            <td class="py-3 pr-4">
              <button
                @click="toggleActive(service)"
                class="text-xs px-2 py-1 rounded-full transition-colors"
                :class="service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ service.isActive ? 'Attivo' : 'Inattivo' }}
              </button>
            </td>
            <td class="py-3">
              <button @click="openEdit(service)" class="text-primary text-xs hover:underline">Modifica</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="card p-6 w-full max-w-md">
        <h3 class="font-semibold text-secondary mb-4">{{ editingService ? 'Modifica servizio' : 'Nuovo servizio' }}</h3>
        <form @submit.prevent="save" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input v-model="form.name" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
            <input v-model="form.description" type="text" class="input-field" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Durata (min) *</label>
              <input v-model.number="form.duration" type="number" min="5" max="480" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prezzo (€) *</label>
              <input v-model="form.price" type="number" step="0.01" min="0" class="input-field" required />
            </div>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="showModal = false" class="btn-secondary flex-1">Annulla</button>
            <button type="submit" class="btn-primary flex-1">Salva</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
