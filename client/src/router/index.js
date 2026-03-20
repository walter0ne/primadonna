import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/prenota',
      component: () => import('../views/BookingView.vue'),
    },
    {
      path: '/prenotazione-confermata',
      component: () => import('../views/BookingSuccessView.vue'),
    },
    {
      path: '/admin/login',
      component: () => import('../views/AdminLoginView.vue'),
    },
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
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      return { path: '/admin/login' }
    }
  }
})

export default router
