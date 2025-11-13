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
import ServiciosNegociosView from '@/views/ServiciosNegociosView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CitasUsuarioView from '@/views/CitasUsuarioView.vue'
import AgendarCitaView from '@/views/AgendarCitaView.vue'

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
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitudes',
    name: 'solicitudes',
    component: SolicitudesView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/empleados',
    name: 'Empleados',
    component: EmpleadoList,
    meta: {requiresAuth: true}
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
  meta: {requiresAuth: true}
  },

  {
    path: '/servicios/:id_negocio',
    name: 'servicios',
    component : ServiciosNegociosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/citas/agendar/:id_negocio/:id_servicio',
    name: 'AgendarCita',
    component: AgendarCitaView,
    meta: { requiresAuth: true}
  },
  {
    path: '/citas-usuario',
    name: 'citas-usuario',
    component : CitasUsuarioView,
    meta: { requiresAuth: true }
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
  const negocioData = authService.getNegocio() // { negocio, rol }

  // Requiere autenticación
  if (to.meta.requiresAuth && !token) return next({ name: 'Login' })

  // Requiere admin general
  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) return next({ name: 'Home' })

  // Requiere admin de negocio
  if (to.meta.requiresNegocioAdmin && (!negocioData || negocioData.rol !== 'admin')) return next({ name: 'Home' })

  // Requiere empleado o admin de negocio
  if (to.meta.requiresNegocioEmpleado && (!negocioData || !['admin','empleado'].includes(negocioData.rol))) return next({ name: 'Home' })

  // Si ya está logueado e intenta ir a login
  if (to.name === 'Login' && token) return next({ name: 'Home' })

  next()
})


export default router
