<!-- src/views/auth/RegisterView.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
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
ion-page {
  --background: #0d1117;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

ion-header {
  --background: #0d1117;
  border: none;
}


ion-title {
  font-size: 1.6rem;
}

ion-content {
  --background: #0d1117;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 25px;
}

form {
  background: #161b22;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid #21262d;
  padding: 35px 25px;
  width: 100%;
  max-width: 380px;
  text-align: center;
}

ion-list{
  --background: #b6c0cf;
}

ion-item {
  --background: #161b22;
  --border-color: #333;
  --highlight-height: 2px;
}

ion-card {
  background: #161b22;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid #21262d;
  width: 90%;
  max-width: 400px;
  color: #fff;
  text-align: center;
  margin-top: 25px;
}

ion-label {
  color: #aaa;
  font-size: 0.9rem;
  padding: 5%;
}


ion-input {
  color: #fff;
  margin-top: 6px;
}

ion-button {
  --background: #1e88e5;
  --background-hover: #42a5f5;
  --border-radius: 10px;
  margin-top: 15px;
  font-weight: 600;
}

ion-button[fill="clear"] {
  --color: #90caf9;
  font-size: 0.9rem;
  margin-top: 5px;
}

ion-text p {
  color: #ef5350;
  font-size: 0.85rem;
  margin-top: 5px;
}
</style>

