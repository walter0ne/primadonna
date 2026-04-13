<script setup>
import { useToast } from '../../composables/useToast.js'

const { toasts } = useToast()
</script>

<template>
  <div class="fixed bottom-6 right-4 left-4 md:left-auto z-50 flex flex-col gap-2 md:max-w-sm md:w-full">
    <Transition
      v-for="toast in toasts"
      :key="toast.id"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-6 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        class="rounded-2xl px-4 py-3.5 text-sm font-medium shadow-strong flex items-center gap-3"
        :class="{
          'bg-success text-white': toast.type === 'success',
          'bg-error text-white':   toast.type === 'error',
          'bg-secondary text-beige-light': toast.type === 'info',
        }"
      >
        <span class="text-base shrink-0">
          {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}
        </span>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>
