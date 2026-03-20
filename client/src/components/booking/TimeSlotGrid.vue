<script setup>
import { ref, watch } from 'vue'
import { useApi } from '../../composables/useApi.js'

const props = defineProps({
  serviceId: String,
  date: String,
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])

const { get, loading } = useApi()
const slots = ref([])
const noSlots = ref(false)

watch(
  () => [props.date, props.serviceId],
  async ([date, serviceId]) => {
    if (!date || !serviceId) return
    slots.value = []
    noSlots.value = false
    const res = await get(`/availability/${date}`, { serviceId })
    slots.value = res.slots || []
    noSlots.value = slots.value.length === 0
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-8 text-gray-400 text-sm">Caricamento orari...</div>
    <div v-else-if="noSlots" class="text-center py-8 text-gray-400 text-sm">
      Nessun orario disponibile per questa data.
    </div>
    <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
      <button
        v-for="slot in slots"
        :key="slot"
        @click="emit('update:modelValue', slot)"
        class="py-3 rounded-lg text-sm font-medium border transition-all min-h-[44px]"
        :class="modelValue === slot
          ? 'bg-primary text-white border-primary shadow-md'
          : 'bg-white border-gray-200 text-secondary hover:border-primary hover:text-primary'"
      >
        {{ slot }}
      </button>
    </div>
  </div>
</template>
