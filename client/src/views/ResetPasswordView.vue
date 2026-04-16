<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F5ECD8] via-[#FBF7F1] to-[#F0E2CE] flex items-center justify-center px-4 py-12">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-72 h-72 bg-[#8B5A2B]/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-72 h-72 bg-[#A8703E]/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md animate-fadeInUp">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#A8703E] shadow-btn mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#FBF7F1]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-[#2D1A0E] font-serif tracking-wide">Nuova password</h1>
        <p class="text-sm text-[#9E7A5A] mt-1">Scegli una nuova password sicura</p>
      </div>

      <!-- Token non valido -->
      <div v-if="!token" class="card p-8 text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p class="text-sm text-[#6B4226] mb-4">Link non valido. Richiedi un nuovo link di reset.</p>
        <RouterLink to="/area-cliente/password-dimenticata" class="btn-primary text-sm px-5 py-2.5 inline-block">
          Richiedi nuovo link
        </RouterLink>
      </div>

      <!-- Successo -->
      <div v-else-if="success" class="card p-8 text-center">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h2 class="font-bold text-[#2D1A0E] text-lg mb-2">Password aggiornata!</h2>
        <p class="text-sm text-[#6B4226] mb-6">Puoi ora accedere con la tua nuova password.</p>
        <RouterLink to="/area-cliente/login" class="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5">
          Vai al login
        </RouterLink>
      </div>

      <!-- Form reset -->
      <div v-else class="card p-8">
        <form @submit.prevent="handleReset" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Nuova password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Almeno 8 caratteri"
                class="input-field pr-12"
                :class="{ 'border-red-400': errors.password }"
                @input="errors.password = ''"
              />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E7A5A] hover:text-[#8B5A2B] transition-colors">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
            <!-- Password rules -->
            <div class="mt-2 space-y-1">
              <div v-for="rule in passwordRules" :key="rule.label" class="flex items-center gap-1.5">
                <svg v-if="rule.valid" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#C8A882]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <span class="text-xs" :class="rule.valid ? 'text-green-600' : 'text-[#9E7A5A]'">{{ rule.label }}</span>
              </div>
            </div>
            <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Conferma password</label>
            <input
              v-model="form.confirm"
              type="password"
              placeholder="Ripeti la password"
              class="input-field"
              :class="{ 'border-red-400': errors.confirm }"
              @input="errors.confirm = ''"
            />
            <p v-if="errors.confirm" class="mt-1 text-xs text-red-500">{{ errors.confirm }}</p>
          </div>

          <div v-if="globalError" class="p-3 rounded-xl bg-red-50 border border-red-200">
            <p class="text-sm text-red-600 text-center">{{ globalError }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full flex items-center justify-center gap-2">
            <svg v-if="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'Salvataggio…' : 'Salva nuova password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const token = route.query.token || ''

const form        = ref({ password: '', confirm: '' })
const errors      = ref({})
const globalError = ref('')
const loading     = ref(false)
const success     = ref(false)
const showPassword = ref(false)

const passwordRules = computed(() => [
  { label: 'Almeno 8 caratteri',  valid: form.value.password.length >= 8 },
  { label: 'Almeno una maiuscola', valid: /[A-Z]/.test(form.value.password) },
  { label: 'Almeno un numero',     valid: /[0-9]/.test(form.value.password) },
])

function validate() {
  const e = {}
  if (!passwordRules.value.every(r => r.valid)) e.password = 'La password non rispetta i requisiti'
  if (form.value.password !== form.value.confirm) e.confirm = 'Le password non coincidono'
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleReset() {
  if (!validate()) return
  loading.value = true
  globalError.value = ''
  try {
    const res = await fetch('/api/customer/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: form.value.password }),
    })
    const data = await res.json()
    if (!res.ok) { globalError.value = data.error || 'Errore. Riprova.'; return }
    success.value = true
  } catch {
    globalError.value = 'Errore di connessione. Riprova.'
  } finally {
    loading.value = false
  }
}
</script>
