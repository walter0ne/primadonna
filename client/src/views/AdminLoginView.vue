<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useApi } from '../composables/useApi.js'

const router    = useRouter()
const authStore = useAuthStore()
const { post, loading, error } = useApi()

const form = ref({ email: '', password: '' })

async function login() {
  const data = await post('/auth/login', form.value)
  authStore.login(data)
  router.push('/admin')
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
          <svg class="w-7 h-7 text-beige-light" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <h1 class="font-serif text-primary text-2xl font-bold tracking-widest mb-1">PRIMADONNA</h1>
        <p class="text-primary/40 text-xs uppercase tracking-widest font-semibold">Area Amministratore</p>
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

        <div v-if="error" class="text-error text-xs text-center bg-error/10 rounded-xl py-2 px-3">{{ error }}</div>

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
