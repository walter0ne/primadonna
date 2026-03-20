<script setup>
import { useToast } from '../../composables/useToast.js'

const { toasts } = useToast()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
    <Transition
      v-for="toast in toasts"
      :key="toast.id"
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="rounded-lg px-4 py-3 text-white text-sm font-medium shadow-lg flex items-center gap-2"
        :class="{
          'bg-success': toast.type === 'success',
          'bg-error': toast.type === 'error',
          'bg-secondary': toast.type === 'info',
        }"
      >
        <span>{{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : 'ℹ' }}</span>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>
