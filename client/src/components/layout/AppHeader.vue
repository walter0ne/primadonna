<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const menuOpen = ref(false)
const route = useRoute()
</script>

<template>
  <!-- Header glass sticky — solo desktop e mobile top bar -->
  <header class="glass border-b border-accent/60 sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 group" @click="menuOpen = false">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-soft">
          <svg class="w-4 h-4 text-beige-light" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <span class="font-serif text-xl font-bold tracking-widest text-secondary group-hover:text-primary transition-colors">
          PRIMADONNA
        </span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-2">
        <RouterLink
          to="/"
          class="text-sm font-medium px-4 py-2 rounded-xl transition-all"
          :class="route.path === '/' ? 'text-primary bg-accent/50' : 'text-secondary/70 hover:text-primary hover:bg-accent/30'"
        >
          Home
        </RouterLink>
        <RouterLink to="/prenota" class="btn-primary text-sm px-6 py-2.5 min-h-[40px]">
          Prenota Ora
        </RouterLink>
      </nav>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent/50 active:scale-95 transition-all text-secondary"
        @click="menuOpen = !menuOpen"
        aria-label="Menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile dropdown menu -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="menuOpen" class="md:hidden border-t border-accent/60 px-4 py-3 flex flex-col gap-2">
        <RouterLink
          to="/"
          class="text-sm font-medium text-secondary/80 hover:text-primary px-3 py-3 rounded-xl hover:bg-accent/40 transition-all"
          @click="menuOpen = false"
        >
          🏠 Home
        </RouterLink>
        <RouterLink
          to="/prenota"
          class="btn-primary text-sm text-center"
          @click="menuOpen = false"
        >
          Prenota il tuo appuntamento
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>
