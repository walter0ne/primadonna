import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch { return null }
}

function isTokenValid(token) {
  if (!token) return false
  const p = decodeJwtPayload(token)
  if (!p) return false
  if (!p.exp) return true
  return p.exp * 1000 > Date.now()
}

export const useCustomerStore = defineStore('customer', () => {
  const token    = ref(localStorage.getItem('pd_customer_token') || null)
  const customer = ref(JSON.parse(localStorage.getItem('pd_customer') || 'null'))

  const isAuthenticated = computed(() => isTokenValid(token.value))

  // Pulizia al caricamento se scaduto
  if (token.value && !isTokenValid(token.value)) {
    token.value    = null
    customer.value = null
    localStorage.removeItem('pd_customer_token')
    localStorage.removeItem('pd_customer')
  }

  function login(data) {
    token.value    = data.token
    customer.value = data.customer
    localStorage.setItem('pd_customer_token', data.token)
    localStorage.setItem('pd_customer', JSON.stringify(data.customer))
  }

  function logout() {
    token.value    = null
    customer.value = null
    localStorage.removeItem('pd_customer_token')
    localStorage.removeItem('pd_customer')
  }

  function forceLogout() { logout() }

  return { token, customer, isAuthenticated, login, logout, forceLogout }
})
