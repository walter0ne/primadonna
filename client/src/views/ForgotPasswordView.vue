<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F5ECD8] via-[#FBF7F1] to-[#F0E2CE] flex items-center justify-center px-4 py-12">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-72 h-72 bg-[#8B5A2B]/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-20 -left-20 w-72 h-72 bg-[#A8703E]/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md animate-fadeInUp">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#A8703E] shadow-btn mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#FBF7F1]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-[#2D1A0E] font-serif tracking-wide">Password dimenticata?</h1>
        <p class="text-sm text-[#9E7A5A] mt-1">Inserisci la tua email e ti mandiamo il link</p>
      </div>

      <!-- Success state -->
      <div v-if="sent" class="card p-8 text-center">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 class="font-bold text-[#2D1A0E] text-lg mb-2">Email inviata!</h2>
        <p class="text-sm text-[#6B4226] mb-6">
          Se l'email è registrata riceverai le istruzioni entro qualche minuto. Controlla anche la cartella spam.
        </p>
        <RouterLink to="/area-cliente/login" class="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5">
          Torna al login
        </RouterLink>
      </div>

      <!-- Form -->
      <div v-else class="card p-8">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="la-tua@email.it"
              class="input-field"
              :class="{ 'border-red-400': error }"
            />
            <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full flex items-center justify-center gap-2">
            <svg v-if="loading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'Invio in corso…' : 'Invia link di reset' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <RouterLink to="/area-cliente/login" class="text-sm text-[#9E7A5A] hover:text-[#8B5A2B] transition-colors inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Torna al login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email   = ref('')
const loading = ref(false)
const error   = ref('')
const sent    = ref(false)

async function handleSubmit() {
  if (!email.value) { error.value = 'Inserisci la tua email'; return }
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/customer/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
    if (!res.ok) {
      const d = await res.json()
      error.value = d.error || 'Errore. Riprova.'
      return
    }
    sent.value = true
  } catch {
    error.value = 'Errore di connessione. Riprova.'
  } finally {
    loading.value = false
  }
}
</script>
