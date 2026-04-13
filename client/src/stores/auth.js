import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ── Decodifica il payload di un JWT senza librerie esterne ──────────────────
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

// Restituisce true se il token è ancora valido (non scaduto)
function isTokenValid(token) {
  if (!token) return false
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  // exp è in secondi Unix
  if (!payload.exp) return true // nessuna scadenza → consideriamo valido
  return payload.exp * 1000 > Date.now()
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('pd_token') || null)
  const admin = ref(JSON.parse(localStorage.getItem('pd_admin') || 'null'))

  // ── Autenticato SOLO se il token esiste E non è scaduto ────────────────────
  const isAuthenticated = computed(() => isTokenValid(token.value))

  // Se il token salvato è già scaduto al caricamento, puliamo subito
  if (token.value && !isTokenValid(token.value)) {
    token.value = null
    admin.value = null
    localStorage.removeItem('pd_token')
    localStorage.removeItem('pd_admin')
  }

  function login(data) {
    token.value = data.token
    admin.value = data.admin
    localStorage.setItem('pd_token', data.token)
    localStorage.setItem('pd_admin', JSON.stringify(data.admin))
  }

  function logout() {
    token.value = null
    admin.value = null
    localStorage.removeItem('pd_token')
    localStorage.removeItem('pd_admin')
  }

  // Chiamato da useApi quando il server risponde 401/403
  function forceLogout() {
    logout()
  }

  return { token, admin, isAuthenticated, login, logout, forceLogout }
})
