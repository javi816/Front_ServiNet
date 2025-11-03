import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import { token, user, loadSession } from '../services/auth';
import LoginPage from '../views/LoginPage.vue';
import PruebaPage from '../views/PruebaPage.vue';
import ServiciosList from '@/views/servicios/ServiciosList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/prueba',
    name: 'Prueba',
    component: PruebaPage,
    meta: { requiresAuth: true }  // Esta ruta requiere ser admin
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }  // Esta ruta requiere estar logueado
  },


  {
  path: '/negocios/:id_negocio/servicios',
  name: 'Servicios',
  component: () => import('@/views/servicios/ServiciosList.vue')
}
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  
  // PASO 1: Si no hay token, intentamos cargarlo del dispositivo
  if (!token.value) {
    await loadSession();
  }

  // PASO 2: Verificamos si la ruta requiere autenticación
  const requiresAuth = to.meta.requiresAuth;
  
  if (requiresAuth && !token.value) {
    // Si la ruta necesita login y NO hay token → Redirigir a login
    return next({ name: 'Login' });
  }

  // PASO 3: Verificamos si la ruta requiere ser admin
  const requiresAdmin = to.meta.requiresAdmin;
  
  if (requiresAdmin) {
    // Aquí verificamos si el usuario tiene rol de admin
    // Asumiendo que Laravel devuelve user.role o user.roles
    const isAdmin = user.value?.role === 'admin' || user.value?.roles?.includes('admin');
    
    if (!isAdmin) {
      // Si NO es admin → Redirigir a home o mostrar error
      alert('No tienes permisos para acceder a esta página');
      return next({ name: 'Home' });
    }
  }

  // PASO 4: Si todo está bien, dejamos pasar
  next();
});

export default router;
