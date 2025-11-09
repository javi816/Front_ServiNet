// src/router/index.ts
import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import LoadingPage from '@/views/LoadingPage.vue'
import NegociosFeedView from '@/views/NegociosFeedView.vue'
import MiNegocioView from '@/views/MiNegocioView.vue'
import Debug from '@/views/Debug.vue'
import SolicitudesView from '@/views/SolicitudesView.vue'
import EmpleadoList from '@/views/EmpleadoList.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: LoadingPage,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (token) next({ name: 'Home' })
      else next({ name: 'Login' })
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/negocios-feed',
    name: 'negocios-feed',
    component: NegociosFeedView,
    meta: { requiresAuth: true },
  },
  {
    path: '/mi-negocio',
    name: 'mi-negocio',
    component: MiNegocioView,
    meta: { requiresAuth: true },
  },
  {
    path: '/debug',
    name: 'debug',
    component: Debug,
    meta: {requiresAuth: true}
  },
  {
    path: '/solicitudes',
    name: 'solicitudes',
    component: SolicitudesView,
    meta: { requiresAuth: true, requiresAdmin: true}
  },
   {
    path: '/empleados',
    name: 'Empleados',
    component: EmpleadoList,
  },
  {
  path: '/register',
  name: 'Register',
  component: RegisterView,
  },
  {
  path: '/perfil',
  name: 'Perfil',
  component: () => import('@/views/PerfilView.vue'),
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ===============================
// Global guard
// ===============================
import { authService } from '@/services/authService'
router.beforeEach((to, from, next) => {
  const token = authService.getToken()
  const user = authService.getUser()

  // Si la ruta requiere auth y no hay token -> redirigir al login
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }
  // Si la ruta requiere admin y el usuario no es admin -> redirigir al home
  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    return next({ name: 'Home' }) // O a otra ruta de tu preferencia
  }

  // Si el usuario ya está logueado y quiere ir al login -> redirigir al home
  if (to.name === 'Login' && token) {
    return next({ name: 'Home' })
  }

  next()
})

export default router
