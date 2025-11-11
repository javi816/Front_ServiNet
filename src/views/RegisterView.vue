<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center-container">
        <form @submit.prevent="registrar">
          <p>Crear Cuenta</p>

          <!-- Campo Nombre -->
          <ion-input
            label="Nombre"
            label-placement="floating"
            fill="outline"
            placeholder="Ingresa tu nombre"
            v-model="name"
            required
          ></ion-input>

          <!-- Campo Correo -->
          <ion-input
            label="Correo electrónico"
            label-placement="floating"
            fill="outline"
            type="email"
            placeholder="Ingresa tu correo"
            v-model="email"
            required
          ></ion-input>

          <!-- Campo Contraseña -->
          <ion-input
            label="Contraseña"
            label-placement="floating"
            fill="outline"
            type="password"
            placeholder="Crea una contraseña"
            v-model="password"
            required
          ></ion-input>

          <!-- Confirmar Contraseña -->
          <ion-input
            label="Confirmar contraseña"
            label-placement="floating"
            fill="outline"
            type="password"
            placeholder="Repite tu contraseña"
            v-model="password_confirmation"
            required
          ></ion-input>

          <!-- Botón de registro -->
          <ion-button expand="block" color="primary" type="submit" :disabled="loading">
            <ion-spinner v-if="loading" name="crescent" />
            <span v-else>Registrarse</span>
          </ion-button>

          <!-- Mensaje de error -->
          <ion-text color="danger" v-if="error">
            <p>{{ error }}</p>
          </ion-text>

          <!-- Link a login -->
          <ion-button expand="block" fill="clear" router-link="/login">
            ¿Ya tienes cuenta? Inicia sesión
          </ion-button>
        </form>
      </div>
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
}

p {
  color: white;
  font-size: x-large;
  margin-bottom: 10px;
}

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4%;
  height: 100%;
  box-sizing: border-box;
  margin-bottom: 10%;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

ion-input {
  --background: #0d1117;
  --color: #ffffff;
  --placeholder-color: #999;
  --border-color: #30363d;
  --highlight-color-focused: #4da3ff;
}

ion-button {
  margin-top: 8px;
}

ion-text p {
  margin-top: 8px;
  font-size: 0.9rem;
}
</style>