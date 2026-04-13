<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useApi } from '../composables/useApi.js'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()
const { post, loading, error } = useApi()

const form = ref({ email: '', password: '' })

// Mostra banner se la sessione è scaduta
const sessionExpired = route.query.session === 'expired'

async function login() {
  const data = await post('/auth/login', form.value)
  authStore.login(data)
  // Torna alla pagina che aveva richiesto il login, altrimenti /admin
  const redirect = route.query.redirect || '/admin'
  router.push(redirect)
}
</script>

<template>
  <div class="min-h-screen min-h-dvh flex items-center justify-center bg-secondary px-4 py-12">

    <!-- Sfondo decorativo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
    </div>

    <div class="relative card p-8 w-full max-w-sm animate-scale-in">

      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4 shadow-btn">
          <svg class="w-7 h-7 text-beige-light" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
          </svg>
        </div>
        <h1 class="font-serif text-primary text-2xl font-bold tracking-widest mb-1">PRIMADONNA</h1>
        <p class="text-primary/40 text-xs uppercase tracking-widest font-semibold">Area Amministratore</p>
      </div>

      <!-- Banner sessione scaduta -->
      <div v-if="sessionExpired" class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-3 py-2.5 mb-4">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        Sessione scaduta. Accedi di nuovo.
      </div>

      <form @submit.prevent="login" class="space-y-4">

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="input-field"
            placeholder="admin@primadonna.it"
            required
            autocomplete="email"
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-secondary/60 uppercase tracking-wider">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="input-field"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="flex items-center gap-2 text-error text-xs bg-error/10 rounded-xl py-2.5 px-3">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
          {{ error }}
        </div>

        <button type="submit" class="btn-primary w-full mt-2" :disabled="loading">
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ loading ? 'Accesso in corso...' : 'Accedi' }}
        </button>
      </form>
    </div>
  </div>
</template>
