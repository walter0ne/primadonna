import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useCustomerStore } from '../stores/customer.js'

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

    // ── Area Cliente ───────────────────────────────────────────────────────
    {
      path: '/area-cliente/login',
      component: () => import('../views/CustomerLoginView.vue'),
      meta: { requiresCustomerGuest: true },
    },
    {
      path: '/area-cliente/registrati',
      component: () => import('../views/CustomerRegisterView.vue'),
      meta: { requiresCustomerGuest: true },
    },
    {
      path: '/area-cliente',
      component: () => import('../views/CustomerDashboardView.vue'),
      meta: { requiresCustomerAuth: true },
    },
    {
      path: '/area-cliente/password-dimenticata',
      component: () => import('../views/ForgotPasswordView.vue'),
    },
    {
      path: '/area-cliente/reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
    },

    // ── Auth admin ─────────────────────────────────────────────────────────
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

    // ── Legal ──────────────────────────────────────────────────────────────
    {
      path: '/privacy-policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
    },
    {
      path: '/cookie-policy',
      component: () => import('../views/CookiePolicyView.vue'),
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
  const authStore     = useAuthStore()
  const customerStore = useCustomerStore()

  // 1. Rotta admin protetta → non autenticato → login admin
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      path: '/admin/login',
      query: { redirect: to.fullPath },
    }
  }

  // 2. Pagina login admin → già autenticato → dashboard admin
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { path: '/admin' }
  }

  // 3. Area cliente protetta → non autenticato → login cliente
  if (to.meta.requiresCustomerAuth && !customerStore.isAuthenticated) {
    return {
      path: '/area-cliente/login',
      query: { redirect: to.fullPath },
    }
  }

  // 4. Login/register cliente → già loggato → dashboard cliente
  if (to.meta.requiresCustomerGuest && customerStore.isAuthenticated) {
    return { path: '/area-cliente' }
  }

  // 5. Pagina successo prenotazione → accesso diretto (URL digitato) → home
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
