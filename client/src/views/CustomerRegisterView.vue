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
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-[#2D1A0E] font-serif tracking-wide">Crea il tuo account</h1>
        <p class="text-sm text-[#9E7A5A] mt-1">Registrati per gestire le tue prenotazioni</p>
      </div>

      <!-- Card -->
      <div class="card p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Nome e cognome</label>
            <input
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="Maria Rossi"
              class="input-field"
              :class="{ 'border-red-400 focus:ring-red-400/30': errors.name }"
              @input="clearError('name')"
            />
            <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
          </div>

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

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Telefono</label>
            <input
              v-model="form.phone"
              type="tel"
              autocomplete="tel"
              placeholder="+39 333 000 0000"
              class="input-field"
              :class="{ 'border-red-400 focus:ring-red-400/30': errors.phone }"
              @input="clearError('phone')"
            />
            <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-[#2D1A0E] mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Almeno 8 caratteri"
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

          <!-- Privacy consent -->
          <div>
            <label class="flex items-start gap-3 cursor-pointer group">
              <div class="relative mt-0.5 shrink-0">
                <input
                  v-model="form.privacyConsent"
                  type="checkbox"
                  class="peer sr-only"
                  @change="clearError('privacyConsent')"
                />
                <div
                  class="w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center"
                  :class="form.privacyConsent
                    ? 'bg-[#8B5A2B] border-[#8B5A2B]'
                    : errors.privacyConsent
                      ? 'border-red-400 bg-white'
                      : 'border-[#C8A882] bg-white group-hover:border-[#8B5A2B]'"
                >
                  <svg v-if="form.privacyConsent" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
              </div>
              <span class="text-sm text-[#4A2C0E] leading-relaxed">
                Ho letto e accetto la
                <RouterLink to="/privacy-policy" target="_blank" class="text-[#8B5A2B] font-semibold hover:underline">
                  Privacy Policy
                </RouterLink>
                e la
                <RouterLink to="/cookie-policy" target="_blank" class="text-[#8B5A2B] font-semibold hover:underline">
                  Cookie Policy
                </RouterLink>.
                Acconsento al trattamento dei miei dati personali per la gestione dell'account e delle prenotazioni. <span class="text-red-500">*</span>
              </span>
            </label>
            <p v-if="errors.privacyConsent" class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {{ errors.privacyConsent }}
            </p>
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
            <span>{{ loading ? 'Registrazione in corso…' : 'Crea account' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-[#E8D5B7]"></div>
          <span class="text-xs text-[#9E7A5A]">hai già un account?</span>
          <div class="flex-1 h-px bg-[#E8D5B7]"></div>
        </div>

        <RouterLink
          to="/area-cliente/login"
          class="btn-secondary w-full flex items-center justify-center gap-2 text-center"
        >
          Accedi
        </RouterLink>
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
import { useRouter, RouterLink } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'

const router = useRouter()
const customerStore = useCustomerStore()

const form = ref({ name: '', email: '', phone: '', password: '', privacyConsent: false })
const errors = ref({})
const globalError = ref('')
const loading = ref(false)
const showPassword = ref(false)

const passwordRules = computed(() => [
  { label: 'Almeno 8 caratteri',     valid: form.value.password.length >= 8 },
  { label: 'Almeno una maiuscola',    valid: /[A-Z]/.test(form.value.password) },
  { label: 'Almeno un numero',        valid: /[0-9]/.test(form.value.password) },
])

function clearError(field) {
  errors.value[field] = ''
  globalError.value = ''
}

function validate() {
  const e = {}
  if (!form.value.name.trim())  e.name  = 'Nome obbligatorio'
  if (!form.value.email)        e.email = 'Email obbligatoria'
  if (!form.value.phone.trim()) e.phone = 'Telefono obbligatorio'
  if (!passwordRules.value.every(r => r.valid)) {
    e.password = 'La password non rispetta i requisiti'
  }
  if (!form.value.privacyConsent) {
    e.privacyConsent = 'Devi accettare la Privacy Policy per continuare'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleRegister() {
  if (!validate()) return
  loading.value = true
  globalError.value = ''

  try {
    const res = await fetch('/api/customer/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     form.value.name.trim(),
        email:    form.value.email,
        phone:    form.value.phone.trim(),
        password: form.value.password,
      }),
    })
    const data = await res.json()

    if (!res.ok) {
      // Server-side validation errors array
      if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach(err => {
          if (errors.value[err.path] === undefined) {
            errors.value[err.path] = err.msg
          }
        })
      } else {
        globalError.value = data.error || 'Errore durante la registrazione'
      }
      return
    }

    customerStore.login(data)
    router.push('/area-cliente')
  } catch {
    globalError.value = 'Errore di connessione. Riprova.'
  } finally {
    loading.value = false
  }
}
</script>
