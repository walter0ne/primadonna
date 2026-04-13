import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import router from '../router/index.js'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export function useApi() {
  const loading = ref(false)
  const error   = ref(null)

  async function request(path, options = {}) {
    loading.value = true
    error.value   = null

    try {
      const authStore = useAuthStore()
      const headers = { 'Content-Type': 'application/json', ...options.headers }

      // Aggiunge il token Bearer se presente
      if (authStore.token) {
        headers.Authorization = `Bearer ${authStore.token}`
      }

      const res  = await fetch(`${BASE_URL}${path}`, { ...options, headers })
      const data = await res.json().catch(() => ({}))

      // ── Gestione errori di autenticazione ────────────────────────────────
      if (res.status === 401) {
        // Token scaduto o non valido → logout forzato + redirect login
        authStore.forceLogout()
        router.push({ path: '/admin/login', query: { session: 'expired' } })
        throw new Error('Sessione scaduta. Effettua nuovamente il login.')
      }

      if (res.status === 403) {
        // Autenticato ma non autorizzato
        throw new Error('Non hai i permessi per eseguire questa azione.')
      }

      if (res.status === 429) {
        // Rate limiting
        throw new Error('Troppe richieste. Riprova tra qualche secondo.')
      }

      if (!res.ok) {
        throw new Error(data.error || `Errore ${res.status}`)
      }

      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const get  = (path, params) => {
    const url = params ? `${path}?${new URLSearchParams(params)}` : path
    return request(url)
  }
  const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
  const put  = (path, body) => request(path, { method: 'PUT',  body: JSON.stringify(body) })
  const del  = (path)       => request(path, { method: 'DELETE' })

  return { loading, error, get, post, put, del }
}
