<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router    = useRouter()
const route     = useRoute()

const links = [
  { to: '/admin',              label: 'Dashboard',     icon: '📊' },
  { to: '/admin/appuntamenti', label: 'Appuntamenti',  icon: '📅' },
  { to: '/admin/servizi',      label: 'Servizi',       icon: '✂️' },
]

function logout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<template>
  <!-- ═══════════════════════════════════════════════════
       DESKTOP: sidebar laterale (visibile da md in su)
  ════════════════════════════════════════════════════ -->
  <aside class="hidden md:flex w-60 bg-secondary text-accent flex-col min-h-screen shrink-0">

    <!-- Logo -->
    <div class="p-6 border-b border-secondary-light">
      <RouterLink to="/" class="font-serif text-primary text-xl font-bold tracking-widest hover:text-primary-light transition-colors">
        PRIMADONNA
      </RouterLink>
      <p class="text-xs text-accent/40 mt-1 uppercase tracking-widest font-semibold">Area Admin</p>
    </div>

    <!-- Nav links -->
    <nav class="flex-1 p-4 space-y-1">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
        :class="route.path === link.to
          ? 'bg-primary text-beige-light shadow-btn'
          : 'text-accent/70 hover:bg-secondary-light hover:text-accent'"
      >
        <span class="text-base">{{ link.icon }}</span>
        {{ link.label }}
      </RouterLink>
    </nav>

    <!-- User + logout -->
    <div class="p-4 border-t border-secondary-light">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {{ authStore.admin?.name?.charAt(0)?.toUpperCase() ?? 'A' }}
        </div>
        <p class="text-xs text-accent/60 truncate">{{ authStore.admin?.name }}</p>
      </div>
      <button
        @click="logout"
        class="w-full flex items-center gap-2 text-sm text-accent/50 hover:text-error transition-colors py-2 px-3 rounded-xl hover:bg-secondary-light"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Logout
      </button>
    </div>
  </aside>

  <!-- ═══════════════════════════════════════════════════
       MOBILE: top header + bottom navigation
  ════════════════════════════════════════════════════ -->

  <!-- Top bar mobile -->
  <div class="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-accent/60 px-4 h-14 flex items-center justify-between">
    <RouterLink to="/" class="font-serif text-primary text-lg font-bold tracking-widest">PRIMADONNA</RouterLink>
    <span class="text-xs text-primary/40 uppercase tracking-widest font-semibold">Admin</span>
  </div>

  <!-- Bottom nav mobile -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-xl border-t border-secondary-light flex items-stretch" style="padding-bottom: env(safe-area-inset-bottom, 0px)">

    <RouterLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold transition-all"
      :class="route.path === link.to
        ? 'text-primary-light'
        : 'text-accent/40 hover:text-accent/80'"
    >
      <span class="text-xl leading-none">{{ link.icon }}</span>
      <span class="text-[10px] uppercase tracking-wide">{{ link.label }}</span>
      <!-- Indicator dot -->
      <span
        class="w-1 h-1 rounded-full transition-all"
        :class="route.path === link.to ? 'bg-primary-light' : 'bg-transparent'"
      ></span>
    </RouterLink>

    <!-- Logout -->
    <button
      @click="logout"
      class="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold text-accent/40 hover:text-error transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
      <span class="text-[10px] uppercase tracking-wide">Esci</span>
      <span class="w-1 h-1 rounded-full bg-transparent"></span>
    </button>
  </nav>
</template>
