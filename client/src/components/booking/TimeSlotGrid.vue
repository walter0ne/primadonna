<script setup>
import { ref, watch } from 'vue'
import { useApi } from '../../composables/useApi.js'

const props = defineProps({
  serviceId:     String,
  date:          String,
  modelValue:    String,
  totalDuration: { type: Number, default: null },
})
const emit = defineEmits(['update:modelValue'])

const { get, loading } = useApi()
const slots   = ref([])
const noSlots = ref(false)

watch(
  () => [props.date, props.serviceId, props.totalDuration],
  async ([date, serviceId, totalDuration]) => {
    if (!date || !serviceId) return
    slots.value   = []
    noSlots.value = false
    const params = { serviceId }
    if (totalDuration) params.totalDuration = totalDuration
    const res = await get(`/availability/${date}`, params)
    slots.value   = res.slots || []
    noSlots.value = slots.value.length === 0
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <!-- Loading shimmer -->
    <div v-if="loading" class="grid grid-cols-3 gap-2 stagger">
      <div v-for="i in 6" :key="i" class="shimmer h-12 animate-fade-in-up"></div>
    </div>

    <!-- Nessun orario -->
    <div v-else-if="noSlots" class="card p-6 text-center">
      <div class="text-3xl mb-3">😔</div>
      <p class="text-sm font-medium text-secondary">Nessun orario disponibile</p>
      <p class="text-xs text-primary/40 mt-1">Prova con un'altra data</p>
    </div>

    <!-- Slot grid -->
    <div v-else class="grid grid-cols-3 gap-2 stagger">
      <button
        v-for="slot in slots"
        :key="slot"
        @click="emit('update:modelValue', slot)"
        class="py-3 rounded-2xl text-sm font-semibold border-2 transition-all duration-150 min-h-[52px] active:scale-95 animate-fade-in-up"
        :class="modelValue === slot
          ? 'bg-primary text-beige-light border-primary shadow-btn scale-105'
          : 'bg-beige-light border-accent-warm text-secondary/70 hover:border-primary/50 hover:text-primary hover:bg-accent/40'"
      >
        {{ slot }}
      </button>
    </div>
  </div>
</template>
