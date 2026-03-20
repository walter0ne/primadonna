<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/appuntamenti', label: 'Appuntamenti', icon: '📅' },
  { to: '/admin/servizi', label: 'Servizi', icon: '✂️' },
]

function logout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<template>
  <aside class="w-64 bg-secondary text-accent flex flex-col min-h-screen">
    <div class="p-6 border-b border-secondary-light">
      <RouterLink to="/" class="font-serif text-primary text-xl font-bold tracking-widest">PRIMADONNA</RouterLink>
      <p class="text-xs opacity-60 mt-1">Area Admin</p>
    </div>

    <nav class="flex-1 p-4 space-y-1">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
        :class="route.path === link.to
          ? 'bg-primary text-white'
          : 'text-accent hover:bg-secondary-light'"
      >
        <span>{{ link.icon }}</span>
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-secondary-light">
      <p class="text-xs opacity-60 mb-3">{{ authStore.admin?.name }}</p>
      <button @click="logout" class="w-full text-left text-sm text-accent opacity-70 hover:opacity-100 transition-opacity py-2">
        Logout →
      </button>
    </div>
  </aside>
</template>
