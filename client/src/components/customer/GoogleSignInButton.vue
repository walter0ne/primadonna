<template>
  <div>
    <!-- Errore -->
    <p v-if="error" class="text-xs text-red-500 text-center mb-2">{{ error }}</p>

    <!-- Pulsante Google custom (si mostra finché GSI non è pronto) -->
    <div ref="googleButtonContainer" class="w-full flex justify-center min-h-[44px]">
      <!-- Placeholder durante il caricamento -->
      <div v-if="!gsiReady" class="w-full h-11 rounded-xl bg-[#F0E2CE] animate-pulse"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import { useRouter } from 'vue-router'

const props = defineProps({
  redirect: { type: String, default: '/area-cliente' },
})
const emit = defineEmits(['success', 'error'])

const customerStore = useCustomerStore()
const router        = useRouter()

const googleButtonContainer = ref(null)
const gsiReady = ref(false)
const error    = ref('')

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function handleCredentialResponse(response) {
  error.value = ''
  sendToBackend(response.credential)
}

async function sendToBackend(credential) {
  try {
    const res = await fetch('/api/customer/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error || 'Errore con Google. Riprova.'
      emit('error', error.value)
      return
    }
    customerStore.login(data)
    emit('success', data)
    router.push(props.redirect)
  } catch {
    error.value = 'Errore di connessione. Riprova.'
    emit('error', error.value)
  }
}

function initGSI() {
  if (!window.google || !CLIENT_ID) return

  window.google.accounts.id.initialize({
    client_id:         CLIENT_ID,
    callback:          handleCredentialResponse,
    auto_select:       false,
    cancel_on_tap_outside: true,
  })

  window.google.accounts.id.renderButton(googleButtonContainer.value, {
    theme:  'outline',
    size:   'large',
    width:  '100%',
    text:   'continue_with',
    locale: 'it',
    shape:  'rectangular',
  })

  gsiReady.value = true
}

function loadGSIScript() {
  if (document.getElementById('gsi-script')) {
    // Script già caricato
    if (window.google) { initGSI() } else {
      window.addEventListener('google-gsi-loaded', initGSI, { once: true })
    }
    return
  }
  const script = document.createElement('script')
  script.id  = 'gsi-script'
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => {
    window.dispatchEvent(new Event('google-gsi-loaded'))
    initGSI()
  }
  document.head.appendChild(script)
}

onMounted(() => {
  if (!CLIENT_ID) {
    error.value = 'Google Client ID non configurato'
    return
  }
  loadGSIScript()
})

onUnmounted(() => {
  // Cancella il prompt se aperto
  if (window.google?.accounts?.id) {
    window.google.accounts.id.cancel()
  }
})
</script>
