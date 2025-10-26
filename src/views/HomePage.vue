<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Inicio</ion-title>
        <!-- Botón de logout en el header -->
        <ion-buttons slot="end">
          <ion-button @click="handleLogout">
            Cerrar Sesión
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      
      <!-- Mostrar datos del usuario -->
      <ion-card v-if="user">
        <ion-card-header>
          <ion-card-title>¡Bienvenido!</ion-card-title>
          <ion-card-subtitle>{{ user.name }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Rol:</strong> {{ user.role || 'usuario' }}</p>
        </ion-card-content>
      </ion-card>
      
      <!-- Botón para ir al Dashboard (solo si es admin) -->
      <ion-button 
        v-if="isAdmin" 
        expand="block" 
        router-link="/dashboard"
        color="primary"
      >
        Ir al Dashboard (Solo Admin)
      </ion-button>
      
      <!-- Si NO es admin, mostrar mensaje -->
      <ion-card v-else>
        <ion-card-content>
          <p>No tienes acceso al Dashboard (solo para administradores)</p>
        </ion-card-content>
      </ion-card>
      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { user, logout } from '../services/auth';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent
} from '@ionic/vue';

// ==============================================================
// Variables
// ==============================================================
const router = useRouter();

// Verificamos si el usuario es admin
// user.value viene del servicio auth.ts y es reactivo
const isAdmin = computed(() => {
  return user.value?.role === 'admin' || user.value?.roles?.includes('admin');
});

// ==============================================================
// Función para hacer logout
// ==============================================================
const handleLogout = async () => {
  await logout();  // Llamamos la función logout del servicio
  router.push('/login');  // Redirigimos al login
};
</script>