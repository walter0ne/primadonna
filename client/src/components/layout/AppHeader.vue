<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)
</script>

<template>
  <header class="bg-secondary shadow-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
      <RouterLink to="/" class="font-serif text-primary text-2xl font-bold tracking-widest">
        PRIMADONNA
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6">
        <RouterLink to="/" class="text-accent hover:text-primary transition-colors text-sm font-medium">Home</RouterLink>
        <RouterLink to="/prenota" class="btn-primary text-sm py-2 px-5">Prenota Ora</RouterLink>
      </nav>

      <!-- Mobile hamburger -->
      <button class="md:hidden text-accent p-2" @click="menuOpen = !menuOpen" aria-label="Menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="md:hidden bg-secondary-light px-4 pb-4 flex flex-col gap-3">
      <RouterLink to="/" class="text-accent py-2 text-sm" @click="menuOpen = false">Home</RouterLink>
      <RouterLink to="/prenota" class="btn-primary text-sm text-center" @click="menuOpen = false">Prenota Ora</RouterLink>
    </div>
  </header>
</template>
