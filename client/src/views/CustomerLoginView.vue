<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F5ECD8] via-[#FBF7F1] to-[#F0E2CE] flex items-center justify-center px-4 py-12">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-72 h-72 bg-[#8B5A2B]/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-72 h-72 bg-[#A8703E]/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md animate-fadeInUp">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#A8703E] shadow-btn mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#FBF7F1]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-[#2D1A0E] font-serif tracking-wide">Area Cliente</h1>
        <p class="text-sm text-[#9E7A5A] mt-1">Accedi per gestire le tue prenotazioni</p>
      </div>

      <!-- Session expired banner -->
      <div v-if="sessionExpired" class="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <p class="text-sm text-amber-700">Sessione scaduta. Accedi di nuovo.</p>
      </div>

      <!-- Card -->
      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="la-tua@email.it"
              class="input-field"
              :class="{ 'border-red-400 focus:ring-red-400/30': errors.email }"
              @input="clearError('email')"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="input-field pr-12"
                :class="{ 'border-red-400 focus:ring-red-400/30': errors.password }"
                @input="clearError('password')"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E7A5A] hover:text-[#8B5A2B] transition-colors"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <!-- Forgot password -->
          <div class="text-right -mt-2">
            <RouterLink to="/area-cliente/password-dimenticata" class="text-xs text-[#9E7A5A] hover:text-[#8B5A2B] transition-colors">
              Password dimenticata?
            </RouterLink>
          </div>

          <!-- Global error -->
          <div v-if="globalError" class="p-3 rounded-xl bg-red-50 border border-red-200">
            <p class="text-sm text-red-600 text-center">{{ globalError }}</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>{{ loading ? 'Accesso in corso…' : 'Accedi' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-[#E8D5B7]"></div>
          <span class="text-xs text-[#9E7A5A]">oppure</span>
          <div class="flex-1 h-px bg-[#E8D5B7]"></div>
        </div>

        <!-- Register link -->
        <p class="text-center text-sm text-[#9E7A5A]">
          Non hai ancora un account?
          <RouterLink to="/area-cliente/registrati" class="text-[#8B5A2B] font-semibold hover:text-[#6B3F18] transition-colors">
            Registrati
          </RouterLink>
        </p>
      </div>

      <!-- Back link -->
      <div class="text-center mt-6">
        <RouterLink to="/" class="text-sm text-[#9E7A5A] hover:text-[#8B5A2B] transition-colors inline-flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Torna alla home
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'

const router = useRouter()
const route  = useRoute()
const customerStore = useCustomerStore()

const sessionExpired = computed(() => route.query.session === 'expired')

const form = ref({ email: '', password: '' })
const errors = ref({})
const globalError = ref('')
const loading = ref(false)
const showPassword = ref(false)

function clearError(field) {
  errors.value[field] = ''
  globalError.value = ''
}

function validate() {
  const e = {}
  if (!form.value.email) e.email = 'Email obbligatoria'
  if (!form.value.password) e.password = 'Password obbligatoria'
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  globalError.value = ''

  try {
    const res = await fetch('/api/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.value.email, password: form.value.password }),
    })
    const data = await res.json()

    if (!res.ok) {
      globalError.value = data.error || 'Credenziali non valide'
      return
    }

    customerStore.login(data)
    const redirect = route.query.redirect || '/area-cliente'
    router.push(redirect)
  } catch {
    globalError.value = 'Errore di connessione. Riprova.'
  } finally {
    loading.value = false
  }
}
</script>
