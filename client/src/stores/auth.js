import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('pd_token') || null)
  const admin = ref(JSON.parse(localStorage.getItem('pd_admin') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

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

  return { token, admin, isAuthenticated, login, logout }
})
