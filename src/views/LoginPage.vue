<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="tertiary">
                <ion-title>Iniciar Sesión</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <form @submit.prevent="handleLogin">
                <!-- Campo Email -->
                <ion-item>
                    <ion-label position="floating">Email</ion-label>
                    <ion-input v-model="email" type="email" required></ion-input>
                </ion-item>

                <!-- Campo Contraseña -->
                <ion-item>
                    <ion-label position="floating">Contraseña</ion-label>
                    <ion-input v-model="password" type="password" required></ion-input>
                </ion-item>

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

ion-item {
  --background: transparent;
  --border-color: #333;
  --highlight-height: 2px;
  margin-bottom: 18px;
  border-radius: 10px;
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

