<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="center-container">
        
        <form @submit.prevent="handleLogin">
          <p>Iniciar Sesión</p>
          <!-- Campo Email -->
          <ion-input label="Email" label-placement="floating" fill="outline" type="email"
            placeholder="Ingresa tu correo" v-model="email" required></ion-input>

          <!-- Campo Contraseña -->
          <ion-input label="Contraseña" label-placement="floating" fill="outline" type="password"
            placeholder="Ingresa tu contraseña" v-model="password" required></ion-input>

          <!-- Mensaje de error -->
          <ion-text color="danger" v-if="errorMessage">
            <p>{{ errorMessage }}</p>
          </ion-text>

          <!-- Botón de Login -->
          <ion-button expand="block" type="submit" :disabled="loading" class="ion-margin-top">
            {{ loading ? "Cargando..." : "Iniciar Sesión" }}
          </ion-button>

          <!-- Link a registro (si aplica) -->
          <ion-button expand="block" fill="clear" router-link="/register">
            ¿No tienes cuenta? Regístrate
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/services/authService";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
} from "@ionic/vue";

const router = useRouter();

// Campos reactivos
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

// Función principal de login
const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const user = await authService.login(email.value, password.value);
    console.log("Usuario autenticado:", user);
    router.push("/home");
  } catch (error: any) {
    console.error("Error en login:", error);
    errorMessage.value =
      error.response?.data?.message ||
      "Credenciales incorrectas o error de conexión.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

ion-page {
  --background: #0d1117;
}
p{
  color: white;
  font-size: x-large;
}
.center-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2%;
  box-sizing: border-box;
  gap: 3vh;
}
.center-container ion-input{
  margin-top: 8%;
  margin-bottom: 1%;
}

.center-container ion-button{
  margin-top: 10%;
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
