<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'

const menuOpen = ref(false)
const route = useRoute()
const customerStore = useCustomerStore()
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

        <!-- Area Cliente: logged in -->
        <RouterLink
          v-if="customerStore.isAuthenticated"
          to="/area-cliente"
          class="text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          :class="route.path.startsWith('/area-cliente') ? 'text-primary bg-accent/50' : 'text-secondary/70 hover:text-primary hover:bg-accent/30'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          {{ customerStore.customer?.name?.split(' ')[0] || 'Area Cliente' }}
        </RouterLink>

        <!-- Area Cliente: guest -->
        <RouterLink
          v-else
          to="/area-cliente/login"
          class="text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          :class="route.path.startsWith('/area-cliente') ? 'text-primary bg-accent/50' : 'text-secondary/70 hover:text-primary hover:bg-accent/30'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          Area Cliente
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
          class="text-sm font-medium text-secondary/80 hover:text-primary px-3 py-3 rounded-xl hover:bg-accent/40 transition-all flex items-center gap-2"
          @click="menuOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Home
        </RouterLink>

        <!-- Area Cliente mobile -->
        <RouterLink
          v-if="customerStore.isAuthenticated"
          to="/area-cliente"
          class="text-sm font-medium text-secondary/80 hover:text-primary px-3 py-3 rounded-xl hover:bg-accent/40 transition-all flex items-center gap-2"
          @click="menuOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          Le mie prenotazioni
        </RouterLink>
        <RouterLink
          v-else
          to="/area-cliente/login"
          class="text-sm font-medium text-secondary/80 hover:text-primary px-3 py-3 rounded-xl hover:bg-accent/40 transition-all flex items-center gap-2"
          @click="menuOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          Area Cliente
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
