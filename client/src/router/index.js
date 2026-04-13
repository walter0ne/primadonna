import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ── Pubbliche ──────────────────────────────────────────────────────────
    {
      path: '/',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/prenota',
      component: () => import('../views/BookingView.vue'),
    },
    {
      // Accessibile solo se arriva dal flusso di prenotazione
      path: '/prenotazione-confermata',
      component: () => import('../views/BookingSuccessView.vue'),
      meta: { requiresBooking: true },
    },

    // ── Auth ───────────────────────────────────────────────────────────────
    {
      // Già loggato → redirect a /admin
      path: '/admin/login',
      component: () => import('../views/AdminLoginView.vue'),
      meta: { requiresGuest: true },
    },

    // ── Admin (protette) ───────────────────────────────────────────────────
    {
      path: '/admin',
      component: () => import('../views/AdminDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/appuntamenti',
      component: () => import('../views/AdminAppointments.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/servizi',
      component: () => import('../views/AdminServices.vue'),
      meta: { requiresAuth: true },
    },

    // ── Catch-all: qualsiasi URL sconosciuto → home ────────────────────────
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],

  scrollBehavior() {
    return { top: 0 }
  },
})

// ── Guard globale ──────────────────────────────────────────────────────────
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // 1. Rotta protetta → non autenticato → login (con redirect di ritorno)
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/admin/login',
      query: { redirect: to.fullPath },
    }
  }

  // 2. Pagina login → già autenticato → dashboard
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { path: '/admin' }
  }

  // 3. Pagina successo prenotazione → accesso diretto (URL digitato) → home
  //    Legittima solo se si arriva dal flusso di prenotazione
  if (to.meta.requiresBooking) {
    const validSources = ['/prenota', '/prenotazione-confermata']
    if (!validSources.includes(from.path)) {
      return { path: '/' }
    }
  }
})

// ── Esportazione del router con accesso dall'esterno (usato da useApi) ─────
export default router
