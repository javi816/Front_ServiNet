<!-- src/views/auth/RegisterView.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Crear Cuenta</ion-card-title>
          <ion-card-subtitle>Ingresa tus datos para registrarte</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label position="floating">Nombre</ion-label>
              <ion-input v-model="name" />
            </ion-item>

            <ion-item>
              <ion-label position="floating">Correo electrónico</ion-label>
              <ion-input type="email" v-model="email" />
            </ion-item>

            <ion-item>
              <ion-label position="floating">Contraseña</ion-label>
              <ion-input type="password" v-model="password" />
            </ion-item>

            <ion-item>
              <ion-label position="floating">Confirmar contraseña</ion-label>
              <ion-input type="password" v-model="password_confirmation" />
            </ion-item>
          </ion-list>

          <ion-button expand="block" color="primary" @click="registrar" :disabled="loading">
            <ion-spinner v-if="loading" name="crescent" />
            <span v-else>Registrarse</span>
          </ion-button>

          <p v-if="error" class="error-text">{{ error }}</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonList, IonItem, IonLabel, IonInput,
  IonButton, IonSpinner
} from '@ionic/vue';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const loading = ref(false);
const error = ref('');

const registrar = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authService.register(name.value, email.value, password.value, password_confirmation.value);
    router.push({ name: 'Home' }); // Redirige al home o dashboard
  } catch (err: any) {
    error.value = err.message || 'Error al registrarse';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.error-text {
  color: #f44336;
  text-align: center;
  margin-top: 10px;
}
</style>
