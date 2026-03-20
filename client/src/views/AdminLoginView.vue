<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useApi } from '../composables/useApi.js'

const router = useRouter()
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
  <div class="min-h-screen flex items-center justify-center bg-secondary px-4">
    <div class="card p-8 w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="font-serif text-primary text-3xl font-bold tracking-widest mb-1">PRIMADONNA</h1>
        <p class="text-gray-500 text-sm">Accesso amministratore</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="input-field"
            placeholder="admin@primadonna.it"
            required
            autocomplete="email"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="input-field"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="text-error text-sm text-center">{{ error }}</div>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Accesso in corso...' : 'Accedi' }}
        </button>
      </form>
    </div>
  </div>
</template>
