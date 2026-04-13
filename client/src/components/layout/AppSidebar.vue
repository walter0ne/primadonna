<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router    = useRouter()
const route     = useRoute()

const links = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>`
  },
  {
    to: '/admin/appuntamenti',
    label: 'Appuntamenti',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"/></svg>`
  },
  {
    to: '/admin/servizi',
    label: 'Servizi',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></svg>`
  },
]

function logout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<template>
  <!-- ═══════════════ DESKTOP sidebar ═══════════════ -->
  <aside class="hidden md:flex w-60 bg-secondary text-accent flex-col min-h-screen shrink-0">
    <div class="p-6 border-b border-secondary-light">
      <RouterLink to="/" class="font-serif text-primary text-xl font-bold tracking-widest hover:text-primary-light transition-colors">
        PRIMADONNA
      </RouterLink>
      <p class="text-xs text-accent/40 mt-1 uppercase tracking-widest font-semibold">Area Admin</p>
    </div>

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
        <span class="w-5 h-5 shrink-0" v-html="link.icon"></span>
        {{ link.label }}
      </RouterLink>
    </nav>

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
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
        </svg>
        Logout
      </button>
    </div>
  </aside>

  <!-- ═══════════════ MOBILE top bar ═══════════════ -->
  <div class="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-accent/60 px-4 h-14 flex items-center justify-between">
    <RouterLink to="/" class="font-serif text-primary text-lg font-bold tracking-widest">PRIMADONNA</RouterLink>
    <span class="text-xs text-primary/40 uppercase tracking-widest font-semibold">Admin</span>
  </div>

  <!-- ═══════════════ MOBILE bottom nav ═══════════════ -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-xl border-t border-secondary-light flex items-stretch" style="padding-bottom: env(safe-area-inset-bottom, 0px)">
    <RouterLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all"
      :class="route.path === link.to ? 'text-primary-light' : 'text-accent/40 hover:text-accent/80'"
    >
      <span class="w-5 h-5" v-html="link.icon"></span>
      <span class="text-[10px] font-semibold uppercase tracking-wide">{{ link.label }}</span>
      <span class="w-1 h-1 rounded-full transition-all" :class="route.path === link.to ? 'bg-primary-light' : 'bg-transparent'"></span>
    </RouterLink>

    <button
      @click="logout"
      class="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-accent/40 hover:text-error transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
      </svg>
      <span class="text-[10px] font-semibold uppercase tracking-wide">Esci</span>
      <span class="w-1 h-1 rounded-full bg-transparent"></span>
    </button>
  </nav>
</template>
