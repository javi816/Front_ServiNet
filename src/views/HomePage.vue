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
import { authService, currentUser } from '@/services/authService';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent
} from '@ionic/vue';

const router = useRouter();
const user = computed(() => currentUser.value);
const isAdmin = computed(() => user.value?.role === 'admin');
const handleLogout = async () => {
  await authService.logout();
};
</script>

<style scoped>
ion-card {
  margin-top: 16px;
}
</style>
